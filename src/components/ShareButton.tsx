import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Copy, MessageCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  url?: string;
  text?: string;
}

const ShareButton = ({ title, url, text }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareText = text || `Читаю интересную статью: ${title}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to custom share menu if native sharing fails
        console.error('Error sharing:', error);
        setIsOpen(!isOpen);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: "Скопировано!",
        description: "Ссылка скопирована в буфер обмена",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать ссылку",
        variant: "destructive",
      });
    }
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setIsOpen(false);
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const shareToVK = () => {
    const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(shareText)}`;
    window.open(vkUrl, '_blank');
    setIsOpen(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNativeShare}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline ml-1">Поделиться</span>
      </Button>

      {isOpen && !navigator.share && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card/95 border border-border rounded-lg p-4 space-y-3 z-50 backdrop-blur-sm shadow-lg">
          <div className="text-sm text-foreground font-medium mb-3">Поделиться статьей</div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Copy size={14} className="mr-1" />
              Копировать
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToTelegram}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <MessageCircle size={14} className="mr-1" />
              Telegram
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              📱 WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToVK}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              🌐 VK
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareToTwitter}
            className="w-full hover:bg-accent hover:text-accent-foreground"
          >
            🐦 Twitter/X
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Закрыть
          </Button>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ShareButton;