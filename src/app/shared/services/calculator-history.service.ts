import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculatorHistoryService {
  private _history: Record<string, string> = {};
  private _historySubject = new BehaviorSubject<
    { key: string; value: string }[]
  >([]);

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    try {
      const history = localStorage.getItem('calculatorHistory');
      this._history = history ? JSON.parse(history) : {};
      this.updateHistorySubject();
    } catch (error) {
      console.error('Error loading history:', error);
      this._history = {};
      this._historySubject.next([]);
    }
  }

  get history$() {
    return this._historySubject.asObservable();
  }

  private updateHistorySubject(): void {
    const historyArray = Object.entries(this._history).map(([key, value]) => ({
      key,
      value,
    }));
    this._historySubject.next(historyArray);
  }

  writeHistory(equation: string): void {
    const timestamp = new Date().toISOString();
    this._history[timestamp] = equation;
    localStorage.setItem('calculatorHistory', JSON.stringify(this._history));
    this.updateHistorySubject();
  }

  clearHistory(): void {
    this._history = {};
    localStorage.removeItem('calculatorHistory');
    this._historySubject.next([]);
  }
}
