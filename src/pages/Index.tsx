import { useState, useEffect } from 'react';
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
import { Calendar, TrendingUp, Clock, User, LogOut, Settings, Headphones } from 'lucide-react';
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

  const categories = ["Все", "Breakthrough", "Corporate Drama", "Hype", "Reality Check"];
  const displayedArticles = selectedCategory === "Все" 
    ? filteredArticles 
    : filteredArticles.filter(article => article.tags?.includes(selectedCategory));

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-top safe-bottom">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50 safe-left safe-right">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
                onClick={handleLogoClick}
              >
                Trinity AI News
              </h1>
              <div className="hidden md:flex space-x-6 overflow-x-auto">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Главная
                </Link>
                <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Категории
                </Link>
                <Link to="/podcasts" className="text-gray-300 hover:text-white transition-colors">
                  Подкасты
                </Link>
                <Link to="/stats" className="text-gray-300 hover:text-white transition-colors">
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
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Саркастичные обзоры мира ИИ
          </h2>
          <p className="text-gray-400 text-lg">
            Потому что кто-то должен говорить правду о всех этих "революционных" breakthrough'ах
          </p>
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
                <Card key={article.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-colors">
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
                    <CardTitle className="text-white hover:text-purple-300 transition-colors">
                      <Link to={`/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                    {article.summary && (
                      <p className="text-gray-300 text-sm leading-relaxed">
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
            {/* Stats Widget */}
            <StatsWidget />

            {/* Latest Podcasts */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Headphones className="mr-2" size={20} />
                  Последние подкасты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPodcasts.map((podcast) => (
                    <div key={podcast.id} className="p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors cursor-pointer">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {podcast.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{podcast.duration}</span>
                        <span>{podcast.plays} прослушиваний</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/podcasts">
                  <Button variant="ghost" className="w-full mt-4 text-purple-400 hover:text-purple-300">
                    Все подкасты
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trending Categories */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="mr-2" size={20} />
                  Трендовые категории
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Corporate Drama', 'Hype', 'Reality Check', 'Breakthrough'].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{category}</span>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
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
    </div>
    </PullToRefresh>
  );
};

export default Index;
