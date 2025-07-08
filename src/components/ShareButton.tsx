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
        console.error('Error sharing:', error);
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
        className="text-purple-400 hover:text-purple-300"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline ml-1">Поделиться</span>
      </Button>

      {isOpen && !navigator.share && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 border border-purple-500/30 rounded-lg p-4 space-y-3 z-50 backdrop-blur-sm">
          <div className="text-sm text-white font-medium mb-3">Поделиться статьей</div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              <Copy size={14} className="mr-1" />
              Копировать
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToTelegram}
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
            >
              <MessageCircle size={14} className="mr-1" />
              Telegram
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToWhatsApp}
              className="border-green-500/50 text-green-300 hover:bg-green-500/10"
            >
              📱 WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareToVK}
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
            >
              🌐 VK
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareToTwitter}
            className="w-full border-sky-500/50 text-sky-300 hover:bg-sky-500/10"
          >
            🐦 Twitter/X
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-full text-gray-400 hover:text-white"
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