import { Component, Input } from '@angular/core';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { CalculatorService } from '../../shared/services/calculator.service';

@Component({
  selector: 'app-calculator-button',
  imports: [HighlightDirective],
  templateUrl: './calculator-button.component.html',
  styleUrl: './calculator-button.component.css',
})
export class CalculatorButtonComponent {
  @Input() value!: number | string;

  constructor(private calculatorService: CalculatorService) {}

  onButtonClick(value: string | number) {
    this.calculatorService.addToEquation(value);
  }
}
