import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Volume2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_audio.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Скачивание началось",
        description: "Аудиофайл загружается на ваше устройство",
      });
    } catch (error) {
      toast({
        title: "Ошибка скачивания",
        description: "Не удалось скачать аудиофайл",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Volume2 size={16} className="text-purple-400" />
        <span className="text-sm text-gray-300">Аудиоверсия</span>
      </div>
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={audioUrl} type="audio/mpeg" />
      </audio>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="text-purple-400 hover:text-purple-300"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>

        <div className="flex-1 space-y-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="text-green-400 hover:text-green-300"
        >
          <Download size={16} />
        </Button>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;