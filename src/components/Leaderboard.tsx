import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface LeaderboardEntry {
  user_id: string;
  email: string;
  articlesRead: number;
  reactionsGiven: number;
  commentsPosted: number;
  totalPoints: number;
  level: number;
}

interface LeaderboardProps {
  user: User | null;
}

const Leaderboard = ({ user }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      // Получаем всех пользователей с их статистикой
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, email');

      if (!profiles) return;

      const leaderboardData = await Promise.all(
        profiles.map(async (profile) => {
          const [reactionsData, commentsData, viewsData] = await Promise.all([
            supabase.from('reactions').select('*').eq('user_id', profile.user_id),
            supabase.from('comments').select('*').eq('user_id', profile.user_id),
            supabase.from('article_views').select('article_id').eq('user_id', profile.user_id)
          ]);

          const reactionsGiven = reactionsData.data?.length || 0;
          const commentsPosted = commentsData.data?.length || 0;
          const articlesRead = new Set(viewsData.data?.map(v => v.article_id) || []).size;
          
          const totalPoints = articlesRead * 10 + reactionsGiven * 2 + commentsPosted * 5;
          const level = Math.floor(totalPoints / 100) + 1;

          return {
            user_id: profile.user_id,
            email: profile.email,
            articlesRead,
            reactionsGiven,
            commentsPosted,
            totalPoints,
            level
          };
        })
      );

      // Сортируем по количеству очков
      const sortedLeaderboard = leaderboardData
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);

      setLeaderboard(sortedLeaderboard);

      // Находим позицию текущего пользователя
      if (user) {
        const userIndex = sortedLeaderboard.findIndex(entry => entry.user_id === user.id);
        setUserRank(userIndex !== -1 ? userIndex + 1 : null);
      }

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-orange-500" size={20} />;
      default:
        return <Star className="text-primary" size={16} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500 font-bold';
      case 2:
        return 'text-gray-400 font-semibold';
      case 3:
        return 'text-orange-500 font-semibold';
      default:
        return 'text-foreground';
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardContent className="pt-6 text-center">
          <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            Войдите в систему, чтобы увидеть рейтинг
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-border/50 glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Trophy className="mr-2 text-primary" size={20} />
          Рейтинг читателей
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.user_id === user.id;
              
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isCurrentUser 
                      ? 'bg-primary/20 border border-primary/50' 
                      : 'bg-background/50 hover:bg-background/70'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getUserInitials(entry.email)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium truncate ${getRankColor(rank)}`}>
                        {entry.email.split('@')[0]}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          Вы
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Уровень {entry.level} • {entry.totalPoints} XP
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRankColor(rank)}`}>
                      #{rank}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.articlesRead} статей
                    </div>
                  </div>
                </div>
              );
            })}
            
            {userRank && userRank > 10 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/20 border border-primary/50">
                  <div className="flex items-center justify-center w-8 h-8">
                    <span className="text-primary font-bold">#{userRank}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">
                      Ваша позиция
                    </span>
                    <div className="text-sm text-muted-foreground">
                      Продолжайте читать, чтобы подняться выше!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;