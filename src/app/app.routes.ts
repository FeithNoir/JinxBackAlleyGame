import { Routes } from '@angular/router';
import { TitleComponent } from './pages/title/title.component';

// La pantalla de título va en el bundle inicial; el juego y el arcade se cargan bajo demanda.
export const routes: Routes = [
  { path: '', redirectTo: '/title', pathMatch: 'full' },
  { path: 'title', component: TitleComponent },
  {
    path: 'game',
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent) },
      { path: 'arcade', loadComponent: () => import('./pages/arcade/arcade.component').then(m => m.ArcadeComponent) }
    ]
  },
  { path: '**', redirectTo: '/title' } // Wildcard route for any unmatched URL
];
