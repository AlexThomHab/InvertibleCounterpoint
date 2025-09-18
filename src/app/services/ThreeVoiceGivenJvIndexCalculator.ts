import { InvertibleCounterpointService } from "./invertible-counterpoint.service";
import { InvertedIntervals, InvertedIntervalsDetailed } from "../models/InvertedIntervals";

export class ThreeVoiceGivenJvIndexValuesCalculator {
  constructor(
    private readonly twoVoiceCalc = new InvertibleCounterpointService()
  ) {}

  calculate(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervals[] {
    const firstAndSecondVoice = this.twoVoiceCalc.compute(jvPrime);
    const secondAndThirdVoice = this.twoVoiceCalc.compute(jvDoublePrime);
    const firstAndThirdVoice = this.twoVoiceCalc.compute(jvSigma);
    return [firstAndSecondVoice, secondAndThirdVoice, firstAndThirdVoice];
  }

  calculateDetailed(jvPrime: number, jvDoublePrime: number, jvSigma: number): InvertedIntervalsDetailed[] {
    const firstAndSecondVoice = this.twoVoiceCalc.computeDetailed(jvPrime);
    const secondAndThirdVoice = this.twoVoiceCalc.computeDetailed(jvDoublePrime);
    const firstAndThirdVoice = this.twoVoiceCalc.computeDetailed(jvSigma);
    return [firstAndSecondVoice, secondAndThirdVoice, firstAndThirdVoice];
  }
}
