import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatSliderChange, MatSliderModule} from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvertibleCounterpointService } from '../services/invertible-counterpoint.service';
import {FormsModule} from '@angular/forms';
import {InvertedIntervals} from '../models/InvertedIntervals';

type Bucket = { label: string; values: number[]; chipColor: 'primary'|'accent'|'warn' };

@Component({
  selector: 'app-counterpoint-ui',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatSliderModule, MatListModule,
    MatChipsModule, MatIconModule, MatButtonModule, MatSlideToggleModule, MatTooltipModule, FormsModule
  ],
  templateUrl: './counterpoint-ui.component.html',
  styleUrls: ['./counterpoint-ui.component.css']
})
export class CounterpointUiComponent {
  _jvInput: number = 0;
  _invertedIntervals: InvertedIntervals = {
    fixedConsonances: [],
    variableConsonances: [],
    fixedDissonances: [],
    variableDissonances: []
  };
  constructor(private _invertibleCounterpointService: InvertibleCounterpointService) {}

  OnJvInput(): void {
    this._invertedIntervals = this._invertibleCounterpointService.compute(this._jvInput)
  }
}

