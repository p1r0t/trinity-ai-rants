
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Headphones } from 'lucide-react';

const StatsWidget = () => {
  const stats = [
    { label: 'Статей', value: '247', icon: FileText, color: 'text-blue-400' },
    { label: 'Подкастов', value: '15', icon: Headphones, color: 'text-green-400' },
    { label: 'Читателей', value: '12.3K', icon: Users, color: 'text-purple-400' },
    { label: 'Просмотров', value: '156K', icon: TrendingUp, color: 'text-pink-400' }
  ];

  return (
    <Card className="bg-black/40 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white text-lg">Статистика</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`${stat.color} mb-1`}>
                <stat.icon size={20} className="mx-auto" />
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;
