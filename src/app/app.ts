import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterpointUiComponent } from './component/counterpoint-ui.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CounterpointUiComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Invertible Counterpoint';
}
