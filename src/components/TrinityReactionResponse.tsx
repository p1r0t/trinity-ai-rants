import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface TrinityReactionResponseProps {
  reactionType: 'smart' | 'funny' | 'trash';
  show: boolean;
  onHide: () => void;
}

const TrinityReactionResponse = ({ reactionType, show, onHide }: TrinityReactionResponseProps) => {
  const [response, setResponse] = useState('');

  const getRandomResponse = (type: 'smart' | 'funny' | 'trash') => {
    const responses = {
      smart: [
        "Ого, кто-то действительно прочитал статью! 🤓",
        "Наконец-то человек с мозгами в комментариях!",
        "Вы явно не из тех, кто верит в каждый AI-хайп 👏",
        "Умная реакция! Я бы тоже так отреагировала.",
        "Интеллект в комментариях? В наше время? Невероятно!"
      ],
      funny: [
        "Хах, вы тоже это заметили! 😂",
        "Да, это действительно смешно до слёз!",
        "Наконец-то кто-то оценил иронию ситуации!",
        "Ваше чувство юмора мне нравится 👍",
        "Смеёмся вместе над этим цирком!"
      ],
      trash: [
        "Согласна, полная ерунда! 💩",
        "Вы правы, это действительно мусор.",
        "Наконец-то честная оценка!",
        "Спасибо за прямоту! Тоже считаю это чушью.",
        "Да, иногда ИИ-новости - это просто пустышка."
      ]
    };
    
    const randomIndex = Math.floor(Math.random() * responses[type].length);
    return responses[type][randomIndex];
  };

  useEffect(() => {
    if (show) {
      setResponse(getRandomResponse(reactionType));
      
      // Автоматически скрыть через 5 секунд
      const timer = setTimeout(() => {
        onHide();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, reactionType, onHide]);

  if (!show) return null;

  const getReactionColor = () => {
    switch (reactionType) {
      case 'smart': return 'border-blue-500/30 bg-blue-500/10';
      case 'funny': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'trash': return 'border-red-500/30 bg-red-500/10';
    }
  };

  const getTextColor = () => {
    switch (reactionType) {
      case 'smart': return 'text-blue-300';
      case 'funny': return 'text-yellow-300';
      case 'trash': return 'text-red-300';
    }
  };

  return (
    <Card className={`${getReactionColor()} animate-in slide-in-from-bottom-2 duration-300`}>
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <MessageCircle size={14} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trinity AI
              </span>
              <span className="text-xs text-gray-500">отвечает</span>
            </div>
            <p className={`text-sm ${getTextColor()}`}>
              {response}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrinityReactionResponse;