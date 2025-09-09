// src/app/component/counterpoint-ui.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InvertibleCounterpointService } from '../services/invertible-counterpoint.service';
import { SuspensionTreatmentEnum } from '../models/SuspensionTreatmentEnum';
import { InvertedIntervals, InvertedIntervalsDetailed } from '../models/InvertedIntervals';
import { ThreeVoiceGivenJvIndexValuesCalculator } from '../services/ThreeVoiceGivenJvIndexCalculator';

type Cell = {
  index: number;
  topGlyph: string;        // upper suspension
  bottomGlyph: string;     // lower suspension
  topTitle: string;
  bottomTitle: string;
  topClass?: string;       // optional css helper for glyph
  bottomClass?: string;    // optional css helper for glyph
};

@Component({
  selector: 'app-counterpoint-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatTooltipModule],
  templateUrl: './counterpoint-ui.component.html',
  styleUrls: ['./counterpoint-ui.component.css'],
})
export class CounterpointUiComponent {
  // Tabs
  _activeTab: 'two' | 'three' = 'two';

  // Shared
  _indices = [0, 1, 2, 3, 4, 5, 6, 7];

  // === Two-voice state ===
  _jvInput = 0;

  _invertedIntervals: InvertedIntervals = {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: [],
  };

  _detailed!: InvertedIntervalsDetailed; // for glyphs
  _cells: Record<number, Cell> = {} as any;

  // === Three-voice state ===
  _jvPrimeInput = 0;        // JV′
  _jvDoublePrimeInput = 0;  // JV″
  _three: InvertedIntervals = {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: [],
  };

  // Calculators
  private threeCalc = new ThreeVoiceGivenJvIndexValuesCalculator();

  constructor(private cp: InvertibleCounterpointService) {
    // initial renders
    this.recomputeTwoVoice();
    this.recomputeThreeVoice();
  }

  // ===== TWO-VOICE =====
  OnJvInput() {
    this.recomputeTwoVoice();
  }

  private recomputeTwoVoice() {
    this._invertedIntervals = this.cp.compute(this._jvInput);
    this._detailed = this.cp.computeDetailed(this._jvInput);

    // build glyph cells
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

  // ===== THREE-VOICE =====
  onThreeVoiceInput() {
    this.recomputeThreeVoice();
  }

  private recomputeThreeVoice() {
    // JVΣ shown in the UI is the raw sum; normalization happens inside the calculator.
    const sigma = this._jvPrimeInput + this._jvDoublePrimeInput;
    this._three = this.threeCalc.calculate(this._jvPrimeInput, this._jvDoublePrimeInput, sigma);
  }

  getThreeClassForIndex(i: number): string {
    if (this._three.fixedConsonances.includes(i)) return 'cell fixedConsonant';
    if (this._three.fixedDissonances.includes(i)) return 'cell fixedDissonant';
    if (this._three.variableConsonances.includes(i)) return 'cell variableConsonant';
    if (this._three.variableDissonances.includes(i)) return 'cell variableDissonant';
    return 'cell';
  }

  // ===== Glyph helpers (2-voice only) =====

  // Map enum -> symbol (matches your C# SuspensionLookUpTable)
  private glyphFor(t: SuspensionTreatmentEnum): string {
    switch (t) {
      case SuspensionTreatmentEnum.CannotFormSuspension: return '(-)';
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension: return '-';
      case SuspensionTreatmentEnum.NoteOfResolutionIsDissonant: return 'x';
      case SuspensionTreatmentEnum.NoteOfResolutionIsFree: return '---';
      case SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant: return '-x';
      default: return '';
    }
  }

  // Optional size tweak (smaller 'x' looks nicer)
  private glyphExtraClass(t: SuspensionTreatmentEnum): string {
    return t === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'xsmall' : '';
  }

  private fullName(t: SuspensionTreatmentEnum, voice: 'Upper' | 'Lower'): string {
    const base =
      t === SuspensionTreatmentEnum.CannotFormSuspension ? 'Cannot form a suspension' :
        t === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspension ? 'If on downbeat, must form suspension' :
          t === SuspensionTreatmentEnum.NoteOfResolutionIsDissonant ? 'If forming suspension, note of resolution is dissonant' :
            t === SuspensionTreatmentEnum.NoteOfResolutionIsFree ? 'If forming suspension, note of resolution is free' :
              t === SuspensionTreatmentEnum.IfOnDownbeatMustFormSuspensionAndNoteOfResolutionIsDissonant ? 'Both conditions apply' :
                '';
    return `${voice}: ${base}`;
  }
}
