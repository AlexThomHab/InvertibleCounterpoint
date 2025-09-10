// src/app/services/ThreeVoiceGivenJvIndexCalculator.ts
import { InvertibleCounterpointService } from "./invertible-counterpoint.service";
import { InvertedIntervals, InvertedIntervalsDetailed } from "../models/InvertedIntervals";

export class ThreeVoiceGivenJvIndexValuesCalculator {
  constructor(
    private readonly twoVoiceCalc = new InvertibleCounterpointService()
  ) {}

  calculate(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervals[] {
    const v12 = this.twoVoiceCalc.compute(jvPrime);
    const v23 = this.twoVoiceCalc.compute(jvDoublePrime);
    const v13 = this.twoVoiceCalc.compute(jvSigma);
    return [v12, v23, v13];
  }

  calculateDetailed(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervalsDetailed[] {
    const v12 = this.twoVoiceCalc.computeDetailed(jvPrime);
    const v23 = this.twoVoiceCalc.computeDetailed(jvDoublePrime);
    const v13 = this.twoVoiceCalc.computeDetailed(jvSigma);
    return [v12, v23, v13];
  }
}
