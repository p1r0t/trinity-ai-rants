import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Eye, Clock, BookOpen, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface SmartFeedProps {
  totalArticles: number;
  userReadCount?: number;
  lastReadTime?: string;
}

const SmartFeed = ({ totalArticles, userReadCount = 0, lastReadTime }: SmartFeedProps) => {
  const [readingStreak, setReadingStreak] = useState(0);
  const [weeklyGoal] = useState(10);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    generateInsights();
  }, [totalArticles, userReadCount]);

  const generateInsights = () => {
    const newInsights = [];
    
    if (userReadCount > 0) {
      const readingPercentage = Math.round((userReadCount / totalArticles) * 100);
      newInsights.push(`Вы прочитали ${readingPercentage}% от всех статей`);
    }

    if (userReadCount >= 5) {
      newInsights.push("Вы активный читатель! 🎉");
    }

    const timeOfDay = new Date().getHours();
    if (timeOfDay >= 9 && timeOfDay <= 11) {
      newInsights.push("Утро - отличное время для чтения новостей ☕");
    } else if (timeOfDay >= 18 && timeOfDay <= 20) {
      newInsights.push("Вечерние новости для завершения дня 🌙");
    }

    if (newInsights.length === 0) {
      newInsights.push("Начните читать, чтобы получить персональную аналитику");
    }

    setInsights(newInsights);
  };

  const progressPercentage = Math.min((userReadCount / weeklyGoal) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Brain className="mr-2 text-blue-400" size={20} />
          Умная лента
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Недельная цель */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-300">Недельная цель</span>
            <span className="text-sm text-white">{userReadCount}/{weeklyGoal}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {userReadCount >= weeklyGoal && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Zap size={12} className="mr-1" />
              Цель достигнута!
            </Badge>
          )}
        </div>

        {/* Статистика чтения */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <BookOpen className="mx-auto text-blue-400 mb-1" size={20} />
            <div className="text-lg font-bold text-white">{userReadCount}</div>
            <div className="text-xs text-blue-300">Прочитано</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <Eye className="mx-auto text-blue-400 mb-1" size={20} />
            <div className="text-lg font-bold text-white">{readingStreak}</div>
            <div className="text-xs text-blue-300">Дней подряд</div>
          </div>
        </div>

        {/* AI Инсайты */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-300">AI Инсайты</h4>
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 rounded bg-white/5">
              <Brain className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
              <span className="text-xs text-gray-300">{insight}</span>
            </div>
          ))}
        </div>

        {/* Последняя активность */}
        {lastReadTime && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Clock size={12} />
            <span>Последнее чтение: {new Date(lastReadTime).toLocaleDateString('ru-RU')}</span>
          </div>
        )}

        <Button 
          variant="ghost" 
          className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          onClick={generateInsights}
        >
          <Brain size={16} className="mr-2" />
          Обновить инсайты
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartFeed;