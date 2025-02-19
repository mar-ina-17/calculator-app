import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalculatorHistoryService } from '../../shared/services/calculator-history.service';

@Component({
  selector: 'app-history-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  historyList: { key: string; value: string }[] = [];
  private _historySubscription!: Subscription;

  constructor(private historyService: CalculatorHistoryService) {}

  ngOnInit(): void {
    this._historySubscription = this.historyService.history$.subscribe(
      (history) => {
        this.historyList = history;
      }
    );
  }

  clearHistory(): void {
    this.historyService.clearHistory();
  }

  ngOnDestroy(): void {
    if (this._historySubscription) {
      this._historySubscription.unsubscribe();
    }
  }
}
