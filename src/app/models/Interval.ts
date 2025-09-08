import {SuspensionTreatmentEnum} from './SuspensionTreatmentEnum';

export interface Interval {
  semitones: number;
  name: string;
  isConsonant: boolean;
}

export interface IntervalWithSuspensions extends Interval {
  index: number;
  upperSuspensionTreatment: SuspensionTreatmentEnum;
  lowerSuspensionTreatment: SuspensionTreatmentEnum;
}
