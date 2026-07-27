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

export const songs: Song[] = [
  {
    id: 'intrare-1',
    title: 'Spre Tine, Doamne',
    composer: 'Tradițional',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'intrare',
    youtubeUrl: 'https://www.youtube.com/watch?v=OkA0jqfPGsI'
  },
  {
    id: 'kyrie-1',
    title: 'Kyrie Eleison',
    composer: 'Marco Frisina',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'kyrie',
    youtubeUrl: 'https://www.youtube.com/watch?v=mQ1myt4-gX4'
  },
  {
    id: 'gloria-1',
    title: 'Mărire în cer lui Dumnezeu',
    composer: 'I. Călin',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'gloria'
  },
  {
    id: 'psalm-1',
    title: 'Domnul este păstorul meu (Psalmul 22)',
    composer: 'Tradițional',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'psalm'
  },
  {
    id: 'alleluia-1',
    title: 'Alleluia (Cântarea Învierii)',
    composer: 'Tradițional',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'alleluia'
  },
  {
    id: 'ofertoru-1',
    title: 'Primiți, o, Părinte',
    composer: 'Tradițional',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'ofertoru'
  },
  {
    id: 'sanctus-1',
    title: 'Sanctus (Sfânt, Sfânt)',
    composer: 'Marco Frisina',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'sanctus'
  },
  {
    id: 'agnus-1',
    title: 'Agnus Dei (Mielul lui Dumnezeu)',
    composer: 'Marco Frisina',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'agnus-dei'
  },
  {
    id: 'impartasanie-1',
    title: 'Anima Christi (Sufletul lui Cristos)',
    composer: 'Marco Frisina',
    lang: 'LA',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'impartasanie',
    youtubeUrl: 'https://www.youtube.com/watch?v=mQ1myt4-gX4'
  },
  {
    id: 'incheiere-1',
    title: 'Gospa, Maica Noastră',
    composer: 'Medjugorje Hymn',
    lang: 'RO',
    voices: ['sopran', 'alto', 'tenor', 'bas'],
    hasScore: true,
    category: 'incheiere',
    youtubeUrl: 'https://www.youtube.com/watch?v=usp_BvxPslk'
  }
];
