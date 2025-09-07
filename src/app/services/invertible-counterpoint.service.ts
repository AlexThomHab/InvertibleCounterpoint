import {Injectable} from '@angular/core';
import {Interval} from '../models/Interval';
import {InvertedIntervals} from '../models/InvertedIntervals';

@Injectable({ providedIn: 'root' })
export class InvertibleCounterpointService {
  private readonly _intervals : Record<number, Interval> = {
    0: { semitones: 0, name: 'Unison',  isConsonant: true  },
    1: { semitones: 1, name: 'Second',  isConsonant: false },
    2: { semitones: 2, name: 'Third',   isConsonant: true  },
    3: { semitones: 3, name: 'Fourth',  isConsonant: false },
    4: { semitones: 4, name: 'Fifth',   isConsonant: true  },
    5: { semitones: 5, name: 'Sixth',   isConsonant: true  },
    6: { semitones: 6, name: 'Seventh', isConsonant: false },
    7: { semitones: 7, name: 'Octave',  isConsonant: true  },
  };
  public compute(jvIndex: number): InvertedIntervals {
    const invertedIntervals: InvertedIntervals = {
      fixedConsonances: [],
      fixedDissonances: [],
      variableConsonances: [],
      variableDissonances: []
    };

    for (let i = 0; i <= 7; i++) {
      const targetIndex = Math.abs((i + jvIndex) % 7);

      if (this._intervals[i].isConsonant && this._intervals[targetIndex].isConsonant) {
        invertedIntervals.fixedConsonances.push(i);
        continue;
      }

      if (!this._intervals[i].isConsonant && !this._intervals[targetIndex].isConsonant) {
        invertedIntervals.fixedDissonances.push(i);
        continue;
      }

      if (this._intervals[i].isConsonant && !this._intervals[targetIndex].isConsonant) {
        invertedIntervals.variableConsonances.push(i);
        continue;
      }

      if (!this._intervals[i].isConsonant && this._intervals[targetIndex].isConsonant) {
        invertedIntervals.variableDissonances.push(i);
      }
    }
    return invertedIntervals;
  }
}
