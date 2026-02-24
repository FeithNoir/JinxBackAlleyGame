import { Component, input, output, computed, signal } from '@angular/core';

import { InventoryItem } from '@interfaces/inventory-item.interface';

@Component({
  selector: 'app-inventory-modal',
  standalone: true,
  imports: [], // No CommonModule needed for new control flow
  templateUrl: './inventory-modal.component.html',
  styleUrls: ['./inventory-modal.component.css']
})
export class InventoryModalComponent {
  isOpen = input<boolean>(false);
  inventory = input<InventoryItem[]>([]);
  close = output<void>();

  itemsPerPage = 9;
  currentPage = signal<number>(1);

  totalPages = computed(() => Math.ceil(this.inventory().length / this.itemsPerPage));

  paginatedItems = computed(() => {
    const totalPages = this.totalPages();
    let currentPageVal = this.currentPage();

    // Adjust currentPage if it's out of bounds
    if (totalPages === 0) {
      currentPageVal = 0;
    } else if (currentPageVal > totalPages) {
      currentPageVal = totalPages;
    } else if (currentPageVal === 0 && totalPages > 0) {
      currentPageVal = 1;
    }
    this.currentPage.set(currentPageVal); // Update signal if adjusted

    const startIndex = (currentPageVal - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.inventory().slice(startIndex, endIndex);
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  onClose(): void {
    this.close.emit();
  }
}