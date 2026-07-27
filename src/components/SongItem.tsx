import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Share2, FileText } from 'lucide-react';
import type { Song, Voice } from '../songs';
import { assetUrl, formatTime } from '../utils';

interface PlayerProps {
  songId: string;
  voice: Voice;
  path: string;
  playingId: string | null;
  onPlay: (id: string) => void;
  onDownload: (path: string, filename: string) => void;
  onShare: (songId: string, voice: Voice) => void;
  onTelemetry: (action: string, type: string) => void;
  t: (key: any) => string;
}

function AudioPlayer({ songId, voice, path, playingId, onPlay, onDownload, onShare, onTelemetry, t }: PlayerProps) {
  const audioId = `${songId}-${voice}`;
  const isPlaying = playingId === audioId;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentTime, setCT] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) Object.assign(audio.play(), { catch: () => { } });
    else audio.pause();
  }, [isPlaying, path]);

  const togglePlay = () => {
    if (isPlaying) {
      onPlay('');
    } else {
      onPlay(audioId);
      onTelemetry("▶️ Redare Audio", `MP3 - ${voice}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current && duration) {
      audioRef.current.currentTime = pct * duration;
      setCT(pct * duration);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fullUrl = assetUrl(path);
  const ext = path.split('.').pop() ?? 'mp3';

  return (
    <div className="flex flex-row items-center gap-4 w-full h-[42px] bg-[var(--bg)] border border-[var(--track)] rounded-full px-3 mt-4 shadow-sm">
      <audio
        ref={audioRef}
        src={fullUrl}
        preload="metadata"
        onTimeUpdate={(e) => setCT(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { setCT(0); onPlay(''); }}
      />

      <button
        onClick={togglePlay}
        className="flex-shrink-0 flex items-center justify-center rounded-full bg-[var(--accent)] text-[#0a0f0c] dark:text-[#0a0f0c] w-[26px] h-[26px] shadow-sm hover:opacity-90 transition-opacity"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-[1px]" fill="currentColor" />}
      </button>

      <div className="flex-1 relative flex items-center h-7 cursor-pointer group" onClick={handleSeek}>
        <div className="absolute inset-x-0 h-[8px] group-hover:h-[10px] bg-[var(--track)] rounded-full overflow-hidden transition-all">
          <div className="h-full bg-[var(--accent)] transition-all ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="tabular-nums text-[var(--muted)] text-right flex-shrink-0 tracking-tight whitespace-nowrap text-[12px] font-medium w-[72px]">
        <span>{formatTime(currentTime)}</span>
        <span> / {formatTime(duration)}</span>
      </div>

      <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0 ml-1 mr-1">
        <button
          onClick={() => {
            onDownload(fullUrl, `${songId}-${voice}.${ext}`);
            onTelemetry("💾 Descărcare Audio", `${ext.toUpperCase()} - ${voice}`);
          }}
          className="flex items-center justify-center sm:px-2.5 sm:py-1 rounded max-sm:p-1 max-sm:text-[var(--muted)] max-sm:hover:text-[var(--text)] sm:bg-[var(--track)] sm:text-[var(--text)] sm:hover:bg-[var(--text)] sm:hover:text-[var(--bg)] transition-all font-medium"
          title={t('download')}
        >
          <Download size={14} className="sm:mr-1.5" />
          <span className="hidden sm:inline text-[11px] uppercase tracking-wide">{t('download')}</span>
        </button>
        <button onClick={() => { onShare(songId, voice); onTelemetry("🔗 Distribuire", `Link Audio (${voice})`); }} className="p-1.5 sm:p-2 text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--track)] rounded-full transition-all">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
}

export interface SongProps {
  song: Song;
  playingId: string | null;
  onPlay: (id: string) => void;
  lang: { t: any };
  onOpenPdf: (id: string) => void;
  isHighlighted?: boolean;
  onShare: (songId: string, voice?: string) => void;
  onTelemetry: (action: string, songName: string, type: string) => void;
  onOpenAudio: (id: string) => void;
}

export function SongItem({ song, playingId, onPlay, lang, onOpenPdf, onOpenAudio, onShare, isHighlighted, onTelemetry }: SongProps) {
  const { t } = lang;
  const [activeVoice, setActiveVoice] = useState<Voice>(song.voices[0]);

  const handleDownloadMp3 = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      className={`py-5 border-b border-[var(--track)] last:border-0 transition-colors duration-1000 p-2 -mx-2 rounded-xl ${isHighlighted ? 'bg-[var(--highlight)]' : 'bg-transparent'
        }`}
      id={`song-${song.id}`}
    >
      <div className="mb-4 px-2">
        <h2 className="text-[17px] sm:text-lg font-semibold text-[var(--text)] leading-tight">
          {song.title} <span className="font-normal text-[var(--muted)]">— {song.composer}</span>
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-2 px-2">
        {song.voices.map((v) => {
          const isActive = activeVoice === v;
          return (
            <button
              key={v}
              onClick={() => setActiveVoice(v)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all border ${isActive
                ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)] shadow-sm'
                : 'bg-[var(--card)] text-[var(--text)] border-[var(--track)] hover:border-[var(--muted)]'
                }`}
            >
              {t(v)}
            </button>
          );
        })}
        {song.youtubeUrl && (
          <a
            href={song.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all border bg-[#FF0000] text-white border-[#FF0000] hover:bg-red-700 shadow-sm"
            onClick={() => onTelemetry("▶️ Redare YouTube", song.title, "Video")}
            title={t('youtube')}
          >
            <Play size={16} fill="currentColor" />
            {t('youtube')}
          </a>
        )}
        {song.audioUrl && (
          <button
            onClick={() => {
              onOpenAudio(song.id);
              onTelemetry("▶️ Deschidere Modal Demo", song.title, "Audio Demo");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all border shadow-sm bg-[#1DB954] text-white border-[#1DB954] hover:bg-[#1AA34A]"
            title="Audio Demo"
          >
            <Play size={16} fill="currentColor" />
            Audio Demo
          </button>
        )}
      </div>

      <div className="px-2 w-full">
        <AudioPlayer
          songId={song.id}
          voice={activeVoice}
          path={`audio/${song.id}/${activeVoice}.${song.audioExt ?? 'mp3'}`}
          playingId={playingId}
          onPlay={onPlay}
          onDownload={(url) => handleDownloadMp3(url, `${song.title} - ${t(activeVoice)}.${song.audioExt ?? 'mp3'}`)}
          onShare={onShare}
          onTelemetry={(action, type) => onTelemetry(action, song.title, type)}
          t={t}
        />
      </div>

      <div className="px-2 mt-4">
        {song.hasScore && (
          <button
            onClick={() => {
              onOpenPdf(song.id);
              onTelemetry("📂 Fișier Deschis", song.title, "PDF");
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--text)] text-[var(--bg)] hover:opacity-90 font-semibold rounded-full text-[14px] transition-opacity shadow-md"
          >
            <FileText size={16} />
            {t('viewScore')}
          </button>
        )}
      </div>
    </div>
  );
}
