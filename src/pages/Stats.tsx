
import { Link } from 'react-router-dom';
import { TrendingUp, Users, FileText, Headphones, Eye, Calendar, Award, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Stats = () => {
  const overallStats = [
    { label: 'Всего статей', value: '247', icon: FileText, color: 'text-blue-400', change: '+12' },
    { label: 'Подкастов', value: '15', icon: Headphones, color: 'text-green-400', change: '+2' },
    { label: 'Читателей', value: '12.3K', icon: Users, color: 'text-purple-400', change: '+5.2%' },
    { label: 'Просмотров', value: '156K', icon: Eye, color: 'text-pink-400', change: '+23%' }
  ];

  const topArticles = [
    {
      title: "OpenAI снова 'революционизирует' мир: GPT-5 теперь умеет делать кофе",
      views: 1337,
      reactions: 221,
      category: "Breakthrough"
    },
    {
      title: "Meta выпустила LLaMA 3: 'Открытый' ИИ с закрытыми исходниками",
      views: 2156,
      reactions: 290,
      category: "Open Source Drama"
    },
    {
      title: "Google Bard переименован в Gemini (опять)",
      views: 892,
      reactions: 276,
      category: "Corporate Drama"
    }
  ];

  const categoryStats = [
    { name: "Corporate Drama", count: 67, percentage: 27 },
    { name: "Hype", count: 89, percentage: 36 },
    { name: "Breakthrough", count: 45, percentage: 18 },
    { name: "Reality Check", count: 34, percentage: 14 },
    { name: "Open Source Drama", count: 23, percentage: 9 }
  ];

  const monthlyViews = [
    { month: 'Сентябрь', views: 23400 },
    { month: 'Октябрь', views: 34200 },
    { month: 'Ноябрь', views: 45600 },
    { month: 'Декабрь', views: 52800 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Trinity AI
                </h1>
              </Link>
              <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                Статистика
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                Новости
              </Link>
              <Link to="/podcasts" className="text-gray-300 hover:text-purple-400 transition-colors">
                Подкасты
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">
                Категории
              </Link>
              <Link to="/stats" className="text-purple-400">
                Статистика
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Статистика Trinity AI
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Цифры не врут (в отличие от некоторых новостей про ИИ)
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overallStats.map((stat) => (
              <Card key={stat.label} className="bg-black/40 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-green-400 text-sm">
                        {stat.change} за месяц
                      </p>
                    </div>
                    <stat.icon className={`${stat.color} w-8 h-8`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Articles */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="mr-2" size={20} />
                  Топ статей за месяц
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topArticles.map((article, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-purple-500/10">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {article.views}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare size={12} className="mr-1" />
                            {article.reactions}
                          </span>
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2" size={20} />
                  Распределение по категориям
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{category.name}</span>
                        <span className="text-white font-medium">{category.count}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Growth */}
          <Card className="bg-black/40 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2" size={20} />
                Рост аудитории
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {monthlyViews.map((month, index) => (
                  <div key={month.month} className="text-center p-4 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-white mb-1">
                      {month.views.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{month.month}</div>
                    {index > 0 && (
                      <div className="text-green-400 text-xs mt-1">
                        +{Math.round(((month.views - monthlyViews[index-1].views) / monthlyViews[index-1].views) * 100)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Интересные факты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">42</div>
                  <div className="text-gray-300 text-sm">
                    Среднее количество реакций 🤓 на статью
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">156</div>
                  <div className="text-gray-300 text-sm">
                    Среднее количество реакций 😂 на статью
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">23</div>
                  <div className="text-gray-300 text-sm">
                    Среднее количество реакций 💩 на статью
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-purple-500/20 text-center">
                <p className="text-gray-400 text-sm">
                  Самая популярная категория: <span className="text-purple-300 font-medium">Hype</span> 
                  <br />
                  (потому что все любят посмеяться над обещаниями маркетологов)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stats;
