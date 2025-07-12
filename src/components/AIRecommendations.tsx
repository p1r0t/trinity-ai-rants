import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  tags: string[] | null;
  published_at: string;
}

interface AIRecommendationsProps {
  user: User | null;
  articles: Article[];
}

const AIRecommendations = ({ user, articles }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [personalizedTags, setPersonalizedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (articles.length > 0) {
      generateRecommendations();
    }
  }, [articles, user]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      let userReactions: any[] = [];
      
      // Получаем предпочтения пользователя из реакций
      if (user) {
        const { data } = await supabase
          .from('reactions')
          .select(`
            reaction_type,
            article_id,
            articles (
              tags,
              title
            )
          `)
          .eq('user_id', user.id)
          .eq('reaction_type', 'smart');
        
        userReactions = data || [];
      }

      // Анализируем предпочтения пользователя
      const userPreferredTags = userReactions
        .flatMap(r => r.articles?.tags || [])
        .reduce((acc: Record<string, number>, tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});

      const topTags = Object.entries(userPreferredTags)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([tag]) => tag);

      setPersonalizedTags(topTags);

      // Смешанная рекомендательная система
      const recentArticles = articles
        .filter(article => {
          const daysDiff = Math.abs(new Date().getTime() - new Date(article.published_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7; // Только статьи за последнюю неделю
        })
        .slice(0, 8);

      let recommended: Article[] = [];

      if (topTags.length > 0) {
        // Персонализированные рекомендации на основе предпочтений
        const personalizedRecs = recentArticles
          .filter(article => 
            article.tags?.some(tag => topTags.includes(tag))
          )
          .slice(0, 2);
        
        recommended = [...personalizedRecs];
      }

      // Трендовые статьи (если недостаточно персонализированных)
      if (recommended.length < 3) {
        const trendingRecs = recentArticles
          .filter(article => !recommended.find(r => r.id === article.id))
          .sort(() => Math.random() - 0.5) // Псевдослучайная сортировка
          .slice(0, 3 - recommended.length);
        
        recommended = [...recommended, ...trendingRecs];
      }

      setRecommendations(recommended);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Sparkles className="mr-2 animate-spin" size={20} />
            AI генерирует рекомендации...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/30 backdrop-blur-sm hover:border-violet-400/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Sparkles className="mr-2 text-violet-400" size={20} />
          {user ? 'Персональные рекомендации' : 'Трендовые статьи'}
        </CardTitle>
        {personalizedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-xs text-violet-300">На основе ваших интересов:</span>
            {personalizedTags.map(tag => (
              <Badge key={tag} variant="outline" className="border-violet-500/50 text-violet-300 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((article, index) => (
            <div key={article.id} className="group">
              <Link to={`/news/${article.id}`}>
                <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-violet-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {index === 0 && personalizedTags.length > 0 ? (
                        <Zap className="text-yellow-400" size={16} />
                      ) : (
                        <TrendingUp className="text-violet-400" size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm group-hover:text-violet-300 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      {article.summary && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="text-gray-500" size={12} />
                        <span className="text-gray-500 text-xs">
                          {new Date(article.published_at).toLocaleDateString('ru-RU')}
                        </span>
                        {article.tags && (
                          <Badge variant="outline" className="border-violet-500/30 text-violet-400 text-xs">
                            {article.tags[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-6">
            <Sparkles className="mx-auto text-violet-400 mb-2" size={24} />
            <p className="text-gray-400 text-sm">
              {user ? 'Читайте больше статей, чтобы получить персональные рекомендации' : 'Скоро появятся новые статьи'}
            </p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="w-full mt-4 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
          onClick={generateRecommendations}
        >
          <Sparkles size={16} className="mr-2" />
          Обновить рекомендации
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;