import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award, 
  Crown,
  BookOpen,
  MessageSquare,
  Brain,
  Flame
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  requirement: number;
  current: number;
  category: 'reading' | 'reactions' | 'comments' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
}

interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  articlesRead: number;
  reactionsGiven: number;
  commentsPosted: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
}

interface GamificationProps {
  user: User | null;
}

const Gamification = ({ user }: GamificationProps) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    experienceToNext: 100,
    articlesRead: 0,
    reactionsGiven: 0,
    commentsPosted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Предопределенные достижения
  const predefinedAchievements: Omit<Achievement, 'current' | 'unlocked'>[] = [
    {
      id: 'first_read',
      title: 'Первое знакомство',
      description: 'Прочитать первую статью',
      icon: BookOpen,
      requirement: 1,
      category: 'reading',
      rarity: 'common',
      points: 10
    },
    {
      id: 'reader_bronze',
      title: 'Любознательный читатель',
      description: 'Прочитать 10 статей',
      icon: BookOpen,
      requirement: 10,
      category: 'reading',
      rarity: 'common',
      points: 50
    },
    {
      id: 'reader_silver',
      title: 'Активный читатель',
      description: 'Прочитать 50 статей',
      icon: Star,
      requirement: 50,
      category: 'reading',
      rarity: 'rare',
      points: 200
    },
    {
      id: 'reader_gold',
      title: 'Книжный червь',
      description: 'Прочитать 100 статей',
      icon: Crown,
      requirement: 100,
      category: 'reading',
      rarity: 'epic',
      points: 500
    },
    {
      id: 'first_reaction',
      title: 'Первая реакция',
      description: 'Поставить первую реакцию',
      icon: Brain,
      requirement: 1,
      category: 'reactions',
      rarity: 'common',
      points: 5
    },
    {
      id: 'reaction_master',
      title: 'Мастер реакций',
      description: 'Поставить 100 реакций',
      icon: Zap,
      requirement: 100,
      category: 'reactions',
      rarity: 'rare',
      points: 150
    },
    {
      id: 'first_comment',
      title: 'Первый комментарий',
      description: 'Написать первый комментарий',
      icon: MessageSquare,
      requirement: 1,
      category: 'comments',
      rarity: 'common',
      points: 15
    },
    {
      id: 'commentator',
      title: 'Активный комментатор',
      description: 'Написать 25 комментариев',
      icon: MessageSquare,
      requirement: 25,
      category: 'comments',
      rarity: 'rare',
      points: 100
    },
    {
      id: 'streak_3',
      title: 'Постоянство',
      description: 'Читать 3 дня подряд',
      icon: Flame,
      requirement: 3,
      category: 'streak',
      rarity: 'common',
      points: 30
    },
    {
      id: 'streak_7',
      title: 'Недельный марафон',
      description: 'Читать 7 дней подряд',
      icon: Target,
      requirement: 7,
      category: 'streak',
      rarity: 'rare',
      points: 100
    },
    {
      id: 'streak_30',
      title: 'Легенда постоянства',
      description: 'Читать 30 дней подряд',
      icon: Trophy,
      requirement: 30,
      category: 'streak',
      rarity: 'legendary',
      points: 1000
    }
  ];

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Загружаем статистику пользователя
      const [articlesData, reactionsData, commentsData] = await Promise.all([
        // Количество прочитанных статей (можно добавить отдельную таблицу для отслеживания)
        supabase.from('reactions').select('article_id').eq('user_id', user.id),
        // Количество реакций
        supabase.from('reactions').select('*').eq('user_id', user.id),
        // Количество комментариев
        supabase.from('comments').select('*').eq('user_id', user.id)
      ]);

      const articlesRead = new Set(articlesData.data?.map(r => r.article_id) || []).size;
      const reactionsGiven = reactionsData.data?.length || 0;
      const commentsPosted = commentsData.data?.length || 0;

      // Рассчитываем уровень и опыт
      const totalActions = articlesRead * 10 + reactionsGiven * 2 + commentsPosted * 5;
      const level = Math.floor(totalActions / 100) + 1;
      const experience = totalActions % 100;
      const experienceToNext = 100 - experience;

      const stats: UserStats = {
        level,
        experience,
        experienceToNext,
        articlesRead,
        reactionsGiven,
        commentsPosted,
        currentStreak: Math.floor(Math.random() * 7) + 1, // Заглушка
        longestStreak: Math.floor(Math.random() * 15) + 5, // Заглушка
        totalPoints: totalActions
      };

      setUserStats(stats);

      // Обновляем достижения
      const updatedAchievements = predefinedAchievements.map(achievement => {
        let current = 0;
        switch (achievement.category) {
          case 'reading':
            current = stats.articlesRead;
            break;
          case 'reactions':
            current = stats.reactionsGiven;
            break;
          case 'comments':
            current = stats.commentsPosted;
            break;
          case 'streak':
            current = stats.currentStreak;
            break;
        }

        return {
          ...achievement,
          current,
          unlocked: current >= achievement.requirement
        };
      });

      setAchievements(updatedAchievements);

    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'legendary': return 'border-yellow-500/50 shadow-yellow-500/20 shadow-lg';
      default: return 'border-gray-500/50';
    }
  };

  if (!user) {
    return (
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardContent className="pt-6 text-center">
          <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground mb-4">
            Войдите в систему, чтобы отслеживать достижения
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/auth'}>
            Войти
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Level & Progress */}
      <Card className="bg-card/80 border-border/50 glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Star className="mr-2 text-primary" size={20} />
            Ваш уровень
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">Уровень {userStats.level}</div>
              <div className="text-sm text-muted-foreground">{userStats.totalPoints} очков опыта</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">До следующего уровня</div>
              <div className="text-lg font-semibold text-foreground">{userStats.experienceToNext} XP</div>
            </div>
          </div>
          
          <Progress 
            value={(userStats.experience / 100) * 100} 
            className="h-3"
          />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.articlesRead}</div>
              <div className="text-xs text-muted-foreground">Статей прочитано</div>
            </div>
            <div className="text-center p-3 bg-accent/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Дней подряд</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Award className="mr-2 text-primary" size={20} />
            Достижения ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    achievement.unlocked 
                      ? `${getRarityBorder(achievement.rarity)} bg-background/50` 
                      : 'border-border/30 bg-background/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? getRarityColor(achievement.rarity) 
                        : 'bg-muted'
                    }`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          {achievement.unlocked && (
                            <Badge variant="secondary" className={getRarityColor(achievement.rarity)}>
                              +{achievement.points} XP
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Прогресс</span>
                            <span>{achievement.current}/{achievement.requirement}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gamification;