import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/header/header.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { SidebarComponent } from '@shared/sidebar/sidebar.component';
import { LoadingComponent } from '@shared/loading/loading.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent, SidebarComponent, LoadingComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
}
