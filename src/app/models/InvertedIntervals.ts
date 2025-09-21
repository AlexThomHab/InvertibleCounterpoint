import {Interval} from './Interval';

export interface InvertedIntervals {
  fixedConsonances: number[];
  fixedDissonances: number[];
  variableConsonances: number[];
  variableDissonances: number[];
}
export interface InvertedIntervalsDetailed {
  fixedConsonances: Interval[];
  fixedDissonances: Interval[];
  variableConsonances: Interval[];
  variableDissonances: Interval[];
}
