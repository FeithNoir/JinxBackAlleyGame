import { Routes } from '@angular/router';
import { TitleComponent } from './pages/title/title.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
  { path: '', redirectTo: '/title', pathMatch: 'full' },
  { path: 'title', component: TitleComponent },
  {
    path: 'game',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'arcade', loadComponent: () => import('./pages/arcade/arcade.component').then(m => m.ArcadeComponent) }
    ]
  },
  { path: '**', redirectTo: '/title' } // Wildcard route for any unmatched URL
];
