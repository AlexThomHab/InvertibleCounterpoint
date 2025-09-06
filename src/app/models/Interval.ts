export interface Interval {
  semitones: number;
  name: string;
  isConsonant: boolean;
}

export const DEFAULT_INTERVALS: Interval[] = [
  { semitones: 0,  name: 'Unison',        isConsonant: true  },
  { semitones: 1,  name: 'Minor 2nd',     isConsonant: false },
  { semitones: 2,  name: 'Major 2nd',     isConsonant: false },
  { semitones: 3,  name: 'Minor 3rd',     isConsonant: true  },
  { semitones: 4,  name: 'Major 3rd',     isConsonant: true  },
  { semitones: 5,  name: 'Perfect 4th',   isConsonant: false },
  { semitones: 6,  name: 'Tritone',       isConsonant: false },
  { semitones: 7,  name: 'Perfect 5th',   isConsonant: true  },
  { semitones: 8,  name: 'Minor 6th',     isConsonant: true  },
  { semitones: 9,  name: 'Major 6th',     isConsonant: true  },
  { semitones: 10, name: 'Minor 7th',     isConsonant: false },
  { semitones: 11, name: 'Major 7th',     isConsonant: false },
];
