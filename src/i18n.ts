import { useState, useCallback, useEffect } from 'react';

export const i18n = {
  ro: {
    portalSubtitle: "CORUL ROMÂN · MEDJUGORJE",
    searchPlaceholder: "Caută cântec...",
    sopran: "Sopran",
    alto: "Alto",
    tenor: "Tenor",
    bas: "Bas",
    viewScore: "Vezi Partitură",
    showMore: "Arată toate vocile...",
    showLess: "Ascunde vocile",
    copied: "Link copiat!",
    useZoomButtons: "Folosește butoanele zoom",
    zoomIn: "Mărire",
    zoomOut: "Micșorare",
    download: "Descarcă",
    share: "Distribuie",
    close: "Închide",
    noResults: "Niciun cântec găsit.",
    backToTop: "Înapoi sus",
    offlineTitle: "Nu ești conectat!",
    offlineDesc: "Aplicația necesită internet sau date mobile pentru a încărca resursele.",
    offlineConfirm: "Am înțeles",
    youtube: "YouTube",
    all: "Toate",
    lastUpdate: "Revizuit pe",
    viewChanges: "vezi modificările",
    historyTitle: "Istoric modificări",
    historyDesc: "Aici găsești toate fișierele actualizate recent. Click pe orice fișier pentru a-l deschide.",
    file: "Fișier",
    date: "Data modificării",
    change: "Ce s-a schimbat",
    
    // Liturgical Parts
    intrare: "Cântec de Intrare",
    kyrie: "Kyrie miluiește",
    gloria: "Gloria (Mărire)",
    psalm: "Psalmul Responsorial",
    alleluia: "Alleluia",
    ofertoru: "Ofertorul (Pregătirea darurilor)",
    sanctus: "Sfânt (Sanctus)",
    "agnus-dei": "Mielul lui Dumnezeu (Agnus Dei)",
    impartasanie: "Împărtășanie",
    incheiere: "Cântec de Încheiere"
  },
  en: {
    portalSubtitle: "ROMANIAN CHOIR · MEDJUGORJE",
    searchPlaceholder: "Search song...",
    sopran: "Soprano",
    alto: "Alto",
    tenor: "Tenor",
    bas: "Bass",
    viewScore: "View Score",
    showMore: "Show all voices...",
    showLess: "Hide voices",
    copied: "Link copied!",
    useZoomButtons: "Use zoom buttons",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    download: "Download",
    share: "Share",
    close: "Close",
    noResults: "No songs found.",
    backToTop: "Back to top",
    offlineTitle: "You are offline!",
    offlineDesc: "The app requires internet or mobile data to load resources.",
    offlineConfirm: "Got it",
    youtube: "YouTube",
    all: "All",
    lastUpdate: "Revised on",
    viewChanges: "view changes",
    historyTitle: "Change History",
    historyDesc: "Here you can find all recently updated files. Click on any file to open it.",
    file: "File",
    date: "Modification Date",
    change: "What changed",

    // Liturgical Parts
    intrare: "Entrance Song",
    kyrie: "Kyrie Eleison",
    gloria: "Gloria in Excelsis",
    psalm: "Responsorial Psalm",
    alleluia: "Alleluia",
    ofertoru: "Offertory Song",
    sanctus: "Sanctus (Holy)",
    "agnus-dei": "Agnus Dei (Lamb of God)",
    impartasanie: "Communion",
    incheiere: "Recessional Song"
  },
  it: {
    portalSubtitle: "CORO ROMENO · MEDJUGORJE",
    searchPlaceholder: "Cerca brano...",
    sopran: "Soprano",
    alto: "Contralto",
    tenor: "Tenore",
    bas: "Basso",
    viewScore: "Vedi Spartito",
    showMore: "Mostra tutte le voci...",
    showLess: "Nascondi",
    copied: "Link copiato!",
    useZoomButtons: "Usa i pulsanti zoom",
    zoomIn: "Ingrandisci",
    zoomOut: "Riduci",
    download: "Scarica",
    share: "Condividi",
    close: "Chiudi",
    noResults: "Nessun brano trovato.",
    backToTop: "Torna su",
    offlineTitle: "Sei offline!",
    offlineDesc: "L'app richiede internet o dati mobili per caricare le risorse.",
    offlineConfirm: "Ho capito",
    youtube: "YouTube",
    all: "Tutti",
    lastUpdate: "Revisionato il",
    viewChanges: "vedi modifiche",
    historyTitle: "Cronologia modifiche",
    historyDesc: "Qui puoi trovare tutti i file aggiornati di recente. Clicca su qualsiasi file per aprirlo.",
    file: "File",
    date: "Data modifica",
    change: "Cosa è cambiato",

    // Liturgical Parts
    intrare: "Canto d'Ingresso",
    kyrie: "Kyrie Eleison",
    gloria: "Gloria in Excelsis Deo",
    psalm: "Salmo Responsoriale",
    alleluia: "Alleluia",
    ofertoru: "Canto d'Offertorio",
    sanctus: "Sanctus (Santo)",
    "agnus-dei": "Agnus Dei",
    impartasanie: "Comunione",
    incheiere: "Canto di Congedo"
  }
} as const;

export type AppLang = keyof typeof i18n;
export type TKey = keyof typeof i18n['ro'];

export function useLang() {
  const [lang, setLangState] = useState<AppLang>(() => {
    const saved = localStorage.getItem('hc-lang') as AppLang;
    return (saved && i18n[saved]) ? saved : 'ro';
  });

  const setLang = useCallback((l: AppLang) => {
    localStorage.setItem('hc-lang', l);
    setLangState(l);
  }, []);

  const t = useCallback((key: TKey) => {
    return i18n[lang][key] || key;
  }, [lang]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hc-lang' && e.newValue && i18n[e.newValue as AppLang]) {
        setLangState(e.newValue as AppLang);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { lang, setLang, t };
}
