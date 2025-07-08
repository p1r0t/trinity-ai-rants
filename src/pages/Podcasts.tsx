
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Download, Calendar, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from '@/components/ThemeToggle';
import TrinityAvatar from '@/components/TrinityAvatar';
import { supabase } from "@/integrations/supabase/client";

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  category: string | null;
  published_at: string;
  play_count: number;
  audio_url: string | null;
}

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setPodcasts(data || []);
    } catch (error) {
      console.error('Error loading podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (podcastId: string) => {
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
        {/* Trinity Introduction */}
        <TrinityAvatar compact={false} />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Подкасты Trinity AI
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Еженедельные обзоры мира ИИ с изрядной долей сарказма
            </p>
            {!loading && (
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <TrendingUp size={16} className="mr-2" />
                  {podcasts.length} эпизодов
                </div>
                <div className="flex items-center">
                  <Play size={16} className="mr-2" />
                  {podcasts.reduce((acc, p) => acc + p.play_count, 0).toLocaleString()} прослушиваний
                </div>
              </div>
            )}
          </div>

          {/* Podcasts List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Загрузка подкастов...</p>
              </div>
            ) : podcasts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Подкасты скоро появятся!</p>
                <p className="text-sm text-gray-500">Trinity готовит аудио-контент для вас</p>
              </div>
            ) : (
              podcasts.map((podcast) => (
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
                            {podcast.category && (
                              <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                                {podcast.category}
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-300">
                            <Download size={16} />
                          </Button>
                        </div>
                        
                        {podcast.description && (
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {podcast.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {formatDate(podcast.published_at)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2" />
                            {formatDuration(podcast.duration)}
                          </div>
                          <div className="flex items-center">
                            <Play size={14} className="mr-2" />
                            {podcast.play_count} прослушиваний
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
                          <span className="text-xs text-gray-400">{formatDuration(podcast.duration)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          Аудио будет доступно после интеграции с сервисом генерации
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {!loading && podcasts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                Загрузить еще подкасты
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
