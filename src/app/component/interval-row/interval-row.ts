import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IntervalWithSuspensions} from '../../models/Interval';
import {InvertibleCounterpointService} from '../../services/invertible-counterpoint.service';
import {SuspensionTreatmentEnum} from '../../models/SuspensionTreatmentEnum';
import {InvertedIntervalsDetailed} from '../../models/InvertedIntervals';
import {MatTooltipModule} from '@angular/material/tooltip';

type Cell = {
  index: number;
  topGlyph: string;
  bottomGlyph: string;
  topTitle: string;
  bottomTitle: string;
  topClass?: string;
  bottomClass?: string;
  upgrade?: boolean;
  becomesAFourth?: boolean;
};

type CellsMap = Partial<Record<number, Cell>>;

function emptyDetailed(): InvertedIntervalsDetailed {
  return {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: [],
  };
}

@Component({
  selector: 'app-interval-row',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatTooltipModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './interval-row.html',
  styleUrl: './interval-row.css'
})

export class IntervalRow {
  _cells: CellsMap = {};
  _intervals: InvertedIntervalsDetailed = emptyDetailed();
  _indices = [0, 1, 2, 3, 4, 5, 6, 7];
  _jvInput = 0;
  constructor(private invertibleCounterpointService: InvertibleCounterpointService){
    this.recomputeTwoVoice();

  }

  toIndexList(intervalsWithSuspensions?: IntervalWithSuspensions[] | null): string {
    return (intervalsWithSuspensions ?? []).map(x => x.index).join(', ');
  }

  getClassForIndex(i: number): string {
    if (this._intervals.fixedConsonances.some(x => x.index === i)) return 'cell fixedConsonant';
    if (this._intervals.fixedDissonances.some(x => x.index === i)) return 'cell fixedDissonant';
    if (this._intervals.variableConsonances.some(x => x.index === i)) return 'cell variableConsonant';
    if (this._intervals.variableDissonances.some(x => x.index === i)) return 'cell variableDissonant';
    return 'cell';
  }

  OnJvInput() {
    this.recomputeTwoVoice();
  }
  private recomputeTwoVoice() {
    this._intervals = this.invertibleCounterpointService.computeDetailed(this._jvInput);
    this._intervals = this.invertibleCounterpointService.computeDetailed(this._jvInput);

    this._cells = {};
    const all = [
      ...this._intervals.fixedConsonances,
      ...this._intervals.fixedDissonances,
      ...this._intervals.variableConsonances,
      ...this._intervals.variableDissonances,
    ];
    for (const it of all) {
      this._cells[it.index] = {
        index: it.index,
        topGlyph: this.glyphFor(it.upperSuspensionTreatment),
        bottomGlyph: this.glyphFor(it.lowerSuspensionTreatment),
        topTitle: this.fullName(it.upperSuspensionTreatment, 'Upper'),
        bottomTitle: this.fullName(it.lowerSuspensionTreatment, 'Lower'),
        topClass: this.glyphExtraClass(it.upperSuspensionTreatment),
        bottomClass: this.glyphExtraClass(it.lowerSuspensionTreatment),
        upgrade: it.imperfectBecomesPerfect,
        becomesAFourth: it.becomesAFourth,
      };
    }

  }
  private glyphFor(t: SuspensionTreatmentEnum): string {
    switch (t) {
      case SuspensionTreatmentEnum.CannotFormSuspension:
        return '(-)';
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension:
        return '-';
      case SuspensionTreatmentEnum.NoteOfResolutionIsDissonant:
        return 'x';
      case SuspensionTreatmentEnum.NoteOfResolutionIsFree:
        return '---';
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant:
        return '-x';
      default:
        return '';
    }
  }
  private fullName(treatmentEnum: SuspensionTreatmentEnum, voice: 'Upper' | 'Lower'): string {
    const base =
      treatmentEnum === SuspensionTreatmentEnum.CannotFormSuspension ? 'Cannot form a suspension' :
        treatmentEnum === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension ? 'If on downbeat, must form suspension' :
          treatmentEnum === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'If forming suspension, note of resolution is dissonant' :
            treatmentEnum === SuspensionTreatmentEnum.NoteOfResolutionIsFree ? 'If forming suspension, note of resolution is free' :
              treatmentEnum === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant ? 'Both conditions apply' : '';
    return `${voice}: ${base}`;
  }
  private glyphExtraClass(t: SuspensionTreatmentEnum): string {
    return t === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'xsmall' : '';
  }

}
