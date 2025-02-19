import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalculatorHistoryService } from './calculator-history.service';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private _result$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _equationArray: (string | number)[] = [];
  private _equationString$ = new BehaviorSubject<string>('');

  constructor(private historyService: CalculatorHistoryService) {}

  get result$(): Observable<number> {
    return this._result$.asObservable();
  }

  get equationString$(): Observable<string> {
    return this._equationString$.asObservable();
  }

  private updateEquationString() {
    this._equationString$.next(this._equationArray.join(' '));
  }

  private clear(): void {
    this._equationArray = [];
    this._equationString$.next('');
    this._result$.next(0);
  }

  private delete(): void {
    if (this._equationArray.length > 0) {
      this._equationArray.pop();
      this.updateEquationString();
    }
  }

  private calculate(): void {
    let i = 0;
    while (i < this._equationArray.length) {
      if (this._equationArray[i] === '.') {
        const { decimalNumber, start, end } = this.formatDecimals(i);
        this._equationArray[start] = decimalNumber;
        this._equationArray.splice(start + 1, end - start);
        i = start;
      } else {
        i++;
      }
    }

    this._equationArray = this.groupDigits(this._equationArray);
    this._equationArray = this.evaluateEquation([...this._equationArray]);
    this._result$.next(Number(this._equationArray[0]));
    this.updateEquationString();
  }

  private formatDecimals(index: number): {
    decimalNumber: number;
    start: number;
    end: number;
  } {
    let decimal: (string | number)[] = [];
    let startIndex: number = index,
      endIndex: number = index;

    for (let i = index - 1; i >= 0; i--) {
      if (!isNaN(Number(this._equationArray[i]))) {
        decimal.unshift(this._equationArray[i]);
        startIndex = i;
      } else {
        break;
      }
    }

    decimal.push('.');

    for (let i = index + 1; i < this._equationArray.length; i++) {
      if (!isNaN(Number(this._equationArray[i]))) {
        decimal.push(this._equationArray[i]);
        endIndex = i;
      } else {
        break;
      }
    }

    return {
      decimalNumber: Number(decimal.join('')),
      start: startIndex,
      end: endIndex,
    };
  }

  private groupDigits(equation: (string | number)[]): (string | number)[] {
    let groupedEquation: (string | number)[] = [];
    let currentNumber = '';

    for (let i = 0; i < equation.length; i++) {
      if (
        typeof equation[i] === 'number' ||
        (!isNaN(Number(equation[i])) && equation[i] !== ' ')
      ) {
        currentNumber += equation[i].toString();
      } else {
        if (currentNumber !== '') {
          groupedEquation.push(Number(currentNumber));
          currentNumber = '';
        }
        groupedEquation.push(equation[i]);
      }
    }

    if (currentNumber !== '') {
      groupedEquation.push(Number(currentNumber));
    }

    return groupedEquation;
  }

  private evaluateEquation(equation: (string | number)[]): (string | number)[] {
    equation = equation.map((entry) =>
      typeof entry === 'string' && !isNaN(Number(entry)) ? Number(entry) : entry
    );

    while (equation.includes('(')) {
      equation = this.solveParentheses(equation);
    }

    equation = this.solveOperations(equation, ['*', '/']);
    equation = this.solveOperations(equation, ['+', '-']);
    return equation;
  }

  private solveParentheses(equation: (string | number)[]): (string | number)[] {
    let openIndex = -1;

    for (let i = 0; i < equation.length; i++) {
      if (equation[i] === '(') {
        openIndex = i;
      } else if (equation[i] === ')') {
        if (openIndex !== -1) {
          let subEquation = equation.slice(openIndex + 1, i);
          let subResult = this.evaluateEquation(subEquation);
          equation.splice(openIndex, i - openIndex + 1, subResult[0]);
          return equation;
        }
      }
    }
    return equation;
  }

  private solveOperations(
    equation: (string | number)[],
    operators: string[]
  ): (string | number)[] {
    let result: (string | number)[] = [];
    let i = 0;

    while (i < equation.length) {
      if (i > 0 && operators.includes(equation[i] as string)) {
        let left = Number(result.pop());
        let operator = equation[i] as string;
        let right = Number(equation[i + 1]);

        let computedValue = this.compute(left, operator, right);
        result.push(computedValue);
        i += 2;
      } else {
        result.push(equation[i]);
        i++;
      }
    }
    return result;
  }

  private compute(a: number, operator: string, b: number): number {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : NaN;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  addToEquation(part: string | number) {
    if (part === 'C') {
      this.clear();
      return;
    }
    if (part === 'D') {
      this.delete();
      return;
    }
    if (part === '=') {
      if (this._equationArray.length === 0) {
        return;
      }
      const equation = this._equationArray.join('');
      this.calculate();
      this.historyService.writeHistory(
        equation.concat(`=${this._result$.value.toString()}`)
      );
      return;
    }
    this._equationArray.push(part);
    this.updateEquationString();
  }
}
