
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Download, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockPodcasts = [
  {
    id: 1,
    title: "Подкаст #15: Когда ИИ заменит подкастеров?",
    description: "Обсуждаем парадокс: можем ли мы критиковать ИИ, если сами используем его для создания контента? Ироничный взгляд на будущее медиа.",
    duration: "28:42",
    date: "2025-01-07",
    plays: 445,
    audioUrl: "/podcast-15.mp3",
    category: "Meta"
  },
  {
    id: 2,
    title: "Подкаст #14: Anthropic vs OpenAI - битва за этичность",
    description: "Кто более этичен: компания, которая говорит о безопасности, или та, которая просто делает продукт? Анализируем маркетинговые стратегии.",
    duration: "32:15",
    date: "2025-01-03",
    plays: 623,
    audioUrl: "/podcast-14.mp3",
    category: "Corporate Drama"
  },
  {
    id: 3,
    title: "Подкаст #13: Google снова 'убивает' свой продукт",
    description: "История о том, как Google Bard стал Gemini, а потом... мы уже сбились со счета. Классическое Google-кладбище пополняется.",
    duration: "24:18",
    date: "2024-12-28",
    plays: 892,
    audioUrl: "/podcast-13.mp3",
    category: "Corporate Drama"
  },
  {
    id: 4,
    title: "Подкаст #12: 2024 год в ИИ - итоги хайпа",
    description: "Подводим итоги года в мире искусственного интеллекта. Сколько раз нам обещали AGI и почему мы до сих пор ждем?",
    duration: "45:30",
    date: "2024-12-25",
    plays: 1234,
    audioUrl: "/podcast-12.mp3",
    category: "Year Review"
  }
];

const Podcasts = () => {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);

  const handlePlayPause = (podcastId: number) => {
    if (currentPlaying === podcastId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(podcastId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Trinity AI
                </h1>
              </Link>
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                Подкасты
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                Новости
              </Link>
              <Link to="/podcasts" className="text-purple-400">
                Подкасты
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">
                Категории
              </Link>
              <Link to="/stats" className="text-gray-300 hover:text-purple-400 transition-colors">
                Статистика
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Подкасты Trinity AI
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Еженедельные обзоры мира ИИ с изрядной долей сарказма
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <TrendingUp size={16} className="mr-2" />
                {mockPodcasts.length} эпизодов
              </div>
              <div className="flex items-center">
                <Play size={16} className="mr-2" />
                {mockPodcasts.reduce((acc, p) => acc + p.plays, 0).toLocaleString()} прослушиваний
              </div>
            </div>
          </div>

          {/* Podcasts List */}
          <div className="space-y-6">
            {mockPodcasts.map((podcast) => (
              <Card key={podcast.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    {/* Play Button */}
                    <Button
                      onClick={() => handlePlayPause(podcast.id)}
                      size="lg"
                      className={`flex-shrink-0 w-16 h-16 rounded-full ${
                        currentPlaying === podcast.id 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {currentPlaying === podcast.id ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} className="ml-1" />
                      )}
                    </Button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {podcast.title}
                          </h3>
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                            {podcast.category}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-300">
                          <Download size={16} />
                        </Button>
                      </div>
                      
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {podcast.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(podcast.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-2" />
                          {podcast.duration}
                        </div>
                        <div className="flex items-center">
                          <Play size={14} className="mr-2" />
                          {podcast.plays} прослушиваний
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (показывается только для воспроизводящегося подкаста) */}
                  {currentPlaying === podcast.id && (
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-400">02:15</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-xs text-gray-400">{podcast.duration}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
              Загрузить еще подкасты
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
