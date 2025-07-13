import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Share2, Bell, Settings } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  sendData: (data: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramAppProps {
  children?: React.ReactNode;
}

const TelegramApp = ({ children }: TelegramAppProps) => {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      setIsTelegramApp(true);
      setTelegramUser(tg.initDataUnsafe.user);
      
      // Инициализируем Telegram WebApp
      tg.ready();
      tg.expand();
      setIsReady(true);

      // Применяем тему Telegram
      applyTelegramTheme(tg.themeParams);

      // Настраиваем главную кнопку
      tg.MainButton.text = "Поделиться статьей";
      tg.MainButton.onClick(() => {
        tg.HapticFeedback.impactOccurred('medium');
        handleShare();
      });

      // Настраиваем кнопку "Назад"
      tg.BackButton.onClick(() => {
        tg.HapticFeedback.impactOccurred('light');
        window.history.back();
      });

      return () => {
        tg.MainButton.hide();
        tg.BackButton.hide();
      };
    }
  }, []);

  const applyTelegramTheme = (themeParams: any) => {
    if (!themeParams) return;

    const root = document.documentElement;
    
    if (themeParams.bg_color) {
      root.style.setProperty('--tg-bg-color', themeParams.bg_color);
    }
    if (themeParams.text_color) {
      root.style.setProperty('--tg-text-color', themeParams.text_color);
    }
    if (themeParams.button_color) {
      root.style.setProperty('--tg-button-color', themeParams.button_color);
    }

    // Добавляем CSS для темы Telegram
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --background: ${themeParams.bg_color || 'hsl(240 10% 8%)'};
        --foreground: ${themeParams.text_color || 'hsl(0 0% 95%)'};
        --primary: ${themeParams.button_color || 'hsl(270 80% 70%)'};
      }
      
      body {
        background: var(--tg-bg-color, var(--background));
        color: var(--tg-text-color, var(--foreground));
      }
    `;
    document.head.appendChild(style);
  };

  const showMainButton = (text: string = "Поделиться статьей") => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.enable();
    }
  };

  const hideMainButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide();
    }
  };

  const showBackButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  };

  const handleShare = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Отправляем данные в Telegram
      tg.sendData(JSON.stringify({
        action: 'share',
        url: window.location.href,
        title: document.title
      }));
      
      tg.HapticFeedback.notificationOccurred('success');
      
      toast({
        title: "Статья отправлена",
        description: "Ссылка на статью отправлена в чат",
      });
    }
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
    }
  };

  const openExternalLink = (url: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url, { try_instant_view: true });
    } else {
      window.open(url, '_blank');
    }
  };

  // Если не в Telegram, показываем обычный интерфейс
  if (!isTelegramApp) {
    return (
      <div className="space-y-6">
        {children}
        
        {/* Telegram Features Card */}
        <Card className="bg-card/80 border-border/50 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Smartphone className="mr-2 text-primary" size={20} />
              Telegram WebApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <Smartphone size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Используйте Trinity AI News в Telegram для лучшего опыта
              </p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  <Bell size={12} className="mr-1" />
                  Уведомления
                </Badge>
                <Badge variant="outline" className="mr-2">
                  <Share2 size={12} className="mr-1" />
                  Быстрое распространение
                </Badge>
                <Badge variant="outline">
                  <Settings size={12} className="mr-1" />
                  Нативная интеграция
                </Badge>
              </div>
              <Button 
                className="mt-4"
                onClick={() => openExternalLink('https://t.me/trinity_ai_news_bot')}
              >
                Открыть в Telegram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Telegram WebApp интерфейс
  return (
    <div className="telegram-app min-h-screen">
      {/* Header для Telegram */}
      {telegramUser && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Trinity AI News</h1>
              <p className="text-sm text-muted-foreground">
                Привет, {telegramUser.first_name}!
              </p>
            </div>
            <Badge variant="secondary">
              <Smartphone size={12} className="mr-1" />
              Telegram
            </Badge>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="telegram-content p-4 pb-20">
        {children}
      </div>

      {/* Telegram WebApp Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic('medium');
              showMainButton();
            }}
          >
            <Share2 size={16} className="mr-2" />
            Поделиться
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              triggerHaptic('light');
              toast({
                title: "Уведомления включены",
                description: "Вы будете получать уведомления о новых статьях",
              });
            }}
          >
            <Bell size={16} className="mr-2" />
            Уведомления
          </Button>
        </div>
      </div>

      <style>{`
        .telegram-app {
          background: var(--tg-bg-color, var(--background));
          color: var(--tg-text-color, var(--foreground));
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .telegram-content {
          padding-bottom: env(safe-area-inset-bottom, 80px);
        }

        /* Telegram-specific optimizations */
        .telegram-app .hover-lift:hover {
          transform: none; /* Disable hover effects in Telegram */
        }
        
        .telegram-app button:active {
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
};

export { TelegramApp };
export default TelegramApp;