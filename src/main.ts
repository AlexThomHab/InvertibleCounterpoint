import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CounterpointUiComponent } from "./app/component/counterpoint-ui.component";

bootstrapApplication(CounterpointUiComponent, {
  providers: [provideAnimations(), provideClientHydration()]
}).catch(err => console.error(err));
