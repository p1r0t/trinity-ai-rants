import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";
import FilterBar from "@/components/FilterBar";
import StatsWidget from "@/components/StatsWidget";
import ReactionButton from "@/components/ReactionButton";
import AudioPlayer from "@/components/AudioPlayer";
import ShareButton from "@/components/ShareButton";
import MobileMenu from "@/components/MobileMenu";
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { PullToRefresh } from '@/components/PullToRefresh';
import TrinityAvatar from '@/components/TrinityAvatar';
import TrinityReactionResponse from '@/components/TrinityReactionResponse';
import AIRecommendations from '@/components/AIRecommendations';
import SmartFeed from '@/components/SmartFeed';
import FloatingActionButton from '@/components/FloatingActionButton';
import ReadingProgress from '@/components/ReadingProgress';
import Leaderboard from '@/components/Leaderboard';
import TelegramApp from '@/components/TelegramApp';
import NewsAPISettings from '@/components/NewsAPISettings';
import { Calendar, TrendingUp, Clock, User, LogOut, Settings, Headphones, Sparkles } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Mock data for podcasts
const mockPodcasts = [
  {
    id: 1,
    title: "Подкаст #15: Когда ИИ заменит подкастеров?",
    duration: "28:42",
    date: "2025-01-07",
    plays: 445
  },
  {
    id: 2,
    title: "Подкаст #14: Anthropic vs OpenAI - битва за этичность",
    duration: "32:15",
    date: "2025-01-03",
    plays: 623
  }
];

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

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArticles();
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      checkUserRole(user.id);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('processed', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      article.summary?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const handleRefresh = async () => {
    await loadArticles();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Secret admin access - triple click on logo
  const handleLogoClick = () => {
    const now = Date.now();
    const clicks = JSON.parse(localStorage.getItem('logoClicks') || '[]');
    clicks.push(now);
    
    // Keep only clicks from last 2 seconds
    const recentClicks = clicks.filter((click: number) => now - click < 2000);
    localStorage.setItem('logoClicks', JSON.stringify(recentClicks));
    
    if (recentClicks.length >= 3 && userRole === 'admin') {
      setShowAdminAccess(true);
      setTimeout(() => setShowAdminAccess(false), 5000);
    }
  };

  const categories = ["Все", "Технологии", "Мировые новости", "Бизнес", "Наука", "Россия", "Европа", "Азия", "RSS"];
  const displayedArticles = selectedCategory === "Все" 
    ? filteredArticles 
    : filteredArticles.filter(article => article.tags?.includes(selectedCategory));

  return (
    <TelegramApp>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 safe-top safe-bottom transition-colors duration-300">
        <ReadingProgress />
      {/* Header */}
      <nav className="glass-effect border-b border-border/50 sticky top-0 z-50 safe-left safe-right backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-primary via-accent-foreground to-secondary-foreground dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent cursor-pointer hover-lift"
                onClick={handleLogoClick}
              >
                <Sparkles className="inline mr-2" size={24} />
                Trinity AI News
              </h1>
              <div className="hidden md:flex space-x-6 overflow-x-auto">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors hover-lift px-3 py-2 rounded-lg">
                  Главная
                </Link>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors hover-lift px-3 py-2 rounded-lg">
                  Категории
                </Link>
                <Link to="/podcasts" className="text-muted-foreground hover:text-foreground transition-colors hover-lift px-3 py-2 rounded-lg">
                  Подкасты
                </Link>
                <Link to="/stats" className="text-muted-foreground hover:text-foreground transition-colors hover-lift px-3 py-2 rounded-lg">
                  Статистика
                </Link>
                {showAdminAccess && userRole === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-orange-300 hover:text-orange-200 transition-colors animate-pulse"
                  >
                    🔧 Управление
                  </Link>
                 )}
               </div>
             </div>
             
             <div className="flex items-center space-x-2">
               <SearchBar onSearch={handleSearch} className="hidden md:block" />
               <ThemeToggle />
             </div>
             
             <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300 hidden sm:inline">
                    Привет, {user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white hidden sm:inline-flex"
                  >
                    <LogOut size={16} />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth')}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hidden sm:inline-flex"
                >
                  <User size={16} className="mr-2" />
                  Войти
                </Button>
              )}
              
              <MobileMenu 
                user={user}
                userRole={userRole}
                showAdminAccess={showAdminAccess}
                onSignOut={handleSignOut}
                onNavigateToAuth={() => navigate('/auth')}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 safe-left safe-right">
        {/* Trinity Introduction */}
        <TrinityAvatar compact={false} />
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-gradient bg-gradient-to-r from-primary via-secondary-foreground to-accent-foreground bg-clip-text text-transparent">
            Саркастичные обзоры мира ИИ
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Потому что кто-то должен говорить правду о всех этих "революционных" breakthrough'ах
          </p>
          <div className="mt-6 flex justify-center">
            <div className="animate-pulse">
              <Sparkles className="text-primary" size={32} />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Mobile Search */}
        <div className="mb-8 md:hidden">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 text-center text-gray-400">
            Найдено {filteredArticles.length} результатов для "{searchQuery}"
            {filteredArticles.length === 0 && (
              <p className="mt-2">Попробуйте изменить поисковый запрос</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Загрузка новостей...</p>
              </div>
            ) : displayedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  {searchQuery ? 'Ничего не найдено' : 'Нет новостей в выбранной категории'}
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setSelectedCategory("Все")}
                    variant="outline"
                    className="border-purple-500/50 text-purple-300"
                  >
                    Показать все новости
                  </Button>
                )}
              </div>
            ) : (
              displayedArticles.map((article) => (
                <Card key={article.id} className="bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 hover-lift glass-effect mobile-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {article.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{new Date(article.published_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                    <CardTitle className="text-foreground hover:text-primary transition-colors mobile-text">
                      <Link to={`/news/${article.id}`} className="hover-lift">
                        {article.title}
                      </Link>
                    </CardTitle>
                    {article.summary && (
                      <p className="text-muted-foreground text-sm leading-relaxed mobile-text">
                        {article.summary}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>3 мин</span>
                        </div>
                        <span>• {article.author || 'Автор неизвестен'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ShareButton 
                          title={article.title}
                          text={article.summary || article.title}
                        />
                        <div className="h-4 w-px bg-gray-600" />
                        <ReactionButton articleId={article.id} type="smart" user={user} />
                        <ReactionButton articleId={article.id} type="funny" user={user} />
                        <ReactionButton articleId={article.id} type="trash" user={user} />
                      </div>
                    </div>
                    
                    {article.audio_url && (
                      <div className="mt-4">
                        <AudioPlayer audioUrl={article.audio_url} title={article.title} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div data-component="ai-recommendations">
              <AIRecommendations user={user} articles={articles} />
            </div>
            
            {/* Smart Feed */}
            <div data-component="smart-feed">
              <SmartFeed 
                totalArticles={articles.length}
                userReadCount={user ? Math.floor(Math.random() * 15) : 0}
                lastReadTime={user ? new Date().toISOString() : undefined}
              />
            </div>

            {/* Leaderboard */}
            <Leaderboard user={user} />

            {/* NewsAPI Settings */}
            {user && <NewsAPISettings user={user} />}

            {/* Stats Widget */}
            <StatsWidget />

            {/* Latest Podcasts */}
            <Card className="bg-card/60 border-border/50 glass-effect hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Headphones className="mr-2 text-primary" size={20} />
                  Последние подкасты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPodcasts.map((podcast) => (
                    <div key={podcast.id} className="p-4 rounded-xl bg-accent/50 hover:bg-accent/70 transition-all duration-300 cursor-pointer hover-lift border border-border/50">
                      <h4 className="text-foreground font-medium text-sm mb-2">
                        {podcast.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {podcast.duration}
                        </span>
                        <span className="flex items-center">
                          <Headphones size={12} className="mr-1" />
                          {podcast.plays}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/podcasts">
                  <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80 hover:bg-primary/10">
                    Все подкасты
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trending Categories */}
            <div data-component="trending">
              <Card className="bg-card/60 border-border/50 glass-effect hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <TrendingUp className="mr-2 text-primary" size={20} />
                  Трендовые категории
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Corporate Drama', 'Hype', 'Reality Check', 'Breakthrough'].map((category) => (
                    <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                      <span className="text-foreground text-sm font-medium">{category}</span>
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        {Math.floor(Math.random() * 50) + 10}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          onAIRecommendations={() => {
            document.querySelector('[data-component="ai-recommendations"]')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          onSmartFeed={() => {
            document.querySelector('[data-component="smart-feed"]')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          onTrending={() => {
            document.querySelector('[data-component="trending"]')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
        />
        </div>
      </div>
    </PullToRefresh>
  </TelegramApp>
  );
};

export default Index;
