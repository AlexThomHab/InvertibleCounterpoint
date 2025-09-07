import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvertibleCounterpointService } from '../services/invertible-counterpoint.service';
import { InvertedIntervals } from '../models/InvertedIntervals';

@Component({
  selector: 'app-counterpoint-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './counterpoint-ui.component.html',
  styleUrls: ['./counterpoint-ui.component.css']
})
export class CounterpointUiComponent {
  _jvInput = 0;

  _invertedIntervals: InvertedIntervals = {
    fixedConsonances: [],
    fixedDissonances: [],
    variableConsonances: [],
    variableDissonances: []
  };

  // show 0..7 to match the service
  _indices = Array.from({ length: 8 }, (_, i) => i);

  constructor(private _invertibleCounterpointService: InvertibleCounterpointService) {
    this.OnJvInput(); // compute initial
  }

  OnJvInput(): void {
    this._invertedIntervals = this._invertibleCounterpointService.compute(this._jvInput);
  }

  getClassForIndex(i: number): string {
    const inv = this._invertedIntervals;
    if (inv.fixedConsonances.includes(i)) return 'fixedConsonant';
    if (inv.fixedDissonances.includes(i)) return 'fixedDissonant';
    if (inv.variableConsonances.includes(i)) return 'variableConsonant';
    if (inv.variableDissonances.includes(i)) return 'variableDissonant';
    return '';
  }
}
