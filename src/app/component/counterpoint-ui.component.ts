// src/app/component/counterpoint-ui.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InvertibleCounterpointService } from '../services/invertible-counterpoint.service';
import { SuspensionTreatmentEnum } from '../models/SuspensionTreatmentEnum';
import { InvertedIntervals, InvertedIntervalsDetailed } from '../models/InvertedIntervals';

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
  _jvInput = 0;

  _indices = [0, 1, 2, 3, 4, 5, 6, 7];

  _invertedIntervals: InvertedIntervals = {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: [],
  };

  _detailed!: InvertedIntervalsDetailed;
  _cells: Record<number, Cell> = {} as any;

  constructor(private cp: InvertibleCounterpointService) {
    this.recompute();
  }

  OnJvInput() {
    this.recompute();
  }

  private recompute() {
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

  getClassForIndex(i: number): string {
    if (this._invertedIntervals.fixedConsonances.includes(i)) return 'cell fixedConsonant';
    if (this._invertedIntervals.fixedDissonances.includes(i)) return 'cell fixedDissonant';
    if (this._invertedIntervals.variableConsonances.includes(i)) return 'cell variableConsonant';
    if (this._invertedIntervals.variableDissonances.includes(i)) return 'cell variableDissonant';
    return 'cell';
  }
}
