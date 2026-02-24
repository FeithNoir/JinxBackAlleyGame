import { Component, model, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { InventoryModalComponent } from '@shared/inventory/inventory-modal.component';
import { GameService } from '@services/game.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoadingComponent,
    InventoryModalComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  sidebarCollapsed = signal<boolean>(false);
  gameService = inject(GameService);
}
