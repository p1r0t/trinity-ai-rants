
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Volume2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    summary: string;
    category: string;
    author: string;
    date: string;
    views: number;
    reactions: {
      smart: number;
      funny: number;
      trash: number;
    };
    hasAudio: boolean;
    tldr: string;
    image: string;
  };
}

const NewsCard = ({ news }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <Badge 
            variant="outline" 
            className="border-purple-500/50 text-purple-300 text-xs"
          >
            {news.category}
          </Badge>
          {news.hasAudio && (
            <Badge 
              variant="outline" 
              className="border-green-500/50 text-green-300 text-xs flex items-center gap-1"
            >
              <Volume2 size={12} />
              Аудио
            </Badge>
          )}
        </div>
        
        <Link to={`/news/${news.id}`}>
          <h3 className="text-xl font-bold text-white hover:text-purple-300 transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent>
        {/* TL;DR */}
        <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border-l-2 border-purple-500">
          <div className="text-xs text-purple-300 font-medium mb-1">TL;DR</div>
          <p className="text-sm text-gray-300">{news.tldr}</p>
        </div>

        {/* Summary */}
        <p className="text-gray-400 mb-4 line-clamp-3">
          {news.summary}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              {news.author}
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {formatDate(news.date)}
            </div>
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              {news.views}
            </div>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
              <span>🤓</span>
              <span className="text-xs">{news.reactions.smart}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors">
              <span>😂</span>
              <span className="text-xs">{news.reactions.funny}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
              <span>💩</span>
              <span className="text-xs">{news.reactions.trash}</span>
            </button>
          </div>
          
          <Link to={`/news/${news.id}`}>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              Читать полностью
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
