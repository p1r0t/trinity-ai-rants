import { useState } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ClickbaitButtonProps {
  originalTitle: string;
  articleId: string;
}

const ClickbaitButton = ({ originalTitle, articleId }: ClickbaitButtonProps) => {
  const [clickbaitTitle, setClickbaitTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClickbait, setIsClickbait] = useState(false);

  const generateClickbait = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-clickbait', {
        body: { 
          originalTitle,
          articleId 
        }
      });
      
      if (error) throw error;
      setClickbaitTitle(data.clickbaitTitle);
      setIsClickbait(true);
    } catch (error) {
      console.error('Error generating clickbait:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const showOriginal = () => {
    setIsClickbait(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white leading-tight">
          {isClickbait ? clickbaitTitle : originalTitle}
        </h2>
      </div>
      
      <div className="flex items-center space-x-2">
        {!isClickbait ? (
          <Button
            variant="outline"
            size="sm"
            onClick={generateClickbait}
            disabled={isGenerating}
            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
          >
            <Zap size={16} className="mr-2" />
            {isGenerating ? 'Генерация...' : 'Показать как в жёлтой прессе'}
          </Button>
        ) : (
          <>
            <Card className="bg-yellow-500/10 border-yellow-500/30 flex-1">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <Zap size={14} />
                  <span className="font-medium">Режим жёлтой прессы активен</span>
                </div>
              </CardContent>
            </Card>
            <Button
              variant="ghost"
              size="sm"
              onClick={showOriginal}
              className="text-gray-400 hover:text-white"
            >
              <RotateCcw size={16} className="mr-2" />
              Обычный заголовок
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClickbaitButton;