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
    youtubeUrl: 'https://youtu.be/sjkaWdBh3UM?is=7xyglKbjvFV4F7KE',
  },

  // ─── KYRIE ────────────────────────────────────────────────────────────────
  {
    id: 'kyrie-1',
    title: 'Kyrie',
    composer: 'Iustin Călin',
    lang: 'LA',
    voices: [],
    hasScore: true,
    category: 'kyrie',
    youtubeUrl: 'https://youtu.be/3FuHd53xaSI?is=4Ufx6pgqrnYTeaPC',
  },

  // ─── GLORIA ───────────────────────────────────────────────────────────────
  {
    id: 'gloria-1',
    title: 'Gloria (INCTC 2026)',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: [],
    hasScore: true,
    category: 'gloria',
    youtubeUrl: 'https://youtube.com/shorts/VC0a96gz0fw?is=ILFvPvhL7FRo10R6',
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
    youtubeUrl: 'https://youtu.be/4mOCxM-HM4c?is=JrWoaUVoO2x_2Yd2',
  },

  // ─── ALLELUIA ─────────────────────────────────────────────────────────────
  {
    id: 'alleluia-1',
    title: 'Halelluya',
    composer: 'Zlatko Špoljarević (arr.)',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'alleluia',
    youtubeUrl: 'https://youtu.be/85WEIeNITtc?feature=shared',
  },

  // ─── OFERTORU ─────────────────────────────────────────────────────────────
  {
    id: 'ofertoru-1',
    title: 'Cristos e lumina (INCTC 2026)',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'ofertoru',
    youtubeUrl: 'https://youtu.be/ZFDRm1fAj14?is=27a0Bp-Gf4-81hD7',
  },

  // ─── SANCTUS ──────────────────────────────────────────────────────────────
  {
    id: 'sanctus-1',
    title: 'Sanctus',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: [],
    hasScore: true,
    category: 'sanctus',
    youtubeUrl: 'https://youtu.be/x8ZcGNHU4dU?is=TxYWr5eK6szGIuPs',
  },

  // ─── AGNUS DEI ────────────────────────────────────────────────────────────
  {
    id: 'agnus-1',
    title: 'Agnus dei',
    composer: 'Tradițional',
    lang: 'LA',
    voices: [],
    hasScore: true,
    category: 'agnus-dei',
    youtubeUrl: 'https://youtu.be/myxplSQOubQ?is=XmaHQ78PU9HOpzTW',
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
    youtubeUrl: 'https://youtu.be/etzkAcqpvZY?is=FPdJyX_G4tyoKKeH',
  },
  {
    id: 'impartasanie-2',
    title: 'Jesus Christ, you are my life',
    composer: 'Marco Frisina',
    lang: 'EN',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'impartasanie',
    youtubeUrl: 'https://youtu.be/Cri2XbOhNTQ?is=A_VzyFGB94UnE4NG',
  },
  {
    id: 'impartasanie-3',
    title: 'Dăruiește pacea',
    composer: 'Iustin Călin',
    lang: 'RO',
    voices: [],
    hasScore: false, // Fișierele nu sunt disponibile — adaugă manual
    category: 'impartasanie',
    youtubeUrl: 'https://youtu.be/4QNsuFThEQ8?is=a40H0rJ21lRq_siH',
  },

  // ─── INCHEIERE ────────────────────────────────────────────────────────────
  {
    id: 'incheiere-1',
    title: 'Maria, Tu ești a lumii mamă',
    composer: 'Tradițional / Iustin Călin',
    lang: 'RO',
    voices: [],
    hasScore: true,
    category: 'incheiere',
    youtubeUrl: 'https://youtu.be/tEpw_TfNwl8?is=UONqzrxL628jELl3',
  },
];
