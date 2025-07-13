import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Bell, BellOff, Settings, Check } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

interface PushNotificationsProps {
  user: User | null;
}

interface NotificationSettings {
  newArticles: boolean;
  reactions: boolean;
  comments: boolean;
  weekly: boolean;
}

const PushNotifications = ({ user }: PushNotificationsProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    newArticles: true,
    reactions: false,
    comments: true,
    weekly: true
  });

  useEffect(() => {
    checkSupport();
    loadSettings();
  }, [user]);

  const checkSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  };

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('user_id', user.id)
        .single();
      
      if (data?.notification_settings) {
        setSettings(data.notification_settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ notification_settings: newSettings })
        .eq('user_id', user.id);
      
      setSettings(newSettings);
      
      toast({
        title: "Настройки сохранены",
        description: "Ваши предпочтения уведомлений обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribe();
        toast({
          title: "Уведомления включены",
          description: "Теперь вы будете получать уведомления о новых статьях",
        });
      } else {
        toast({
          title: "Уведомления отклонены",
          description: "Вы можете изменить это в настройках браузера",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось настроить уведомления",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID ключ (в реальном проекте будет в переменных окружения)
      const publicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLFx';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });

      // Сохраняем подписку в базе данных
      await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription: JSON.stringify(subscription),
          created_at: new Date().toISOString()
        });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id);
        }
        
        setIsSubscribed(false);
        
        toast({
          title: "Уведомления отключены",
          description: "Вы больше не будете получать push-уведомления",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отключить уведомления",
        variant: "destructive",
      });
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Trinity AI News', {
        body: 'Это тестовое уведомление. Всё работает отлично! 🎉',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardContent className="pt-6 text-center">
          <Bell className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            Войдите в систему для настройки уведомлений
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isSupported) {
    return (
      <Card className="bg-card/80 border-border/50 glass-effect">
        <CardContent className="pt-6 text-center">
          <BellOff className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            Ваш браузер не поддерживает push-уведомления
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-border/50 glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Bell className="mr-2 text-primary" size={20} />
          Уведомления
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription Status */}
        <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
          <div className="flex items-center space-x-3">
            {isSubscribed ? (
              <Check className="text-green-500" size={20} />
            ) : (
              <Bell className="text-muted-foreground" size={20} />
            )}
            <div>
              <p className="font-medium text-foreground">
                {isSubscribed ? 'Подписка активна' : 'Не подписан'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed 
                  ? 'Вы получаете уведомления' 
                  : 'Включите уведомления для получения новостей'
                }
              </p>
            </div>
          </div>
          
          {isSubscribed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={unsubscribe}
              className="text-destructive border-destructive/50"
            >
              Отключить
            </Button>
          ) : (
            <Button
              onClick={requestPermission}
              disabled={loading || permission === 'denied'}
              size="sm"
            >
              {loading ? 'Настройка...' : 'Включить'}
            </Button>
          )}
        </div>

        {/* Notification Settings */}
        {isSubscribed && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Settings className="mr-2" size={16} />
              Настройки уведомлений
            </h4>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Новые статьи</span>
                <input
                  type="checkbox"
                  checked={settings.newArticles}
                  onChange={(e) => saveSettings({
                    ...settings,
                    newArticles: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Реакции на мои комментарии</span>
                <input
                  type="checkbox"
                  checked={settings.reactions}
                  onChange={(e) => saveSettings({
                    ...settings,
                    reactions: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Новые комментарии</span>
                <input
                  type="checkbox"
                  checked={settings.comments}
                  onChange={(e) => saveSettings({
                    ...settings,
                    comments: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Еженедельный дайджест</span>
                <input
                  type="checkbox"
                  checked={settings.weekly}
                  onChange={(e) => saveSettings({
                    ...settings,
                    weekly: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              className="w-full mt-4"
            >
              Отправить тестовое уведомление
            </Button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-3 bg-destructive/20 border border-destructive/50 rounded-lg">
            <p className="text-sm text-destructive">
              Уведомления заблокированы. Включите их в настройках браузера.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotifications;