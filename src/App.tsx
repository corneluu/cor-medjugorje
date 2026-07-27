import { useState, useRef, useEffect } from 'react';
import { Download, Share2, FileText, X, Moon, Sun, AlertCircle, ChevronUp, Headphones } from 'lucide-react';
import logo from './assets/logo.png';
import { useLang, type AppLang } from './i18n';
import { useDarkMode } from './useDarkMode';
import { songs, type LiturgicalPart } from './songs';
import { SongItem } from './components/SongItem';
import { assetUrl, sendDiscordTelemetry, isFuzzyMatch } from './utils';

// Liturgical parts in chronological order of the Catholic Mass
const liturgicalPartsOrder: LiturgicalPart[] = [
  'intrare',
  'kyrie',
  'gloria',
  'psalm',
  'alleluia',
  'ofertoru',
  'sanctus',
  'agnus-dei',
  'impartasanie',
  'incheiere'
];

export default function App() {
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useDarkMode();

  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [pdfModalId, setPdfModalId] = useState<string | null>(null);
  const [audioModalId, setAudioModalId] = useState<string | null>(null);

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isToastHiding, setIsToastHiding] = useState(false);
  const lastToastTime = useRef<number>(0);

  const handleTelemetry = (action: string, songName: string, typeStr: string) => {
    sendDiscordTelemetry(action, songName, typeStr);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const songParam = params.get('song');
    if (songParam) {
      setTimeout(() => {
        const el = document.getElementById(`song-${songParam}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedId(songParam);
          setTimeout(() => setHighlightedId(null), 4000);
        }
      }, 500);
    }

    if (!navigator.onLine) setShowNetworkModal(true);
    const onOffline = () => setShowNetworkModal(true);
    window.addEventListener('offline', onOffline);
    return () => window.removeEventListener('offline', onOffline);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (songId: string, voice?: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('song', songId);
    if (voice) url.searchParams.set('voice', voice);
    navigator.clipboard.writeText(url.toString());

    const now = Date.now();
    if (now - lastToastTime.current >= 2000) {
      lastToastTime.current = now;
      setShowToast(true);
      setIsToastHiding(false);

      setTimeout(() => {
        setIsToastHiding(true);
        setTimeout(() => {
          setShowToast(false);
          setIsToastHiding(false);
        }, 300);
      }, 2000);
    }
  };

  const getSongById = (id: string) => {
    return songs.find(s => s.id === id);
  };

  const handleDownloadPdf = async (songId: string) => {
    const songObj = getSongById(songId);
    if (songObj) handleTelemetry("📂 Descărcare Partitură", songObj.title, "PDF");
    const url = assetUrl(`pdfs/${songId}/partitura.pdf`);
    const filename = songObj ? `${songObj.title}.pdf` : `${songId}.pdf`;
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
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (pdfModalId || audioModalId) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPdfModalId(null);
        setAudioModalId(null);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [pdfModalId, audioModalId]);

  const filteredSongs = songs.filter(s =>
    !search.trim() || isFuzzyMatch(search, `${s.title} ${s.composer}`)
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans pb-20 transition-colors">
      <header className={`sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--track)] transition-all duration-500 shadow-sm ${
        isScrolled ? 'max-md:landscape:-translate-y-full' : ''
      }`}>
        <div className="max-w-[640px] mx-auto px-4 py-3 sm:py-5">
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
              <div>
                <h1 className="font-serif text-[18px] sm:text-xl font-bold text-[var(--text)] leading-none mb-0.5">
                  Cor Medjugorje
                </h1>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] font-semibold">
                  {t('portalSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors bg-[var(--track)] rounded-full"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} className="m-1" /> : <Moon size={16} className="m-1" />}
              </button>

              <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
                {(['ro', 'en', 'it'] as AppLang[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`uppercase transition-colors ${lang === l ? 'font-bold text-[var(--text)] border-b-2 border-[var(--text)] pb-0.5' : 'text-[var(--muted)] hover:text-[var(--text)] pb-[2px]'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Input */}
      <div className="max-w-[640px] mx-auto flex items-center mt-6 px-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full h-11 bg-[var(--card)] border border-[var(--track)] rounded-xl px-4 text-[15px] outline-none focus:border-[var(--accent)] text-[var(--text)] transition-all placeholder-[var(--muted)] shadow-sm"
        />
      </div>

      {/* Repertoire grouped by Mass structure */}
      <main className="max-w-[640px] mx-auto px-4 mt-6">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)]">
            {t('noResults')}
          </div>
        ) : (
          liturgicalPartsOrder.map(part => {
            const partSongs = filteredSongs.filter(s => s.category === part);
            if (partSongs.length === 0) return null;

            return (
              <section key={part} className="mb-6">
                <div className="flex flex-col">
                  {partSongs.map(song => (
                    <SongItem
                      key={song.id}
                      song={song}
                      playingId={playingId}
                      onPlay={setPlayingId}
                      lang={{ t }}
                      onOpenPdf={setPdfModalId}
                      onOpenAudio={setAudioModalId}
                      onShare={handleShare}
                      isHighlighted={highlightedId === song.id}
                      onTelemetry={handleTelemetry}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <footer className="mt-12 pb-10 text-center flex flex-col items-center gap-4">
        <a
          href="https://corneluu.github.io/corneluu/"
          rel="noopener noreferrer"
          className="inline-block text-[10px] text-[var(--muted)] hover:text-[var(--text)] uppercase tracking-[0.1em] transition-all opacity-60 hover:opacity-100 font-medium"
        >
          Built by Cornel
        </a>
      </footer>

      {/* PDF score modal viewer */}
      {pdfModalId && (() => {
        const song = getSongById(pdfModalId);
        const pdfSrc = assetUrl(`pdfs/${pdfModalId}/partitura.pdf`);
        return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-[var(--bg)] border-b border-[var(--track)] text-[var(--text)]">
              <h3 className="font-semibold text-[14px] sm:text-base truncate px-1 max-w-[50%]">
                {song?.title}
              </h3>
              <div className="flex items-center gap-1">
                <span className="hidden sm:inline text-[11px] text-[var(--muted)] mr-2 select-none">Ctrl + Scroll pentru zoom</span>
                <div className="w-px h-5 bg-[var(--track)] mx-1" />
                <button
                  onClick={() => { handleShare(pdfModalId); if (song) handleTelemetry("🔗 Distribuire", song.title, "Link Partitură"); }}
                  className="p-2 text-[var(--muted)] hover:bg-[var(--track)] rounded-full"
                  title={t('share')}
                ><Share2 size={18} /></button>
                <button
                  onClick={() => handleDownloadPdf(pdfModalId)}
                  className="p-2 text-[var(--muted)] hover:bg-[var(--track)] rounded-full"
                  title={t('download')}
                ><Download size={18} /></button>
                <div className="w-px h-5 bg-[var(--track)] mx-1" />
                <button onClick={() => setPdfModalId(null)} className="p-2 text-[var(--muted)] hover:text-red-500 hover:bg-[var(--track)] rounded-full"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-200 flex justify-center items-start">
              <object
                data={`${pdfSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className="border-none block bg-white"
                style={{ width: '100%', minHeight: '100vh', display: 'block' }}
              >
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4" style={{ minHeight: '60vh' }}>
                  <FileText size={48} className="text-[var(--muted)]" />
                  <p className="text-[var(--text)] font-semibold">Browserul tău nu poate afișa PDF-ul direct.</p>
                  <a
                    href={pdfSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--text)] text-[var(--bg)] font-semibold rounded-full text-[14px] shadow-md"
                  >
                    <Download size={16} />
                    Deschide / Descarcă PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        );
      })()}

      {/* Audio demo modal viewer */}
      {audioModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-0 sm:p-4">
          <div className="bg-[var(--bg)] sm:rounded-xl w-full sm:max-w-4xl h-full sm:h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-[var(--track)] text-[var(--text)]">
              <h3 className="font-semibold text-[15px] sm:text-base truncate px-1">
                {getSongById(audioModalId)?.title} - Demo
              </h3>
              <div className="flex items-center gap-1">
                <button onClick={() => setAudioModalId(null)} className="p-2 text-[var(--muted)] hover:text-red-500 hover:bg-[var(--track)] rounded-full"><X size={20} /></button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--track)] relative p-4">
                <Headphones size={64} className="text-[var(--muted)] mb-8 opacity-50" />
                <audio
                  controls
                  src={assetUrl(getSongById(audioModalId)?.audioUrl || '')}
                  autoPlay
                  className="w-full max-w-md shadow-lg rounded-full"
                />
            </div>
            <div className="flex p-4 bg-[var(--bg)] border-t border-[var(--track)] justify-center gap-3">
              <button
                onClick={async () => {
                  const s = getSongById(audioModalId);
                  if (s && s.audioUrl) {
                    const url = assetUrl(s.audioUrl);
                    const filename = `${s.title} - Demo.${s.audioUrl.split('.').pop() || 'mpeg'}`;
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
                      window.open(url, '_blank');
                    }
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--text)] text-[var(--bg)] hover:opacity-90 font-semibold rounded-full text-[14px] transition-all shadow-md"
              >
                <Download size={16} />
                {t('download')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to top floating button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-[var(--text)] text-[var(--bg)] p-3.5 rounded-full shadow-lg hover:scale-110 transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        title={t('backToTop')}
        aria-label={t('backToTop')}
      >
        <ChevronUp size={24} />
      </button>

      {/* Offline notification modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowNetworkModal(false)}>
          <div className="bg-[var(--bg)] border border-[var(--track)] rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowNetworkModal(false)} className="absolute top-4 right-4 p-2 text-[var(--muted)] hover:text-[var(--text)] rounded-full hover:bg-[var(--track)] transition-colors">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50 dark:ring-red-900/10">
                <AlertCircle size={32} className="text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-[19px] font-bold text-[var(--text)] mb-3 leading-tight">{t('offlineTitle')}</h3>
              <p className="text-[14px] text-[var(--muted)] mb-6 leading-relaxed">
                {t('offlineDesc')}
              </p>
              <button
                onClick={() => setShowNetworkModal(false)}
                className="w-full py-3 rounded-xl bg-[var(--text)] hover:opacity-90 text-[var(--bg)] font-bold text-[15px] transition-all shadow-md active:scale-[0.98]"
              >
                {t('offlineConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showToast && (
        <div className="toast-container">
          <div className={`toast ${isToastHiding ? 'hiding' : ''}`}>
            <AlertCircle size={16} className="text-[var(--accent)]" />
            {t('copied')}
          </div>
        </div>
      )}
    </div>
  );
}
