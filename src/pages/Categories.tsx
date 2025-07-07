
import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "Breakthrough",
    description: "Революционные прорывы, которые изменят мир (или нет)",
    count: 45,
    color: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    articles: [
      "OpenAI снова 'революционизирует' мир",
      "Новый ИИ умеет читать мысли (спойлер: нет)",
      "Квантовый компьютер решил все проблемы"
    ]
  },
  {
    name: "Corporate Drama",
    description: "Битвы корпораций, переименования и PR-кризисы",
    count: 67,
    color: "bg-red-500/20 border-red-500/50 text-red-300",
    articles: [
      "Google Bard переименован в Gemini (опять)",
      "Meta vs Apple: война за приватность",
      "Microsoft покупает еще одну ИИ-компанию"
    ]
  },
  {
    name: "Hype",
    description: "Чистый маркетинг и необоснованные обещания",
    count: 89,
    color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    articles: [
      "ИИ заменит всех программистов завтра",
      "Новый чат-бот 'лучше ChatGPT'",
      "Стартап обещает AGI через год"
    ]
  },
  {
    name: "Reality Check",
    description: "Разбор мифов и возвращение на землю",
    count: 34,
    color: "bg-green-500/20 border-green-500/50 text-green-300",
    articles: [
      "Почему ИИ не захватит мир в 2024",
      "Ограничения современных LLM",
      "Что такое hallucination и почему это проблема"
    ]
  },
  {
    name: "Open Source Drama",
    description: "Споры вокруг открытости моделей и лицензий",
    count: 23,
    color: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    articles: [
      "Meta выпустила 'открытый' ИИ с закрытыми исходниками",
      "Споры вокруг лицензии Llama 2",
      "Что означает 'открытый' ИИ на самом деле"
    ]
  },
  {
    name: "Ethics & Safety",
    description: "Этические вопросы и безопасность ИИ",
    count: 19,
    color: "bg-orange-500/20 border-orange-500/50 text-orange-300",
    articles: [
      "Anthropic vs OpenAI: кто более этичен?",
      "Новые правила ЕС по ИИ",
      "Проблемы bias в языковых моделях"
    ]
  }
];

const Categories = () => {
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
                Категории
              </Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                Новости
              </Link>
              <Link to="/podcasts" className="text-gray-300 hover:text-purple-400 transition-colors">
                Подкасты
              </Link>
              <Link to="/categories" className="text-purple-400">
                Категории
              </Link>
              <Link to="/stats" className="text-gray-300 hover:text-purple-400 transition-colors">
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
              Категории новостей
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Структурированный сарказм для вашего удобства
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                {categories.reduce((acc, cat) => acc + cat.count, 0)} статей
              </div>
              <div className="flex items-center">
                <TrendingUp size={16} className="mr-2" />
                {categories.length} категорий
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-white text-lg">
                      {category.name}
                    </CardTitle>
                    <Badge className={category.color}>
                      {category.count}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm mb-3">Популярные статьи:</h4>
                    {category.articles.map((article, index) => (
                      <div key={index} className="text-gray-400 text-sm hover:text-purple-300 transition-colors cursor-pointer">
                        • {article}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Последнее обновление: вчера
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Tags */}
          <div className="mt-12">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Популярные теги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    'OpenAI', 'ChatGPT', 'Google', 'Meta', 'Anthropic', 'Microsoft',
                    'AGI', 'LLM', 'Transformer', 'Neural Networks', 'Machine Learning',
                    'Ethics', 'Safety', 'Open Source', 'Regulation', 'Hype'
                  ].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
