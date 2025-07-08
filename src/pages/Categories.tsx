
import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "Технологии",
    key: "tech",
    description: "Последние новости технологий и ИИ",
    count: 156,
    color: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    articles: [
      "OpenAI выпустила GPT-5",
      "Google представила новый Gemini",
      "Apple инвестирует в ИИ"
    ]
  },
  {
    name: "Мировые новости",
    key: "world",
    description: "Важные события со всего мира",
    count: 234,
    color: "bg-green-500/20 border-green-500/50 text-green-300",
    articles: [
      "Саммит G7 обсуждает регулирование ИИ",
      "ООН принимает резолюцию по ИИ",
      "Международные новости недели"
    ]
  },
  {
    name: "Бизнес",
    key: "business",
    description: "Финансы, инвестиции и корпоративные новости",
    count: 189,
    color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    articles: [
      "NVIDIA достигла $3 трлн капитализации",
      "Венчурные инвестиции в ИИ растут",
      "IPO ИИ-стартапов в 2024"
    ]
  },
  {
    name: "Наука",
    key: "science",
    description: "Научные открытия и исследования",
    count: 87,
    color: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    articles: [
      "Новое исследование нейронных сетей",
      "Квантовые вычисления и ИИ",
      "Биоинформатика и машинное обучение"
    ]
  },
  {
    name: "Россия",
    key: "russia",
    description: "Российские новости технологий и ИИ",
    count: 67,
    color: "bg-red-500/20 border-red-500/50 text-red-300",
    articles: [
      "Яндекс развивает YandexGPT",
      "Сбер инвестирует в ИИ",
      "Российские ИИ-стартапы"
    ]
  },
  {
    name: "Европа",
    key: "europe",
    description: "Европейские технологические новости",
    count: 92,
    color: "bg-indigo-500/20 border-indigo-500/50 text-indigo-300",
    articles: [
      "ЕС принимает AI Act",
      "Французские ИИ-стартапы",
      "Немецкие инвестиции в технологии"
    ]
  },
  {
    name: "Азия",
    key: "asia",
    description: "Азиатские технологические тренды",
    count: 134,
    color: "bg-orange-500/20 border-orange-500/50 text-orange-300",
    articles: [
      "Китайские ИИ-модели",
      "Японские роботы с ИИ",
      "Корейские технологические гиганты"
    ]
  },
  {
    name: "RSS фиды",
    key: "rss",
    description: "Автоматически собранные новости",
    count: 45,
    color: "bg-gray-500/20 border-gray-500/50 text-gray-300",
    articles: [
      "Новости из RSS-каналов",
      "Автоматический парсинг",
      "Агрегированный контент"
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

          {/* Categories Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-xs sm:text-sm mb-3">Популярные статьи:</h4>
                    {category.articles.map((article, index) => (
                      <div key={index} className="text-gray-400 text-xs sm:text-sm hover:text-purple-300 transition-colors cursor-pointer leading-relaxed">
                        • {article}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-500/20">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar size={10} className="mr-1" />
                      <span className="truncate">Последнее обновление: вчера</span>
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
