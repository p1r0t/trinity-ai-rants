import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Clock, Eye, Volume2, Share2 } from 'lucide-react';
import ReactionButton from '@/components/ReactionButton';
import AudioPlayer from '@/components/AudioPlayer';
import ShareButton from '@/components/ShareButton';
import VoiceSelector from '@/components/VoiceSelector';
import TrinityAvatar from '@/components/TrinityAvatar';
import CommentSystem from '@/components/CommentSystem';
import Gamification from '@/components/Gamification';
import ReadingProgress from '@/components/ReadingProgress';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string | null;
  published_at: string;
  summary: string | null;
  audio_url: string | null;
  tags: string[] | null;
  processed: boolean;
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (id) {
      loadArticle(id);
      recordView(id);
    }
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadArticle = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .eq('processed', true)
        .single();

      if (error) throw error;
      
      setArticle(data);
      
      // Загружаем количество просмотров
      const { data: viewsData } = await supabase
        .from('article_views')
        .select('*', { count: 'exact' })
        .eq('article_id', articleId);
      
      setViews(viewsData?.length || 0);
    } catch (error) {
      console.error('Error loading article:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (articleId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('article_views')
        .upsert({ 
          article_id: articleId, 
          user_id: user.id 
        }, { 
          onConflict: 'article_id,user_id' 
        });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Статья не найдена</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" size={16} />
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <ReadingProgress />
      
      {/* Header */}
      <nav className="glass-effect border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover-lift">
                  <ArrowLeft className="mr-2" size={16} />
                  Назад
                </Button>
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Trinity AI News
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <ShareButton 
                title={article.title}
                text={article.summary || article.title}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Trinity Introduction */}
            <TrinityAvatar compact={true} />
            
            {/* Article Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {article.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-primary/50 text-primary">
                    {tag}
                  </Badge>
                ))}
                {article.audio_url && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/50">
                    <Volume2 size={12} className="mr-1" />
                    Аудио доступно
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {article.title}
              </h1>
              
              {article.summary && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  {article.author || 'Trinity AI'}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(article.published_at)}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  {getReadingTime(article.content)} мин чтения
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-2" />
                  {views} просмотров
                </div>
              </div>
            </div>

            {/* Audio Player */}
            {article.audio_url && (
              <Card className="bg-card/80 border-border/50 glass-effect">
                <CardContent className="pt-6">
                  <AudioPlayer audioUrl={article.audio_url} title={article.title} />
                </CardContent>
              </Card>
            )}

            {/* Article Content */}
            <Card className="bg-card/80 border-border/50 glass-effect">
              <CardContent className="pt-6">
                <div 
                  className="prose prose-invert max-w-none text-foreground"
                  style={{ 
                    color: 'hsl(var(--foreground))',
                    lineHeight: '1.8'
                  }}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
            </Card>

            {/* Reactions */}
            <Card className="bg-card/80 border-border/50 glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Ваша реакция?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <ReactionButton articleId={article.id} type="smart" user={user} />
                  <ReactionButton articleId={article.id} type="funny" user={user} />
                  <ReactionButton articleId={article.id} type="trash" user={user} />
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <CommentSystem articleId={article.id} user={user} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Generator */}
            {!article.audio_url && (
              <VoiceSelector 
                articleTitle={article.title}
                articleContent={article.content}
              />
            )}
            
            {/* Gamification */}
            <Gamification user={user} />
            
            {/* Related Articles */}
            <Card className="bg-card/80 border-border/50 glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Похожие статьи</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Скоро здесь появятся рекомендации на основе ИИ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card className="bg-card/80 border-border/50 glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Поделиться</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${article.title} - ${article.summary || ''}`;
                    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                    window.open(telegramUrl, '_blank');
                  }}
                >
                  <Share2 size={16} className="mr-2" />
                  Telegram
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${article.title}`;
                    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                    window.open(twitterUrl, '_blank');
                  }}
                >
                  <Share2 size={16} className="mr-2" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover-lift"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Share2 size={16} className="mr-2" />
                  Копировать ссылку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;