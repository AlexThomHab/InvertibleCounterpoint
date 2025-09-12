import { TestBed } from '@angular/core/testing';
import { InvertibleCounterpointService } from './invertible-counterpoint.service';
import { SuspensionTreatmentEnum } from '../models/SuspensionTreatmentEnum';
import { InvertedIntervalsDetailed } from '../models/InvertedIntervals';
import { IntervalWithSuspensions } from '../models/Interval';

function collectAll(d: InvertedIntervalsDetailed): IntervalWithSuspensions[] {
  return [
    ...d.fixedConsonances,
    ...d.fixedDissonances,
    ...d.variableConsonances,
    ...d.variableDissonances,
  ];
}

function byUpper(d: IntervalWithSuspensions[], t: SuspensionTreatmentEnum): number[] {
  return d.filter(x => x.upperSuspensionTreatment === t).map(x => x.index).sort((a, b) => a - b);
}

function byLower(d: IntervalWithSuspensions[], t: SuspensionTreatmentEnum): number[] {
  return d.filter(x => x.lowerSuspensionTreatment === t).map(x => x.index).sort((a, b) => a - b);
}

describe('Suspension treatment parity with C#', () => {
  let svc: InvertibleCounterpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvertibleCounterpointService],
    });
    svc = TestBed.inject(InvertibleCounterpointService);
  });

  describe('Given JV index is 0', () => {
    let all: IntervalWithSuspensions[];

    beforeEach(() => {
      const res = svc.computeDetailed(0);
      all = collectAll(res);
    });

    it('Then the correct suspension treatment is returned', () => {
            expect(byUpper(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([1]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 4, 7]);
      expect(byUpper(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([3, 6]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([5]);

            expect(byLower(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([6]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 5, 7]);
      expect(byLower(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([1, 3]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([4]);
    });
  });

  describe('Given JV index is 5', () => {
    let all: IntervalWithSuspensions[];

    beforeEach(() => {
      const res = svc.computeDetailed(5);
      all = collectAll(res);
    });

    it('Then the correct suspension treatment is returned', () => {
            expect(byUpper(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([1]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 4, 7]);
      expect(byUpper(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([3, 5]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([]);
      expect(byUpper(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant))
        .toEqual([6]);

            expect(byLower(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([1, 6]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 4, 7]);
      expect(byLower(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([3]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([]);
      expect(byLower(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant))
        .toEqual([5]);
    });
  });

  describe('Given JV index is -11', () => {
    let all: IntervalWithSuspensions[];

    beforeEach(() => {
      const res = svc.computeDetailed(-11);
      all = collectAll(res);
    });

    it('Then the correct suspension treatment is returned', () => {
            expect(byUpper(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([1, 5]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 4, 7]);
      expect(byUpper(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([3]);
      expect(byUpper(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([]);
      expect(byUpper(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant))
        .toEqual([6]);

            expect(byLower(all, SuspensionTreatmentEnum.CannotFormSuspension))
        .toEqual([6]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsDissonant))
        .toEqual([0, 2, 4, 7]);
      expect(byLower(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension))
        .toEqual([1, 3]);
      expect(byLower(all, SuspensionTreatmentEnum.NoteOfResolutionIsFree))
        .toEqual([]);
      expect(byLower(all, SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant))
        .toEqual([5]);
    });
  });
});
