// three-voice-given-jv-index-values-calculator.ts
import { InvertibleCounterpointService } from "./invertible-counterpoint.service";

export interface InvertedIntervals {
  fixedConsonances: number[];
  fixedDissonances: number[];
  variableConsonances: number[];
  variableDissonances: number[];
}

enum IntervalInStrictOrder {
  // softest → strictest (numeric value encodes strictness)
  FixedConsonance = 0,
  VariableConsonance = 1,
  VariableDissonance = 2,
  FixedDissonance = 3,
}

export class ThreeVoiceGivenJvIndexValuesCalculator {
  constructor(
    private readonly twoVoiceCalc = new InvertibleCounterpointService()
  ) {}

  /** Calculate combined 3-voice rules from the three pairwise JVs. */
  calculate(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervals {
    // Reuse your existing 2-voice logic for each pair
    const v12 = this.twoVoiceCalc.compute(jvPrime);
    const v23 = this.twoVoiceCalc.compute(jvDoublePrime);
    const v13 = this.twoVoiceCalc.compute(jvSigma);

    return this.combineThreeSets(v12, v23, v13);
  }

  /** Strict-most combiner: FD > VD > VC > FC per interval 0..7 */
  private combineThreeSets(a: InvertedIntervals, b: InvertedIntervals, c: InvertedIntervals): InvertedIntervals {
    // Gather + de-dupe numbers per category from all three pairs
    const gather = (sel: (x: InvertedIntervals) => number[]) =>
      new Set<number>([...sel(a), ...sel(b), ...sel(c)]);

    const byCat = new Map<IntervalInStrictOrder, Set<number>>([
      [IntervalInStrictOrder.FixedConsonance,    gather(x => x.fixedConsonances)],
      [IntervalInStrictOrder.VariableConsonance, gather(x => x.variableConsonances)],
      [IntervalInStrictOrder.VariableDissonance, gather(x => x.variableDissonances)],
      [IntervalInStrictOrder.FixedDissonance,    gather(x => x.fixedDissonances)],
    ]);

    // Output buckets (as sets, then sort at the end)
    const out = new Map<IntervalInStrictOrder, Set<number>>([
      [IntervalInStrictOrder.FixedConsonance,    new Set<number>()],
      [IntervalInStrictOrder.VariableConsonance, new Set<number>()],
      [IntervalInStrictOrder.VariableDissonance, new Set<number>()],
      [IntervalInStrictOrder.FixedDissonance,    new Set<number>()],
    ]);

    // For each interval number 0..7, pick strict-most present among categories
    for (let i = 0; i <= 7; i++) {
      const candidates: IntervalInStrictOrder[] = [];
      for (const [cat, set] of byCat) {
        if (set.has(i)) candidates.push(cat);
      }
      if (candidates.length === 0) continue;

      // Max by enum value → strict-most (FD > VD > VC > FC)
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
}
