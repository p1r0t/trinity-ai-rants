import { useState, useEffect } from 'react';
import { User, MessageCircle, Zap } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface TrinityComment {
  id: string;
  article_id: string;
  comment: string;
  mood: 'sarcastic' | 'skeptical' | 'amused' | 'concerned';
  created_at: string;
}

interface TrinityAvatarProps {
  articleId?: string;
  compact?: boolean;
}

const TrinityAvatar = ({ articleId, compact = false }: TrinityAvatarProps) => {
  const [comment, setComment] = useState<TrinityComment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTrinityComment = async () => {
    if (!articleId) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-trinity-comment', {
        body: { articleId }
      });
      
      if (error) throw error;
      setComment(data.comment);
    } catch (error) {
      console.error('Error generating Trinity comment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      generateTrinityComment();
    }
  }, [articleId]);

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'sarcastic': return '🙄';
      case 'skeptical': return '🤨';
      case 'amused': return '😏';
      case 'concerned': return '😬';
      default: return '🤖';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'sarcastic': return 'text-orange-400';
      case 'skeptical': return 'text-purple-400';
      case 'amused': return 'text-green-400';
      case 'concerned': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Trinity AI
        </span>
      </div>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-500/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trinity AI
              </h3>
              <span className="text-xs text-gray-500">• AI-журналистка</span>
              {comment && (
                <span className={`text-lg ${getMoodColor(comment.mood)}`}>
                  {getMoodEmoji(comment.mood)}
                </span>
              )}
            </div>
            
            {comment ? (
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            ) : isGenerating ? (
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400 text-sm">Trinity думает...</span>
                </div>
              </div>
            ) : articleId ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={generateTrinityComment}
                className="text-purple-400 hover:text-purple-300"
              >
                <MessageCircle size={16} className="mr-2" />
                Что думает Trinity?
              </Button>
            ) : (
              <p className="text-gray-400 text-sm italic">
                Привет! Я Trinity, ваша саркастичная AI-журналистка. 
                Разбираю новости ИИ с долей здорового скептицизма. 🤖
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrinityAvatar;