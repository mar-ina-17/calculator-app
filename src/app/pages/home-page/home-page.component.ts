import { Component } from '@angular/core';
import { CalculatorBaseComponent } from '../../components/calculator-base/calculator-base.component';

@Component({
  selector: 'app-home-page',
  imports: [CalculatorBaseComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
