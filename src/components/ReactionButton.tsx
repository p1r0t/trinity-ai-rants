import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Brain, Laugh, Trash2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import TrinityReactionResponse from './TrinityReactionResponse';

interface ReactionButtonProps {
  articleId: string;
  type: 'smart' | 'funny' | 'trash';
  user: User | null;
  onReaction?: (type: 'smart' | 'funny' | 'trash') => void;
}

const ReactionButton = ({ articleId, type, user, onReaction }: ReactionButtonProps) => {
  const [count, setCount] = useState(0);
  const [userReacted, setUserReacted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTrinityResponse, setShowTrinityResponse] = useState(false);

  const icons = {
    smart: Brain,
    funny: Laugh,
    trash: Trash2
  };

  const colors = {
    smart: 'text-blue-400 hover:text-blue-300',
    funny: 'text-yellow-400 hover:text-yellow-300',
    trash: 'text-red-400 hover:text-red-300'
  };

  const labels = {
    smart: 'Умно',
    funny: 'Смешно',
    trash: 'Мусор'
  };

  const Icon = icons[type];

  useEffect(() => {
    loadReactionData();
  }, [articleId, type, user]);

  const loadReactionData = async () => {
    try {
      // Get total count for this reaction type
      const { data: reactions, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('article_id', articleId)
        .eq('reaction_type', type);

      if (error) throw error;

      setCount(reactions?.length || 0);

      // Check if current user has reacted
      if (user) {
        const userReaction = reactions?.find(r => r.user_id === user.id);
        setUserReacted(!!userReaction);
      }
    } catch (error) {
      console.error('Error loading reaction data:', error);
    }
  };

  const handleReaction = async () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы оставить реакцию",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (userReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .eq('reaction_type', type);

        if (error) throw error;

        setUserReacted(false);
        setCount(prev => prev - 1);
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            article_id: articleId,
            user_id: user.id,
            reaction_type: type
          });

        if (error) throw error;

        setUserReacted(true);
        setCount(prev => prev + 1);
        
        // Show Trinity response when user reacts
        setShowTrinityResponse(true);
        onReaction?.(type);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить реакцию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReaction}
        disabled={loading}
        className={`flex items-center space-x-1 ${colors[type]} ${userReacted ? 'bg-white/10' : ''}`}
      >
        <Icon size={16} />
        <span className="text-xs">{count}</span>
        <span className="hidden sm:inline text-xs">{labels[type]}</span>
      </Button>
      
      {showTrinityResponse && (
        <TrinityReactionResponse
          reactionType={type}
          show={showTrinityResponse}
          onHide={() => setShowTrinityResponse(false)}
        />
      )}
    </>
  );
};

export default ReactionButton;