import { Component } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'calculator-app';
}
