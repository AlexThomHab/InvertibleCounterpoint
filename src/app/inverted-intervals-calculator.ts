import { Interval } from './models/Interval';
import { InvertedIntervals } from './models/InvertedIntervals';

export class InvertedIntervalsCalculator {
  private intervals: Interval[] = [
    { index: 0, name: 'Unison',  isConsonant: true  },
    { index: 1, name: 'Second',  isConsonant: false },
    { index: 2, name: 'Third',   isConsonant: true  },
    { index: 3, name: 'Fourth',  isConsonant: false },
    { index: 4, name: 'Fifth',   isConsonant: true  },
    { index: 5, name: 'Sixth',   isConsonant: true  },
    { index: 6, name: 'Seventh', isConsonant: false },
    { index: 7, name: 'Octave',  isConsonant: true  },
  ];

  calculate(jvIndex: number): InvertedIntervals {
    const max = this.intervals.length; // 8
    const norm = ((jvIndex % max) + max) % max;

    const result: InvertedIntervals = {
      fixedConsonances: [],
      fixedDissonances: [],
      variableConsonances: [],
      variableDissonance: [],
    };

    for (let i = 0; i < max; i++) {
      const a = this.intervals[i].isConsonant;
      const target = (i + norm) % max;
      const b = this.intervals[target].isConsonant;

      if (a && b) result.fixedConsonances.push(i);
      else if (!a && !b) result.fixedDissonances.push(i);
      else if (a && !b) result.variableConsonances.push(i);
      else result.variableDissonance.push(i);
    }

    return result;
  }

  getIntervalName(index: number): string {
    return this.intervals[index]?.name ?? String(index);
  }
}
