import {IntervalWithSuspensions} from './Interval';

export interface InvertedIntervals {
  fixedConsonances: number[];
  fixedDissonances: number[];
  variableConsonances: number[];
  variableDissonances: number[];
}
export interface InvertedIntervalsDetailed {
  fixedConsonances: IntervalWithSuspensions[];
  fixedDissonances: IntervalWithSuspensions[];
  variableConsonances: IntervalWithSuspensions[];
  variableDissonances: IntervalWithSuspensions[];
}
