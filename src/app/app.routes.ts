import { Routes } from '@angular/router';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'history', component: HistoryPageComponent },
];
