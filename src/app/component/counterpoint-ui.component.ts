import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvertibleCounterpointService } from '../services/invertible-counterpoint.service';
import { DEFAULT_INTERVALS, Interval } from '../models/Interval';


type Bucket = { label: string; values: number[]; chipColor: 'primary'|'accent'|'warn' };

@Component({
  selector: 'app-counterpoint-ui',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatSliderModule, MatListModule,
    MatChipsModule, MatIconModule, MatButtonModule, MatSlideToggleModule, MatTooltipModule
  ],
  templateUrl: './counterpoint-ui.component.html',
  styleUrls: ['./counterpoint-ui.component.css']
})
export class CounterpointUiComponent {
  inversion = signal(0);
  intervals = signal<Interval[]>([...DEFAULT_INTERVALS]);

  result = computed(() =>
    this.svc.compute(this.inversion(), this.intervals())
  );

  buckets = computed<Bucket[]>(() => [
    { label: 'Fixed Consonances',   values: this.result().fixedConsonances,   chipColor: 'primary' },
    { label: 'Variable Consonances',values: this.result().variableConsonances,chipColor: 'accent' },
    { label: 'Variable Dissonances',values: this.result().variableDissonances,chipColor: 'warn' },
    { label: 'Fixed Dissonances',   values: this.result().fixedDissonances,   chipColor: 'warn' },
  ]);

  constructor(private svc: InvertibleCounterpointService) {
    // Persist user toggles locally
    effect(() => {
      localStorage.setItem('ic/intervals', JSON.stringify(this.intervals()));
    });
    const saved = localStorage.getItem('ic/intervals');
    if (saved) this.intervals.set(JSON.parse(saved));
  }

  toggleConsonant(i: number) {
    const arr = [...this.intervals()];
    arr[i] = { ...arr[i], isConsonant: !arr[i].isConsonant };
    this.intervals.set(arr);
  }

  resetDefaults() {
    this.intervals.set([...DEFAULT_INTERVALS]);
    this.inversion.set(0);
  }

  intervalLabel(i: number) {
    const item = this.intervals()[i];
    return `${item.name} (${item.semitones})`;
  }
}
