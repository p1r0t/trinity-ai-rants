
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  Settings, 
  FileText, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  ArrowLeft,
  Globe,
  Mic,
  MessageSquare,
  Eye,
  EyeOff,
  Wand2,
  Volume2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string | null;
  published_at: string;
  summary: string | null;
  processed: boolean;
  tags: string[] | null;
  audio_url: string | null;
}

interface NewsSource {
  id: string;
  name: string;
  url: string;
  source_type: string;
  is_active: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');
  
  // Articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isGenerating, setIsGenerating] = useState({ tldr: false, audio: false });
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    author: '',
    summary: '',
    original_url: '',
    published_at: new Date().toISOString().slice(0, 16)
  });
  
  // News Sources
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [newSource, setNewSource] = useState({ name: '', url: '', source_type: 'rss' });

  // Users
  const [users, setUsers] = useState<any[]>([]);
  
  // Settings
  const [settings, setSettings] = useState<any[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', description: '' });
  
  // Stats
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalUsers: 0,
    totalReactions: 0,
    activeSources: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [userRole, activeTab]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setUserRole(data?.role || null);
        
        if (data?.role !== 'admin') {
          toast({
            title: "Доступ запрещен",
            description: "У вас нет прав администратора",
            variant: "destructive",
          });
          navigate('/');
        }
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (activeTab === 'articles') {
      await loadArticles();
    } else if (activeTab === 'sources') {
      await loadSources();
    } else if (activeTab === 'users') {
      await loadUsers();
    } else if (activeTab === 'settings') {
      await loadSettings();
    } else if (activeTab === 'stats') {
      await loadStats();
    }
  };

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const loadSources = async () => {
    try {
      const { data, error } = await supabase
        .from('news_sources')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error loading sources:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [articlesRes, usersRes, reactionsRes, sourcesRes] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('reactions').select('*', { count: 'exact' }),
        supabase.from('news_sources').select('*', { count: 'exact' })
      ]);

      const publishedArticles = await supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('processed', true);

      const activeSources = await supabase
        .from('news_sources')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      setStats({
        totalArticles: articlesRes.count || 0,
        publishedArticles: publishedArticles.count || 0,
        totalUsers: usersRes.count || 0,
        totalReactions: reactionsRes.count || 0,
        activeSources: activeSources.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const updateArticle = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title: article.title,
          content: article.content,
          summary: article.summary,
          processed: article.processed,
          tags: article.tags,
          author: article.author
        })
        .eq('id', article.id);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Статья обновлена",
      });
      
      setEditingArticle(null);
      loadArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статью",
        variant: "destructive",
      });
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Статья удалена",
      });
      
      loadArticles();
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью",
        variant: "destructive",
      });
    }
  };

  const generateTldr = async (articleId: string) => {
    setIsGenerating({ ...isGenerating, tldr: true });
    try {
      const { data, error } = await supabase.functions.invoke('generate-tldr', {
        body: { articleId }
      });

      if (error) throw error;

      toast({
        title: "TL;DR сгенерирован",
        description: "Краткий обзор создан",
      });
      
      loadArticles();
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

  const generateAudio = async (articleId: string) => {
    setIsGenerating({ ...isGenerating, audio: true });
    try {
      const { data, error } = await supabase.functions.invoke('generate-audio', {
        body: { articleId }
      });

      if (error) throw error;

      toast({
        title: "Аудио сгенерировано",
        description: "Аудиоверсия создана",
      });
      
      loadArticles();
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

  const addSource = async () => {
    if (!newSource.name || !newSource.url) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('news_sources')
        .insert([newSource]);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Источник добавлен",
      });
      
      setNewSource({ name: '', url: '', source_type: 'rss' });
      loadSources();
    } catch (error) {
      console.error('Error adding source:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить источник",
        variant: "destructive",
      });
    }
  };

  const toggleSource = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('news_sources')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
      loadSources();
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const createArticle = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.original_url) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('articles')
        .insert([{
          ...newArticle,
          published_at: new Date(newArticle.published_at).toISOString()
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Статья создана",
      });
      
      setNewArticle({
        title: '',
        content: '',
        author: '',
        summary: '',
        original_url: '',
        published_at: new Date().toISOString().slice(0, 16)
      });
      setIsCreatingArticle(false);
      loadArticles();
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать статью",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Роль пользователя обновлена",
      });
      
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить роль",
        variant: "destructive",
      });
    }
  };

  const addSetting = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast({
        title: "Ошибка",
        description: "Заполните ключ и значение",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .insert([{
          key: newSetting.key,
          value: JSON.parse(newSetting.value),
          description: newSetting.description
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Настройка добавлена",
      });
      
      setNewSetting({ key: '', value: '', description: '' });
      loadSettings();
    } catch (error) {
      console.error('Error adding setting:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить настройку",
        variant: "destructive",
      });
    }
  };

  const deleteSetting = async (id: string) => {
    if (!confirm('Удалить настройку?')) return;
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: "Настройка удалена",
      });
      
      loadSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить настройку",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <ArrowLeft size={16} className="mr-2" />
                  На главную
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Trinity AI Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                {user?.email}
              </span>
              <Badge variant="outline" className="border-orange-500/50 text-orange-300">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'articles', label: 'Статьи', icon: FileText },
                { id: 'sources', label: 'Источники', icon: Globe },
                { id: 'users', label: 'Пользователи', icon: Users },
                { id: 'stats', label: 'Статистика', icon: BarChart3 },
                { id: 'settings', label: 'Настройки', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      activeTab === tab.id
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    }
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Articles List */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Статьи ({articles.length})
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setIsCreatingArticle(true)}
                      >
                        <Plus size={14} />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {articles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => setSelectedArticle(article)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedArticle?.id === article.id
                              ? 'border-orange-400 bg-orange-500/10'
                              : 'border-purple-500/30 hover:border-purple-400/50'
                          }`}
                        >
                          <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant={article.processed ? "default" : "outline"} className="text-xs">
                              {article.processed ? 'Опубликована' : 'Черновик'}
                            </Badge>
                            <div className="flex gap-1">
                              {article.summary && <Badge variant="outline" className="text-xs">TL;DR</Badge>}
                              {article.audio_url && <Badge variant="outline" className="text-xs">Audio</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Article Editor */}
              <div className="lg:col-span-2">
                {selectedArticle ? (
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Редактор статьи</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingArticle(editingArticle?.id === selectedArticle.id ? null : selectedArticle)}
                            className="border-purple-500/50 text-purple-300"
                          >
                            {editingArticle?.id === selectedArticle.id ? <EyeOff size={14} /> : <Edit size={14} />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteArticle(selectedArticle.id)}
                            className="border-red-500/50 text-red-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {editingArticle?.id === selectedArticle.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingArticle.title}
                            onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                            className="bg-black/20 border-purple-500/30 text-white"
                            placeholder="Заголовок"
                          />
                          <Input
                            value={editingArticle.author || ''}
                            onChange={(e) => setEditingArticle({...editingArticle, author: e.target.value})}
                            className="bg-black/20 border-purple-500/30 text-white"
                            placeholder="Автор"
                          />
                          <Textarea
                            value={editingArticle.summary || ''}
                            onChange={(e) => setEditingArticle({...editingArticle, summary: e.target.value})}
                            className="bg-black/20 border-purple-500/30 text-white"
                            placeholder="Краткое описание"
                            rows={3}
                          />
                          <Textarea
                            value={editingArticle.content}
                            onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                            className="bg-black/20 border-purple-500/30 text-white"
                            placeholder="Содержание"
                            rows={10}
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editingArticle.processed}
                                onCheckedChange={(checked) => setEditingArticle({...editingArticle, processed: checked})}
                              />
                              <span className="text-gray-300">Опубликовать</span>
                            </div>
                            <Button onClick={() => updateArticle(editingArticle)} className="bg-green-600 hover:bg-green-700">
                              <Save size={14} className="mr-2" />
                              Сохранить
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-gray-300">
                            <h3 className="text-white font-medium mb-2">{selectedArticle.title}</h3>
                            <p><strong>Автор:</strong> {selectedArticle.author || 'Не указан'}</p>
                            <p><strong>Дата:</strong> {new Date(selectedArticle.published_at).toLocaleDateString('ru-RU')}</p>
                            <p><strong>Статус:</strong> {selectedArticle.processed ? 'Опубликована' : 'Черновик'}</p>
                          </div>
                          
                          {selectedArticle.summary && (
                            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                              <h4 className="text-blue-300 font-medium mb-2">TL;DR:</h4>
                              <p className="text-gray-300 text-sm">{selectedArticle.summary}</p>
                            </div>
                          )}

                          <div className="space-y-3 pt-4 border-t border-purple-500/20">
                            <h4 className="text-white font-medium">ИИ-инструменты</h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                size="sm"
                                disabled={isGenerating.tldr}
                                onClick={() => generateTldr(selectedArticle.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {isGenerating.tldr ? (
                                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                ) : (
                                  <Wand2 size={14} className="mr-2" />
                                )}
                                TL;DR
                              </Button>
                              
                              <Button
                                size="sm"
                                disabled={isGenerating.audio}
                                onClick={() => generateAudio(selectedArticle.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isGenerating.audio ? (
                                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                ) : (
                                  <Volume2 size={14} className="mr-2" />
                                )}
                                Аудио
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-black/40 border-purple-500/30">
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-gray-400">Выберите статью для редактирования</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Sources Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Источники новостей</h2>
                <Badge className="bg-green-500/20 border-green-500/50 text-green-300">
                  {sources.filter(s => s.is_active).length} активных
                </Badge>
              </div>
              
              {/* Add New Source */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus size={20} className="mr-2" />
                    Добавить источник
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Название"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input
                      placeholder="URL"
                      value={newSource.url}
                      onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <select
                      value={newSource.source_type}
                      onChange={(e) => setNewSource({ ...newSource, source_type: e.target.value })}
                      className="bg-black/20 border border-purple-500/30 text-white rounded-md px-3 py-2"
                    >
                      <option value="rss">RSS</option>
                      <option value="tech">Технологии</option>
                      <option value="world">Мировые</option>
                      <option value="business">Бизнес</option>
                      <option value="science">Наука</option>
                      <option value="russia">Россия</option>
                      <option value="europe">Европа</option>
                      <option value="asia">Азия</option>
                    </select>
                    <Button onClick={addSource} className="bg-green-600 hover:bg-green-700">
                      Добавить
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sources List */}
              <div className="grid gap-4">
                {sources.map((source) => (
                  <Card key={source.id} className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{source.name}</h3>
                          <p className="text-gray-400 text-sm truncate">{source.url}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {source.source_type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={source.is_active}
                              onCheckedChange={(checked) => toggleSource(source.id, checked)}
                            />
                            <span className="text-sm text-gray-300">
                              {source.is_active ? 'Активен' : 'Отключен'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Управление пользователями</h2>
              
              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id} className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{user.email}</h3>
                          <p className="text-gray-400 text-sm">
                            Зарегистрирован: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </Badge>
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.user_id, e.target.value as 'admin' | 'user')}
                            className="bg-black/20 border border-purple-500/30 text-white rounded-md px-3 py-1 text-sm"
                          >
                            <option value="user">Пользователь</option>
                            <option value="admin">Администратор</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Статистика сайта</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">{stats.totalArticles}</div>
                      <div className="text-sm text-gray-400">Всего статей</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{stats.publishedArticles}</div>
                      <div className="text-sm text-gray-400">Опубликованных</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-400">Пользователей</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalReactions}</div>
                      <div className="text-sm text-gray-400">Реакций</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.activeSources}</div>
                      <div className="text-sm text-gray-400">Активных источников</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Настройки системы</h2>
              
              {/* Add New Setting */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus size={20} className="mr-2" />
                    Добавить настройку
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Ключ"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input
                      placeholder="Значение (JSON)"
                      value={newSetting.value}
                      onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Input
                      placeholder="Описание"
                      value={newSetting.description}
                      onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-white"
                    />
                    <Button onClick={addSetting} className="bg-green-600 hover:bg-green-700">
                      Добавить
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Settings List */}
              <div className="grid gap-4">
                {settings.map((setting) => (
                  <Card key={setting.id} className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{setting.key}</h3>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                          <code className="text-xs text-green-400 mt-1 block">
                            {JSON.stringify(setting.value)}
                          </code>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSetting(setting.id)}
                            className="border-red-500/50 text-red-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Create Article Modal */}
          {isCreatingArticle && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-black/90 border-purple-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Создать новую статью
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatingArticle(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Заголовок *"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                  <Input
                    placeholder="Автор"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                  <Input
                    placeholder="Источник URL *"
                    value={newArticle.original_url}
                    onChange={(e) => setNewArticle({ ...newArticle, original_url: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                  <Input
                    type="datetime-local"
                    value={newArticle.published_at}
                    onChange={(e) => setNewArticle({ ...newArticle, published_at: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                  <Textarea
                    placeholder="Краткое описание"
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                    rows={3}
                  />
                  <Textarea
                    placeholder="Содержание статьи *"
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-white"
                    rows={8}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingArticle(false)}
                      className="border-gray-500/50 text-gray-300"
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={createArticle}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={14} className="mr-2" />
                      Создать статью
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
