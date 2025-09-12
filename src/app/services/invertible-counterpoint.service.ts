import { Injectable } from '@angular/core';
import { IntervalWithSuspensions } from '../models/Interval';
import { InvertedIntervals, InvertedIntervalsDetailed } from '../models/InvertedIntervals';
import { SuspensionTreatmentEnum } from '../models/SuspensionTreatmentEnum';

@Injectable({ providedIn: 'root' })
export class InvertibleCounterpointService {
  private static readonly N = 8;
  private static readonly PERFECT = new Set([0, 4, 7]);
  private static readonly IMPERFECT = new Set([2, 5]);
  private static copyInterval(i: IntervalWithSuspensions): IntervalWithSuspensions {
    return {
      index: i.index,
      semitones: i.semitones,
      name: i.name,
      isConsonant: i.isConsonant,
      upperSuspensionTreatment: i.upperSuspensionTreatment,
      lowerSuspensionTreatment: i.lowerSuspensionTreatment,
    };
  }

  private static strictMostSuspensionTreatmentEnum(
    originalIntervalSuspension: SuspensionTreatmentEnum,
    newIntervalSuspension: SuspensionTreatmentEnum
  ): SuspensionTreatmentEnum {
    const o = originalIntervalSuspension;
    const n = newIntervalSuspension;

    const A = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension;
    const B = SuspensionTreatmentEnum.NoteOfResolutionIsDissonant;
    const AB = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant;

    if ((o === A && n === B) || (o === B && n === A)) {
      return AB;
    }

    return (o as number) < (n as number) ? o : n;
  }

  private readonly _intervals: Record<number, IntervalWithSuspensions> = {
    0: { index: 0, semitones: 0, name: 'Unison',  isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    1: { index: 1, semitones: 1, name: 'Second',  isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.CannotFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension },
    2: { index: 2, semitones: 2, name: 'Third',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    3: { index: 3, semitones: 3, name: 'Fourth',  isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension },
    4: { index: 4, semitones: 4, name: 'Fifth',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsFree },
    5: { index: 5, semitones: 5, name: 'Sixth',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsFree,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    6: { index: 6, semitones: 6, name: 'Seventh', isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.CannotFormSuspension },
    7: { index: 7, semitones: 7, name: 'Octave',  isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
  };

  private readonly _intervalsInverted: Record<number, IntervalWithSuspensions> = {
    0: { index: 0, semitones:  0, name: 'Unison',  isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    1: { index: 1, semitones: -1, name: 'Second',  isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.CannotFormSuspension },
    2: { index: 2, semitones: -2, name: 'Third',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    3: { index: 3, semitones: -3, name: 'Fourth',  isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension },
    4: { index: 4, semitones: -4, name: 'Fifth',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsFree,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
    5: { index: 5, semitones: -5, name: 'Sixth',   isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsFree },
    6: { index: 6, semitones: -6, name: 'Seventh', isConsonant: false,
      upperSuspensionTreatment: SuspensionTreatmentEnum.CannotFormSuspension,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension },
    7: { index: 7, semitones: -7, name: 'Octave',  isConsonant: true,
      upperSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant,
      lowerSuspensionTreatment: SuspensionTreatmentEnum.NoteOfResolutionIsDissonant },
  };

  public compute(jvIndex: number): InvertedIntervals {
    const out: InvertedIntervals = {
      fixedConsonances: [],
      fixedDissonances: [],
      variableConsonances: [],
      variableDissonances: [],
    };

    for (let i = 0; i < InvertibleCounterpointService.N; i++) {
      const remainder = (i + jvIndex) % 7;
      const targetIndex = Math.abs(remainder);

      const a = this._intervals[i].isConsonant;
      const b = this._intervals[targetIndex].isConsonant;

      if (a && b) out.fixedConsonances.push(i);
      else if (!a && !b) out.fixedDissonances.push(i);
      else if (a && !b) out.variableConsonances.push(i);
      else out.variableDissonances.push(i);
    }

    return out;
  }

  public computeDetailed(jvIndex: number): InvertedIntervalsDetailed {
    const out: InvertedIntervalsDetailed = {
      fixedConsonances: [],
      fixedDissonances: [],
      variableConsonances: [],
      variableDissonances: [],
    };

    const N = InvertibleCounterpointService.N;

    for (let i = 0; i < N; i++) {
      const remainder = (i + jvIndex) % 7;
      const targetIndex = Math.abs(remainder);
      const base = this._intervals[i];
      const targ = this._intervals[targetIndex];

      const bothConsonant = base.isConsonant && targ.isConsonant;
      const bothDissonant = !base.isConsonant && !targ.isConsonant;
      const consToDiss   = base.isConsonant && !targ.isConsonant;
      // const dissToCons = ...

      const shiftedIndexAbs = Math.abs(jvIndex + i);
      const compareIndex = shiftedIndexAbs % 7;
      const isLargeShift = shiftedIndexAbs > 7;

      const compare = jvIndex < 0
        ? this._intervalsInverted[compareIndex]
        : this._intervals[compareIndex];

      const mergeSuspensions = (
        baseInt: IntervalWithSuspensions,
        compareInt: IntervalWithSuspensions,
        tweakSecondOnUpper: boolean
      ): IntervalWithSuspensions => {
        const a = InvertibleCounterpointService.copyInterval(baseInt);
        const b = InvertibleCounterpointService.copyInterval(compareInt);

        if (isLargeShift && b.name === 'Second') {
          if (tweakSecondOnUpper) {
            b.upperSuspensionTreatment = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension;
          } else {
            b.lowerSuspensionTreatment = SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension;
          }
        }

        a.upperSuspensionTreatment =
          InvertibleCounterpointService.strictMostSuspensionTreatmentEnum(
            a.upperSuspensionTreatment, b.upperSuspensionTreatment
          );
        a.lowerSuspensionTreatment =
          InvertibleCounterpointService.strictMostSuspensionTreatmentEnum(
            a.lowerSuspensionTreatment, b.lowerSuspensionTreatment
          );

        return a;
      };

      if (bothConsonant) {
        const merged = mergeSuspensions(base, compare, jvIndex >= 0);

        // NEW: flag when imperfect (2,5) → perfect (0,4,7).
        // For negative JV we look at |compare.semitones|.
        merged.imperfectBecomesPerfect =
          InvertibleCounterpointService.IMPERFECT.has(base.index) &&
          InvertibleCounterpointService.PERFECT.has(Math.abs(compare.semitones));

        out.fixedConsonances.push(merged);
        continue;
      }

      if (bothDissonant) {
        const merged = mergeSuspensions(base, compare, jvIndex >= 0);
        out.fixedDissonances.push(merged);
        continue;
      }

      if (consToDiss) {
        const merged = mergeSuspensions(base, compare, jvIndex >= 0);
        out.variableConsonances.push(merged);
        continue;
      }

      {
        const merged = mergeSuspensions(base, compare, jvIndex >= 0);
        out.variableDissonances.push(merged);
      }
    }

    return out;
  }
}
