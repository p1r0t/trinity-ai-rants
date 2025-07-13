import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Globe, Key, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface NewsAPISettingsProps {
  user: User | null;
}

interface NewsPreferences {
  api_key: string;
  preferred_categories: string[];
  preferred_sources: string[];
  language: string;
  country: string;
  auto_fetch: boolean;
}

const NewsAPISettings = ({ user }: NewsAPISettingsProps) => {
  const [preferences, setPreferences] = useState<NewsPreferences>({
    api_key: '',
    preferred_categories: ['technology', 'business', 'science'],
    preferred_sources: [],
    language: 'en',
    country: 'us',
    auto_fetch: true
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');

  const categories = [
    { id: 'technology', label: 'Технологии' },
    { id: 'business', label: 'Бизнес' },
    { id: 'science', label: 'Наука' },
    { id: 'health', label: 'Здоровье' },
    { id: 'entertainment', label: 'Развлечения' },
    { id: 'sports', label: 'Спорт' },
    { id: 'general', label: 'Общие новости' }
  ];

  const countries = [
    { code: 'us', name: 'США' },
    { code: 'ru', name: 'Россия' },
    { code: 'gb', name: 'Великобритания' },
    { code: 'de', name: 'Германия' },
    { code: 'fr', name: 'Франция' },
    { code: 'jp', name: 'Япония' },
    { code: 'cn', name: 'Китай' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
  ];

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('news_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .eq('api_provider', 'newsapi')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          api_key: data.api_key || '',
          preferred_categories: data.preferred_categories || ['technology'],
          preferred_sources: data.preferred_sources || [],
          language: data.language || 'en',
          country: data.country || 'us',
          auto_fetch: data.auto_fetch || true
        });
        
        if (data.api_key) {
          setApiStatus('valid');
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('news_preferences')
        .upsert({
          user_id: user.id,
          api_provider: 'newsapi',
          api_key: preferences.api_key,
          preferred_categories: preferences.preferred_categories,
          preferred_sources: preferences.preferred_sources,
          language: preferences.language,
          country: preferences.country,
          auto_fetch: preferences.auto_fetch,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Настройки сохранены",
        description: "Ваши предпочтения NewsAPI обновлены",
      });

      // Если есть API ключ, проверяем его
      if (preferences.api_key) {
        await testApiKey();
      }

    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiKey = async () => {
    if (!preferences.api_key) return;

    setTesting(true);
    try {
      // Тестируем API ключ через edge function
      const { data, error } = await supabase.functions.invoke('test-newsapi', {
        body: { apiKey: preferences.api_key }
      });

      if (error) throw error;

      if (data.status === 'ok') {
        setApiStatus('valid');
        toast({
          title: "API ключ работает",
          description: "Подключение к NewsAPI успешно установлено",
        });
      } else {
        setApiStatus('invalid');
        toast({
          title: "Ошибка API ключа",
          description: "Проверьте правильность введенного ключа",
          variant: "destructive",
        });
      }
    } catch (error) {
      setApiStatus('invalid');
      toast({
        title: "Ошибка проверки",
        description: "Не удалось проверить API ключ",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const fetchNews = async () => {
    if (!preferences.api_key) {
      toast({
        title: "API ключ не настроен",
        description: "Сначала добавьте свой NewsAPI ключ",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: {
          apiKey: preferences.api_key,
          categories: preferences.preferred_categories,
          language: preferences.language,
          country: preferences.country
        }
      });

      if (error) throw error;

      toast({
        title: "Новости загружены",
        description: `Добавлено ${data.articlesCount} новых статей`,
      });

      // Перезагружаем страницу для отображения новых статей
      window.location.reload();

    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить новости",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardContent className="pt-6 text-center">
          <Globe className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            Войдите в систему для настройки NewsAPI
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-border/50 glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Globe className="mr-2 text-primary" size={20} />
          NewsAPI Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Добавьте свой NewsAPI ключ для получения реальных новостей
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              API Ключ
            </label>
            <div className="flex items-center space-x-2">
              {apiStatus === 'valid' && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  Активен
                </Badge>
              )}
              {apiStatus === 'invalid' && (
                <Badge variant="destructive">
                  Недействителен
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://newsapi.org/account', '_blank')}
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Введите ваш NewsAPI ключ"
              value={preferences.api_key}
              onChange={(e) => setPreferences({
                ...preferences,
                api_key: e.target.value
              })}
              className="flex-1"
            />
            <Button
              onClick={testApiKey}
              disabled={!preferences.api_key || testing}
              size="sm"
              variant="outline"
            >
              {testing ? <RefreshCw className="animate-spin" size={16} /> : <Key size={16} />}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Получите бесплатный ключ на{' '}
            <a 
              href="https://newsapi.org/register" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              newsapi.org
            </a>
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Категории новостей
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={preferences.preferred_categories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...preferences.preferred_categories, category.id]
                      : preferences.preferred_categories.filter(c => c !== category.id);
                    setPreferences({
                      ...preferences,
                      preferred_categories: updated
                    });
                  }}
                />
                <label 
                  htmlFor={category.id}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Language & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Язык
            </label>
            <Select
              value={preferences.language}
              onValueChange={(value) => setPreferences({
                ...preferences,
                language: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Страна
            </label>
            <Select
              value={preferences.country}
              onValueChange={(value) => setPreferences({
                ...preferences,
                country: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto Fetch */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto-fetch"
            checked={preferences.auto_fetch}
            onCheckedChange={(checked) => setPreferences({
              ...preferences,
              auto_fetch: checked as boolean
            })}
          />
          <label 
            htmlFor="auto-fetch"
            className="text-sm text-foreground cursor-pointer"
          >
            Автоматически загружать новые статьи каждый час
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={savePreferences}
            disabled={loading}
            className="flex-1"
          >
            <Settings size={16} className="mr-2" />
            {loading ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
          
          <Button
            onClick={fetchNews}
            disabled={loading || !preferences.api_key}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw size={16} className="mr-2" />
            Загрузить новости
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsAPISettings;