import { useState } from 'react';
import { Volume2, Settings, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'robot' | 'alien';
  sample?: string;
}

const voiceOptions: VoiceOption[] = [
  {
    id: 'alloy',
    name: 'Trinity (Женский)',
    description: 'Основной голос Trinity AI',
    gender: 'female'
  },
  {
    id: 'echo',
    name: 'Скептик (Мужской)',
    description: 'Серьёзный аналитический тон',
    gender: 'male'
  },
  {
    id: 'fable',
    name: 'Ироник (Мужской)',
    description: 'Саркастичный и остроумный',
    gender: 'male'
  },
  {
    id: 'onyx',
    name: 'Робот (Синтетический)',
    description: 'Классический AI-голос',
    gender: 'robot'
  },
  {
    id: 'nova',
    name: 'Футуристка (Женский)',
    description: 'Космический журналист',
    gender: 'alien'
  },
  {
    id: 'shimmer',
    name: 'Критик (Женский)',
    description: 'Острый аналитический стиль',
    gender: 'female'
  }
];

const sarcasticLevels = [
  { value: 0, label: 'Сухой факт' },
  { value: 25, label: 'Легкая ирония' },
  { value: 50, label: 'Здоровый скептицизм' },
  { value: 75, label: 'Едкий сарказм' },
  { value: 100, label: 'Взрывной цинизм' }
];

interface VoiceSelectorProps {
  articleTitle: string;
  articleContent: string;
  onAudioGenerated?: (audioUrl: string) => void;
}

const VoiceSelector = ({ articleTitle, articleContent, onAudioGenerated }: VoiceSelectorProps) => {
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [sarcasticLevel, setSarcasticLevel] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-podcast-audio', {
        body: {
          title: articleTitle,
          content: articleContent,
          voice: selectedVoice,
          sarcasticLevel: sarcasticLevel[0]
        }
      });

      if (error) throw error;
      
      setAudioUrl(data.audioUrl);
      onAudioGenerated?.(data.audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getVoiceEmoji = (gender: string) => {
    switch (gender) {
      case 'female': return '👩';
      case 'male': return '👨';
      case 'robot': return '🤖';
      case 'alien': return '👽';
      default: return '🎤';
    }
  };

  const getSarcasticDescription = (level: number) => {
    const desc = sarcasticLevels.find(s => Math.abs(s.value - level) <= 12.5);
    return desc?.label || 'Настраиваемый уровень';
  };

  return (
    <Card className="bg-black/40 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Volume2 className="mr-2" size={20} />
          Голос подкаста
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Выберите голос
          </label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="bg-black/20 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voiceOptions.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div className="flex items-center space-x-2">
                    <span>{getVoiceEmoji(voice.gender)}</span>
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-xs text-gray-400">{voice.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sarcasm Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Сарказмометр
            </label>
            <span className="text-xs text-purple-400">
              {getSarcasticDescription(sarcasticLevel[0])}
            </span>
          </div>
          <Slider
            value={sarcasticLevel}
            onValueChange={setSarcasticLevel}
            max={100}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>😐 Факты</span>
            <span>🙄 Сарказм</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateAudio}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Генерация аудио...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Создать подкаст
            </>
          )}
        </Button>

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Ваш подкаст готов!</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-purple-400"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
            </div>
            <audio
              src={audioUrl}
              controls
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}

        {/* Voice Preview */}
        <div className="text-xs text-gray-400 p-3 bg-black/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <span>{getVoiceEmoji(voiceOptions.find(v => v.id === selectedVoice)?.gender || 'robot')}</span>
            <span className="font-medium">
              {voiceOptions.find(v => v.id === selectedVoice)?.name}
            </span>
          </div>
          <p className="italic">
            "{getSarcasticDescription(sarcasticLevel[0])} будет применен к тексту статьи"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSelector;