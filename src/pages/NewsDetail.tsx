
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, Volume2, ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AudioPlayer from '@/components/AudioPlayer';
import ReactionButton from '@/components/ReactionButton';
import TrinityAvatar from '@/components/TrinityAvatar';
import ClickbaitButton from '@/components/ClickbaitButton';
import VoiceSelector from '@/components/VoiceSelector';
import { Separator } from "@/components/ui/separator";

// Mock data - в реальном проекте будет API
const mockNewsDetail = {
  id: 1,
  title: "OpenAI снова 'революционизирует' мир: GPT-5 теперь умеет делать кофе",
  summary: "Очередной breakthrough от создателей ChatGPT. Теперь ИИ не только пишет код, но и якобы варит идеальный эспрессо. Правда, пока только в симуляции.",
  content: `
<p>Компания OpenAI представила новую версию своей языковой модели GPT-5, которая теперь может не только генерировать текст, но и управлять кофемашинами. По словам представителей компании, это "новый этап развития мультимодального ИИ".</p>

<h3>Что умеет GPT-5</h3>
<p>Согласно официальному релизу, новая модель способна:</p>
<ul>
<li>Анализировать предпочтения пользователя в кофе на основе истории переписки</li>
<li>Оптимизировать температуру и крепость напитка в зависимости от времени суток</li>
<li>Генерировать рецепты кофейных напитков на основе доступных ингредиентов</li>
<li>Предсказывать настроение пользователя по голосовым командам и подбирать соответствующий вид кофе</li>
</ul>

<h3>Реальность vs. Маркетинг</h3>
<p>Однако при ближайшем рассмотрении выяснилось, что "революционная" функция работает только в симуляции. Реальных кофемашин, интегрированных с GPT-5, пока не существует. OpenAI лишь продемонстрировала возможности модели на виртуальной кофемашине.</p>

<p>Тем не менее, инвесторы уже начали скупать акции компаний-производителей кофемашин, ожидая интеграции с ИИ. Акции Nespresso выросли на 12% за день после анонса.</p>

<h3>Мнение экспертов</h3>
<p>"Это очередной пример того, как технологические компании превращают обычные функции в 'революционные прорывы'", - комментирует ведущий аналитик Tech Reality Check Джон Скептик. "Через месяц мы увидим, как каждый производитель бытовой техники будет кричать об интеграции с ИИ".</p>

<p>Представители OpenAI обещают, что реальная интеграция с кофемашинами появится "в ближайшие кварталы". До тех пор нам остается довольствоваться старым добрым способом приготовления кофе - руками.</p>
  `,
  category: "Breakthrough",
  author: "AI Skeptic",
  date: "2025-01-07",
  views: 1337,
  reactions: { smart: 42, funny: 156, trash: 23 },
  hasAudio: true,
  tldr: "OpenAI научила GPT-5 варить кофе. Инвесторы в экстазе, кофемашины в панике.",
  audioUrl: "/mock-audio.mp3"
};

const NewsDetail = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [news] = useState(mockNewsDetail); // В реальном проекте будет загрузка из API

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
    // Здесь будет логика воспроизведения аудио
  };

  const handleReaction = (type: 'smart' | 'funny' | 'trash') => {
    // Здесь будет логика отправки реакции на сервер
    console.log(`Reaction: ${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                <ArrowLeft className="mr-2" size={16} />
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trinity AI
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Trinity Avatar */}
          <TrinityAvatar articleId={id} />
          
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                {news.category}
              </Badge>
              {news.hasAudio && (
                <Badge variant="outline" className="border-green-500/50 text-green-300 flex items-center gap-1">
                  <Volume2 size={12} />
                  Аудио доступно
                </Badge>
              )}
            </div>
            
            <ClickbaitButton 
              originalTitle={news.title} 
              articleId={id || '1'} 
            />
            
            <div className="flex items-center space-x-6 text-gray-400 mb-6">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {news.author}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {formatDate(news.date)}
              </div>
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                {news.views} просмотров
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* TL;DR */}
              <Card className="bg-black/40 border-purple-500/30 mb-8">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-lg">TL;DR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{news.tldr}</p>
                </CardContent>
              </Card>

              {/* Audio Player */}
              <div className="mb-8">
                <AudioPlayer 
                  title={`Аудиоверсия: ${news.title}`}
                  audioUrl={news.hasAudio ? news.audioUrl : ''}
                />
              </div>

              {/* Article Content */}
              <Card className="bg-black/40 border-purple-500/30 mb-8">
                <CardContent className="pt-6">
                  <div 
                    className="prose prose-invert prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />
                </CardContent>
              </Card>

              {/* Reactions */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Ваша реакция?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleReaction('smart')}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                    >
                      <span className="text-3xl">🤓</span>
                      <span className="text-blue-400 font-medium">{news.reactions.smart}</span>
                      <span className="text-gray-400 text-sm">Умно</span>
                    </button>
                    
                    <button 
                      onClick={() => handleReaction('funny')}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                    >
                      <span className="text-3xl">😂</span>
                      <span className="text-yellow-400 font-medium">{news.reactions.funny}</span>
                      <span className="text-gray-400 text-sm">Смешно</span>
                    </button>
                    
                    <button 
                      onClick={() => handleReaction('trash')}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="text-3xl">💩</span>
                      <span className="text-red-400 font-medium">{news.reactions.trash}</span>
                      <span className="text-gray-400 text-sm">Фигня</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voice Selector */}
              <VoiceSelector 
                articleTitle={news.title}
                articleContent={news.content}
              />
              
              {/* Related Articles */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Похожие статьи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors cursor-pointer">
                        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
                          Еще одна "революционная" новость про ИИ #{i}
                        </h4>
                        <div className="text-xs text-gray-400">
                          2 дня назад • AI Skeptic
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Поделиться</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300">
                      Telegram
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300">
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
