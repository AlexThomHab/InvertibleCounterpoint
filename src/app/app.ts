import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterpointUiComponent } from './component/counterpoint-ui.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CounterpointUiComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Invertible Counterpoint';

  ngAfterViewInit(): void {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense error', e);
    }
  }
}
