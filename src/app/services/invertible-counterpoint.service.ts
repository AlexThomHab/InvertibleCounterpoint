import { Injectable } from '@angular/core';
import { Interval } from '../models/Interval';
import { InvertedIntervals } from '../models/InvertedIntervals';

export interface InversionResult {
  fixedConsonances: number[];
  variableConsonances: number[];
  fixedDissonances: number[];
  variableDissonances: number[];
}

@Injectable({ providedIn: 'root' })
export class InvertibleCounterpointService {
  compute(inversion: number, intervals: Interval[], mod = 12): InversionResult {
    const res: InversionResult = {
      fixedConsonances: [],
      variableConsonances: [],
      fixedDissonances: [],
      variableDissonances: [],
    };

    for (let i = 0; i < mod; i++) {
      const a = intervals[i].isConsonant;
      const target = (i + inversion) % mod;
      const b = intervals[target].isConsonant;

      if (a && b) res.fixedConsonances.push(i);
      else if (!a && !b) res.fixedDissonances.push(i);
      else if (a && !b) res.variableConsonances.push(i);
      else res.variableDissonances.push(i);
    }
    return res;
  }
}
