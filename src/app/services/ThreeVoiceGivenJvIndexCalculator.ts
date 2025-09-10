// three-voice-given-jv-index-values-calculator.ts
import { InvertibleCounterpointService } from "./invertible-counterpoint.service";
// ⬇️ add these two imports (adjust paths if needed)
import { InvertedIntervalsDetailed } from "../models/InvertedIntervals";
import {IntervalWithSuspensions} from '../models/Interval';
import { SuspensionTreatmentEnum } from "../models/SuspensionTreatmentEnum";

export interface InvertedIntervals {
  fixedConsonances: number[];
  fixedDissonances: number[];
  variableConsonances: number[];
  variableDissonances: number[];
}

enum IntervalInStrictOrder {
  FixedConsonance = 0,
  VariableConsonance = 1,
  VariableDissonance = 2,
  FixedDissonance = 3,
}

export type ThreeVoiceSuspensions = {
  upper: Record<number, SuspensionTreatmentEnum>;
  lower: Record<number, SuspensionTreatmentEnum>;
};

export class ThreeVoiceGivenJvIndexValuesCalculator {
  constructor(
    private readonly twoVoiceCalc = new InvertibleCounterpointService()
  ) {}

  /** Your existing API: interval-type only */
  calculate(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervals {
    const v12 = this.twoVoiceCalc.compute(jvPrime);
    const v23 = this.twoVoiceCalc.compute(jvDoublePrime);
    const v13 = this.twoVoiceCalc.compute(jvSigma);
    return this.combineThreeSets(v12, v23, v13);
  }

  /** NEW: strict-most 3-voice suspensions (upper/lower) per interval 0..7 */
  calculateSuspensions(jvPrime: number, jvDoublePrime: number, jvSigma: number): ThreeVoiceSuspensions {
    const v12: InvertedIntervalsDetailed = this.twoVoiceCalc.computeDetailed(jvPrime);
    const v23: InvertedIntervalsDetailed = this.twoVoiceCalc.computeDetailed(jvDoublePrime);
    const v13: InvertedIntervalsDetailed = this.twoVoiceCalc.computeDetailed(jvSigma);

    const gatherAllFor = (n: number, src: InvertedIntervalsDetailed): IntervalWithSuspensions[] => {
      const { fixedConsonances, fixedDissonances, variableConsonances, variableDissonances } = src;
      return [
        ...fixedConsonances,
        ...fixedDissonances,
        ...variableConsonances,
        ...variableDissonances,
      ].filter(iv => iv.index === n);
    };

    const upper: Record<number, SuspensionTreatmentEnum> = {};
    const lower: Record<number, SuspensionTreatmentEnum> = {};

    for (let n = 0; n <= 7; n++) {
      const all = [
        ...gatherAllFor(n, v12),
        ...gatherAllFor(n, v23),
        ...gatherAllFor(n, v13),
      ];
      const uppers = all.map(iv => iv.upperSuspensionTreatment);
      const lowers = all.map(iv => iv.lowerSuspensionTreatment);

      upper[n] = uppers.length
        ? this.strictMost(...uppers)
        : SuspensionTreatmentEnum.NoteOfResolutionIsFree;

      lower[n] = lowers.length
        ? this.strictMost(...lowers)
        : SuspensionTreatmentEnum.NoteOfResolutionIsFree;
    }

    return { upper, lower };
  }

  /** Strict-most combiner for interval types (unchanged) */
  private combineThreeSets(a: InvertedIntervals, b: InvertedIntervals, c: InvertedIntervals): InvertedIntervals {
    const gather = (sel: (x: InvertedIntervals) => number[]) =>
      new Set<number>([...sel(a), ...sel(b), ...sel(c)]);

    const byCat = new Map<IntervalInStrictOrder, Set<number>>([
      [IntervalInStrictOrder.FixedConsonance,    gather(x => x.fixedConsonances)],
      [IntervalInStrictOrder.VariableConsonance, gather(x => x.variableConsonances)],
      [IntervalInStrictOrder.VariableDissonance, gather(x => x.variableDissonances)],
      [IntervalInStrictOrder.FixedDissonance,    gather(x => x.fixedDissonances)],
    ]);

    const out = new Map<IntervalInStrictOrder, Set<number>>([
      [IntervalInStrictOrder.FixedConsonance,    new Set<number>()],
      [IntervalInStrictOrder.VariableConsonance, new Set<number>()],
      [IntervalInStrictOrder.VariableDissonance, new Set<number>()],
      [IntervalInStrictOrder.FixedDissonance,    new Set<number>()],
    ]);

    for (let i = 0; i <= 7; i++) {
      const candidates: IntervalInStrictOrder[] = [];
      for (const [cat, set] of byCat) {
        if (set.has(i)) candidates.push(cat);
      }
      if (!candidates.length) continue;
      const strictMost = candidates.reduce((m, x) => (x > m ? x : m), candidates[0]);
      out.get(strictMost)!.add(i);
    }

    const toSortedArray = (s: Set<number>) => Array.from(s).sort((x, y) => x - y);

    return {
      fixedConsonances:    toSortedArray(out.get(IntervalInStrictOrder.FixedConsonance)!),
      variableConsonances: toSortedArray(out.get(IntervalInStrictOrder.VariableConsonance)!),
      variableDissonances: toSortedArray(out.get(IntervalInStrictOrder.VariableDissonance)!),
      fixedDissonances:    toSortedArray(out.get(IntervalInStrictOrder.FixedDissonance)!),
    };
  }

  // --- exact TS port of your C# SuspensionService.StrictMost ---
  private strictMost(...values: SuspensionTreatmentEnum[]): SuspensionTreatmentEnum {
    if (!values.length) return SuspensionTreatmentEnum.NoteOfResolutionIsFree;

    const CANNOT = SuspensionTreatmentEnum.CannotFormSuspension;
    const MUST   = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension;
    const X      = SuspensionTreatmentEnum.NoteOfResolutionIsDissonant;
    const BOTH   = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant;

    return values.reduce((acc, v) => {
      if (acc === v) return acc;
      if (acc === CANNOT || v === CANNOT) return CANNOT;
      if (acc === BOTH || v === BOTH) return BOTH;

      const hasMust = acc === MUST || v === MUST;
      const hasX    = acc === X    || v === X;
      if (hasMust && hasX) return BOTH;

      return (this.rank(acc) <= this.rank(v)) ? acc : v;
    }, SuspensionTreatmentEnum.NoteOfResolutionIsFree);
  }

  private rank(x: SuspensionTreatmentEnum): number {
    switch (x) {
      case SuspensionTreatmentEnum.CannotFormSuspension: return 0;
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant: return 1;
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension: return 2;
      case SuspensionTreatmentEnum.NoteOfResolutionIsDissonant: return 3;
      case SuspensionTreatmentEnum.NoteOfResolutionIsFree: return 4;
      default: return 4;
    }
  }
}
