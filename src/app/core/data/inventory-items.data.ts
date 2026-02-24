import { InventoryItem } from '@interfaces/inventory-item.interface';

export const INVENTORY_ITEMS_DATA: { [key: string]: InventoryItem } = {
  'cat-outfit': {
    id: 'cat-outfit',
    name: 'Cat Outfit',
    description: 'A tight black latex cat-girl outfit with ears, tail, and little bells.',
    icon: 'assets/icons/cat-outfit.png', // Placeholder path
    quantity: 1
  },
  // Add other items here
};
