import { InventoryItem } from '@interfaces/inventory-item.interface';

export const INVENTORY_ITEMS_DATA: { [key: string]: InventoryItem } = {
  'cat-outfit': {
    id: 'cat-outfit',
    name: 'Cat Outfit',
    description: 'A tight black latex cat-girl outfit with ears, tail, and little bells.',
    icon: 'icons/cat-outfit.png', // public/icons (no versionado)
    quantity: 1
  },
  'shimmer-keycard': {
    id: 'shimmer-keycard',
    name: 'Shimmer Keycard',
    description: 'A sticky guard keycard fished out of a puddle. Opens doors in the chem-baron warehouse.',
    icon: 'icons/shimmer-keycard.png',
    quantity: 1
  },
  'chem-ledger': {
    id: 'chem-ledger',
    name: "Baron's Ledger",
    description: 'Names, debts and secrets of half of Zaun. Dangerous to keep, more dangerous to lose.',
    icon: 'icons/chem-ledger.png',
    quantity: 1
  },
  // Add other items here
};
