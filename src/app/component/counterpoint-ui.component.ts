import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';

import {InvertibleCounterpointService} from '../services/invertible-counterpoint.service';
import {SuspensionTreatmentEnum} from '../models/SuspensionTreatmentEnum';
import {InvertedIntervals, InvertedIntervalsDetailed} from '../models/InvertedIntervals';
import {ThreeVoiceGivenJvIndexValuesCalculator} from '../services/ThreeVoiceGivenJvIndexCalculator';

type Cell = {
  index: number;
  topGlyph: string;
  bottomGlyph: string;
  topTitle: string;
  bottomTitle: string;
  topClass?: string;
  bottomClass?: string;
};

type CellsMap = Partial<Record<number, Cell>>;
type CellsRowTuple = [CellsMap, CellsMap, CellsMap];

function EMPTY(): InvertedIntervals {
  return {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: [],
  };
}

@Component({
  selector: 'app-counterpoint-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatTooltipModule],
  templateUrl: './counterpoint-ui.component.html',
  styleUrls: ['./counterpoint-ui.component.css'],
})
export class CounterpointUiComponent {

  _dark = false;
  _activeTab: 'two' | 'three' = 'two';
  _indices = [0, 1, 2, 3, 4, 5, 6, 7];

  _jvInput = 0;
  _invertedIntervals: InvertedIntervals = EMPTY();
  _detailed!: InvertedIntervalsDetailed;
  _cells: CellsMap = {};
  _jvPrimeInput = 0;
  _jvDoublePrimeInput = 0;
  _jvSigmaView = 0;
  _threeRows: [InvertedIntervals, InvertedIntervals, InvertedIntervals] = [EMPTY(), EMPTY(), EMPTY()];

  _threeRowsCells: CellsRowTuple = [{}, {}, {}];

  private threeCalc = new ThreeVoiceGivenJvIndexValuesCalculator();

  constructor(private cp: InvertibleCounterpointService) {
    const saved = localStorage.getItem('theme');
    this._dark = saved ? saved === 'dark'
      : (typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.recomputeTwoVoice();
    this.recomputeThreeVoice();
  }

  toggleDark() {
    this._dark = !this._dark;
    localStorage.setItem('theme', this._dark ? 'dark' : 'light');
  }

  OnJvInput() {
    this.recomputeTwoVoice();
  }

  private recomputeTwoVoice() {
    this._invertedIntervals = this.cp.compute(this._jvInput);
    this._detailed = this.cp.computeDetailed(this._jvInput);

    this._cells = {};
    const all = [
      ...this._detailed.fixedConsonances,
      ...this._detailed.fixedDissonances,
      ...this._detailed.variableConsonances,
      ...this._detailed.variableDissonances,
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
      };
    }
  }

  getClassForIndex(i: number): string {
    if (this._invertedIntervals.fixedConsonances.includes(i)) return 'cell fixedConsonant';
    if (this._invertedIntervals.fixedDissonances.includes(i)) return 'cell fixedDissonant';
    if (this._invertedIntervals.variableConsonances.includes(i)) return 'cell variableConsonant';
    if (this._invertedIntervals.variableDissonances.includes(i)) return 'cell variableDissonant';
    return 'cell';
  }

  onThreeVoiceInput() {
    this.recomputeThreeVoice();
  }

  private recomputeThreeVoice() {
    const sigma = this._jvPrimeInput + this._jvDoublePrimeInput;
    this._jvSigmaView = sigma;

    const rows = this.threeCalc.calculate(this._jvPrimeInput, this._jvDoublePrimeInput, sigma);
    this._threeRows = [rows[0] ?? EMPTY(), rows[1] ?? EMPTY(), rows[2] ?? EMPTY()];

    const detailedRows = this.threeCalc.calculateDetailed(this._jvPrimeInput, this._jvDoublePrimeInput, sigma);
    this._threeRowsCells = [
      this.buildCellsMap(detailedRows[0]),
      this.buildCellsMap(detailedRows[1]),
      this.buildCellsMap(detailedRows[2]),
    ];
  }

  private buildCellsMap(det?: InvertedIntervalsDetailed): CellsMap {
    const cells: CellsMap = {};
    if (!det) return cells;
    const all = [
      ...det.fixedConsonances,
      ...det.fixedDissonances,
      ...det.variableConsonances,
      ...det.variableDissonances,
    ];
    for (const it of all) {
      cells[it.index] = {
        index: it.index,
        topGlyph: this.glyphFor(it.upperSuspensionTreatment),
        bottomGlyph: this.glyphFor(it.lowerSuspensionTreatment),
        topTitle: this.fullName(it.upperSuspensionTreatment, 'Upper'),
        bottomTitle: this.fullName(it.lowerSuspensionTreatment, 'Lower'),
        topClass: this.glyphExtraClass(it.upperSuspensionTreatment),
        bottomClass: this.glyphExtraClass(it.lowerSuspensionTreatment),
      };
    }
    return cells;
  }

  getThreeRowClassForIndex(row: number, i: number): string {
    const r = this._threeRows[row];
    if (!r) return 'cell';
    if (r.fixedConsonances.includes(i)) return 'cell fixedConsonant';
    if (r.fixedDissonances.includes(i)) return 'cell fixedDissonant';
    if (r.variableConsonances.includes(i)) return 'cell variableConsonant';
    if (r.variableDissonances.includes(i)) return 'cell variableDissonant';
    return 'cell';
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

  private glyphExtraClass(t: SuspensionTreatmentEnum): string {
    return t === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'xsmall' : '';
  }

  private fullName(t: SuspensionTreatmentEnum, voice: 'Upper' | 'Lower'): string {
    const base =
      t === SuspensionTreatmentEnum.CannotFormSuspension ? 'Cannot form a suspension' :
        t === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension ? 'If on downbeat, must form suspension' :
          t === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'If forming suspension, note of resolution is dissonant' :
            t === SuspensionTreatmentEnum.NoteOfResolutionIsFree ? 'If forming suspension, note of resolution is free' :
              t === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant ? 'Both conditions apply' : '';
    return `${voice}: ${base}`;
  }
}
