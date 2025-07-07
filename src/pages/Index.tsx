
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, TrendingUp, Headphones, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NewsCard from '@/components/NewsCard';
import FilterBar from '@/components/FilterBar';
import StatsWidget from '@/components/StatsWidget';

// Mock data - в реальном проекте будет API
const mockNews = [
  {
    id: 1,
    title: "OpenAI снова 'революционизирует' мир: GPT-5 теперь умеет делать кофе",
    summary: "Очередной breakthrough от создателей ChatGPT. Теперь ИИ не только пишет код, но и якобы варит идеальный эспрессо. Правда, пока только в симуляции.",
    content: "Компания OpenAI представила новую версию своей языковой модели GPT-5, которая теперь может не только генерировать текст, но и управлять кофемашинами. По словам представителей компании, это 'новый этап развития мультимодального ИИ'...",
    category: "Breakthrough",
    author: "AI Skeptic",
    date: "2025-01-07",
    views: 1337,
    reactions: { smart: 42, funny: 156, trash: 23 },
    hasAudio: true,
    tldr: "OpenAI научила GPT-5 варить кофе. Инвесторы в экстазе, кофемашины в панике.",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Google Bard переименован в Gemini (опять): теперь это 'настоящий' конкурент ChatGPT",
    summary: "Google в очередной раз меняет название своего чат-бота и обещает, что на этот раз точно все будет по-другому. Где-то мы это уже слышали...",
    content: "Корпорация Google объявила о кардинальном обновлении своего ИИ-ассистента, который теперь называется Gemini Ultra Pro Max (шутка, просто Gemini). Компания утверждает, что новая модель превосходит GPT-4 по всем параметрам...",
    category: "Corporate Drama",
    author: "Tech Cynic",
    date: "2025-01-06",
    views: 892,
    reactions: { smart: 28, funny: 203, trash: 45 },
    hasAudio: false,
    tldr: "Google снова переименовал свой ИИ и снова обещает победить OpenAI. Спойлер: не победит.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Meta выпустила LLaMA 3: 'Открытый' ИИ с закрытыми исходниками",
    summary: "Цукерберг представил новую модель, которая якобы 'открытая', но исходники по-прежнему недоступны. Маркетинговый отдел Meta снова в ударе.",
    content: "Компания Meta (бывший Facebook) анонсировала релиз LLaMA 3, позиционируя его как 'наиболее открытую' языковую модель на рынке. Однако полные исходные коды модели остаются недоступными для широкой публики...",
    category: "Open Source Drama",
    author: "Code Warrior",
    date: "2025-01-05",
    views: 2156,
    reactions: { smart: 89, funny: 67, trash: 134 },
    hasAudio: true,
    tldr: "Meta называет свой ИИ 'открытым', но код все еще спрятан. Классический Цукерберг.",
    image: "/placeholder.svg"
  }
];

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

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNews, setFilteredNews] = useState(mockNews);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredNews(mockNews);
    } else {
      setFiltereredNews(mockNews.filter(news => news.category === selectedCategory));
    }
  }, [selectedCategory]);

  const categories = ['all', 'Breakthrough', 'Corporate Drama', 'Open Source Drama', 'Hype', 'Reality Check'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trinity AI
              </h1>
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                Нейро-дайджест
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                Новости
              </Link>
              <Link to="/podcasts" className="text-gray-300 hover:text-purple-400 transition-colors">
                Подкасты
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">
                Категории
              </Link>
              <Link to="/stats" className="text-gray-300 hover:text-purple-400 transition-colors">
                Статистика
              </Link>
              <Link to="/admin" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Settings size={20} />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Саркастичные обзоры мира ИИ
              </h2>
              <p className="text-gray-400 text-lg">
                Потому что кто-то должен говорить правду о всех этих "революционных" breakthrough'ах
              </p>
            </div>

            {/* Filter Bar */}
            <FilterBar 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* News Feed */}
            <div className="space-y-6">
              {filteredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                Загрузить еще сарказма
              </Button>
            </div>
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
  );
};

export default Index;
