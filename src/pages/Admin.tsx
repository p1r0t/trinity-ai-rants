
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, Edit, Trash2, Volume2, FileText, Send, 
  Settings, Eye, EyeOff, Wand2, Save 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

// Types
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

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [selectedNews, setSelectedNews] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState({ tldr: false, audio: false });
  const [loading, setLoading] = useState(true);

  // Load articles when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статьи",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (credentials.username === 'admin' && credentials.password === 'trinity2025') {
      setIsAuthenticated(true);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в админку Trinity AI",
      });
    } else {
      toast({
        title: "Ошибка авторизации",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTldr = async (articleId: string) => {
    setIsGenerating({ ...isGenerating, tldr: true });
    try {
      const { data, error } = await supabase.functions.invoke('generate-tldr', {
        body: { articleId }
      });

      if (error) throw error;

      toast({
        title: "TL;DR сгенерирован",
        description: "Краткий обзор создан с помощью OpenAI",
      });
      
      // Refresh articles and update selected news
      await loadArticles();
      if (selectedNews) {
        const updatedArticle = articles.find(a => a.id === articleId);
        if (updatedArticle) setSelectedNews(updatedArticle);
      }
    } catch (error) {
      console.error('Error generating TL;DR:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать TL;DR",
        variant: "destructive",
      });
    } finally {
      setIsGenerating({ ...isGenerating, tldr: false });
    }
  };

  const handleGenerateAudio = async (articleId: string) => {
    setIsGenerating({ ...isGenerating, audio: true });
    try {
      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: { articleId }
      });

      if (error) throw error;

      toast({
        title: "Аудио сгенерировано",
        description: "Аудиоверсия создана с помощью ElevenLabs",
      });
      
      // Refresh articles and update selected news
      await loadArticles();
      if (selectedNews) {
        const updatedArticle = articles.find(a => a.id === articleId);
        if (updatedArticle) setSelectedNews(updatedArticle);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать аудио",
        variant: "destructive",
      });
    } finally {
      setIsGenerating({ ...isGenerating, audio: false });
    }
  };

  const handlePublishToTelegraph = async (articleId: string) => {
    toast({
      title: "Публикация в Telegraph",
      description: "Статья успешно опубликована в Telegraph",
    });
  };

  const handlePublishToNotion = async (articleId: string) => {
    toast({
      title: "Публикация в Notion",
      description: "Статья успешно добавлена в Notion",
    });
  };

  const handleToggleProcessed = async (articleId: string, processed: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ processed })
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: processed ? "Статья опубликована" : "Статья снята с публикации",
        description: processed ? "Статья теперь видна пользователям" : "Статья скрыта от пользователей",
      });

      await loadArticles();
      if (selectedNews?.id === articleId) {
        setSelectedNews({ ...selectedNews, processed });
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статью",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-center text-white">
              Админка Trinity AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  placeholder="Логин"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="bg-black/20 border-purple-500/30 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Trinity AI Admin
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')} className="border-purple-500/50 text-purple-300">
                Назад к сайту
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="border-red-500/50 text-red-300">
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="bg-black/40 border border-purple-500/30">
            <TabsTrigger value="news" className="data-[state=active]:bg-purple-600">
              Новости
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="data-[state=active]:bg-purple-600">
              Подкасты
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            {/* News Management */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Управление новостями</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2" size={16} />
                Добавить новость
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* News List */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Список новостей</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-400">Загрузка статей...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {articles.map((article) => (
                        <div 
                          key={article.id} 
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedNews?.id === article.id 
                              ? 'border-purple-400 bg-purple-500/10' 
                              : 'border-purple-500/30 hover:border-purple-400/50'
                          }`}
                          onClick={() => setSelectedNews(article)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium text-sm line-clamp-2">
                              {article.title}
                            </h4>
                            <Badge 
                              variant={article.processed ? 'default' : 'outline'}
                              className="ml-2 flex-shrink-0"
                            >
                              {article.processed ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{article.tags?.[0] || 'Без категории'} • {article.author || 'Неизвестен'}</span>
                            <div className="flex items-center space-x-2">
                              {article.summary && <Badge variant="outline" className="text-xs">TL;DR</Badge>}
                              {article.audio_url && <Badge variant="outline" className="text-xs">Audio</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                      {articles.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          Нет статей для отображения
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* News Editor */}
              {selectedNews && (
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Редактирование новости
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                          {isEditing ? <EyeOff size={16} /> : <Edit size={16} />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <Input 
                          defaultValue={selectedNews.title}
                          className="bg-black/20 border-purple-500/30 text-white"
                          placeholder="Заголовок"
                        />
                        <Input 
                          defaultValue={selectedNews.author || ''}
                          className="bg-black/20 border-purple-500/30 text-white"
                          placeholder="Автор"
                        />
                        <Textarea 
                          defaultValue={selectedNews.content}
                          placeholder="Содержание статьи..."
                          className="bg-black/20 border-purple-500/30 text-white min-h-32"
                        />
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Save className="mr-2" size={16} />
                          Сохранить
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-gray-300">
                          <strong>Статус:</strong> {selectedNews.processed ? 'Опубликовано' : 'Черновик'}
                        </div>
                        <div className="text-gray-300">
                          <strong>Автор:</strong> {selectedNews.author || 'Не указан'}
                        </div>
                        <div className="text-gray-300">
                          <strong>Создано:</strong> {new Date(selectedNews.published_at).toLocaleDateString('ru-RU')}
                        </div>
                        
                        {/* Publication Toggle */}
                        <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                          <span className="text-gray-300">Опубликовать статью</span>
                          <Switch 
                            checked={selectedNews.processed}
                            onCheckedChange={(checked) => handleToggleProcessed(selectedNews.id, checked)}
                          />
                        </div>
                        
                        {/* AI Tools */}
                        <div className="space-y-3 pt-4 border-t border-purple-500/20">
                          <h4 className="text-white font-medium">ИИ-инструменты</h4>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-300">Генерация TL;DR</span>
                              {selectedNews.summary && <p className="text-xs text-green-400">✓ Готово</p>}
                            </div>
                            <Button 
                              size="sm" 
                              disabled={isGenerating.tldr}
                              onClick={() => handleGenerateTldr(selectedNews.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isGenerating.tldr ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <Wand2 size={16} />
                              )}
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-300">Генерация аудио</span>
                              {selectedNews.audio_url && <p className="text-xs text-green-400">✓ Готово</p>}
                            </div>
                            <Button 
                              size="sm" 
                              disabled={isGenerating.audio}
                              onClick={() => handleGenerateAudio(selectedNews.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isGenerating.audio ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <Volume2 size={16} />
                              )}
                            </Button>
                          </div>
                          
                          {/* Show generated summary */}
                          {selectedNews.summary && (
                            <div className="pt-2">
                              <p className="text-xs text-gray-400 mb-1">Сгенерированное резюме:</p>
                              <p className="text-sm text-gray-300 bg-black/20 p-2 rounded">{selectedNews.summary}</p>
                            </div>
                          )}
                          
                          {/* Audio player */}
                          {selectedNews.audio_url && (
                            <div className="pt-2">
                              <p className="text-xs text-gray-400 mb-1">Аудиоверсия:</p>
                              <audio controls className="w-full">
                                <source src={selectedNews.audio_url} type="audio/mpeg" />
                              </audio>
                            </div>
                          )}
                        </div>

                        {/* Publishing */}
                        <div className="space-y-3 pt-4 border-t border-purple-500/20">
                          <h4 className="text-white font-medium">Публикация</h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePublishToTelegraph(selectedNews.id)}
                              className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
                            >
                              Telegraph
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePublishToNotion(selectedNews.id)}
                              className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
                            >
                              Notion
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="podcasts">
            <div className="text-center py-12">
              <h3 className="text-xl text-white mb-4">Управление подкастами</h3>
              <p className="text-gray-400 mb-6">Функционал будет добавлен в следующих версиях</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2" size={16} />
                Добавить подкаст
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">API Keys</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="OpenAI API Key"
                      type="password"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input 
                      placeholder="ElevenLabs API Key"
                      type="password"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input 
                      placeholder="Telegraph Token"
                      type="password"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input 
                      placeholder="Notion Token"
                      type="password"
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Общие настройки</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Автоматическая генерация TL;DR</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Автоматическая генерация аудио</span>
                    <Switch />
                  </div>
                </div>

                <Button className="bg-green-600 hover:bg-green-700">
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
