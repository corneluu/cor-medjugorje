export type Lang = 'RO' | 'EN' | 'IT' | 'LA';
export type Voice = 'sopran' | 'alto' | 'tenor' | 'bas';

export type LiturgicalPart =
  | 'intrare'
  | 'kyrie'
  | 'gloria'
  | 'psalm'
  | 'alleluia'
  | 'ofertoru'
  | 'sanctus'
  | 'agnus-dei'
  | 'impartasanie'
  | 'incheiere';

export interface Song {
  id: string;
  title: string;
  composer: string;
  lang: Lang;
  voices: Voice[];
  hasScore: boolean;
  category: LiturgicalPart;
  audioExt?: string; // optional, defaults to 'mp3'
  youtubeUrl?: string;
  audioUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// LITURGHIA COR MEDJUGORJE — REPERTORIU COMPLET
// ─────────────────────────────────────────────────────────────────────────────
export const songs: Song[] = [

  // ─── INTRARE ──────────────────────────────────────────────────────────────
  {
    id: 'intrare-1',
    title: 'Ne-aduni pe toți cu iubire',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'intrare',
  },

  // ─── KYRIE ────────────────────────────────────────────────────────────────
  {
    id: 'kyrie-1',
    title: 'Kyrie eleison (scurt, Re major)',
    composer: 'Iustin Călin',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'kyrie',
  },

  // ─── GLORIA ───────────────────────────────────────────────────────────────
  {
    id: 'gloria-1',
    title: 'Gloria (Mărire)',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'gloria',
  },

  // ─── PSALM ────────────────────────────────────────────────────────────────
  {
    id: 'psalm-1',
    title: 'În veci voi cânta a ta milostivire',
    composer: 'Tradițional',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'psalm',
  },

  // ─── ALLELUIA ─────────────────────────────────────────────────────────────
  {
    id: 'alleluia-1',
    title: 'Alleluia (Sol major)',
    composer: 'Iustin Călin',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: false, // PDF not yet available — add when ready
    category: 'alleluia',
  },

  // ─── OFERTORU ─────────────────────────────────────────────────────────────
  {
    id: 'ofertoru-1',
    title: 'Cristos e lumina',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'ofertoru',
  },

  // ─── SANCTUS ──────────────────────────────────────────────────────────────
  {
    id: 'sanctus-1',
    title: 'Sfânt (Sanctus)',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'sanctus',
  },

  // ─── AGNUS DEI ────────────────────────────────────────────────────────────
  {
    id: 'agnus-1',
    title: 'Agnus Dei (clasic)',
    composer: 'Tradițional',
    lang: 'LA',
    voices: [],
    hasScore: false, // Fișierele nu sunt disponibile local — adaugă manual
    category: 'agnus-dei',
  },

  // ─── IMPARTASANIE ─────────────────────────────────────────────────────────
  {
    id: 'impartasanie-1',
    title: 'Toți suntem una',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'impartasanie',
  },
  {
    id: 'impartasanie-2',
    title: 'Jesus Christ, You Are My Life',
    composer: 'Marco Frisina',
    lang: 'EN',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'impartasanie',
    youtubeUrl: 'https://www.youtube.com/watch?v=VGpnbfYayHI',
  },
  {
    id: 'impartasanie-3',
    title: 'Dăruiește pacea',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: [],
    hasScore: false, // Fișierele nu sunt disponibile — adaugă manual
    category: 'impartasanie',
  },

  // ─── INCHEIERE ────────────────────────────────────────────────────────────
  {
    id: 'incheiere-1',
    title: 'Maria, Tu ești a lumii mamă',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'incheiere',
  },
];
