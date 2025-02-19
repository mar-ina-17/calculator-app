import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { CalculatorService } from '../../shared/services/calculator.service';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';

@Component({
  selector: 'app-calculator-base',
  imports: [CommonModule, CalculatorButtonComponent],
  templateUrl: './calculator-base.component.html',
  styleUrl: './calculator-base.component.css',
})
export class CalculatorBaseComponent {
  buttons: (string | number)[] = [
    1,
    2,
    3,
    '+',
    4,
    5,
    6,
    '-',
    7,
    8,
    9,
    '*',
    '(',
    0,
    ')',
    '/',
    'D',
    'C',
    '.',
    '=',
  ];
  result: string = '';

  private _resultSubscriptions!: Subscription;

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this._resultSubscriptions = combineLatest([
      this.calculatorService.result$,
      this.calculatorService.equationString$,
    ]).subscribe(([result, equation]) => {
      this.result = equation.length > 0 ? equation : result.toString();
    });
  }

  ngOnDestroy(): void {
    if (this._resultSubscriptions) {
      this._resultSubscriptions.unsubscribe();
    }
  }
}
