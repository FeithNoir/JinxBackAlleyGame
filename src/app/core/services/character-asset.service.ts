import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterAssetService {

  private assetPaths: Record<string, string> = {
    base: 'character/base',
    arms: 'character/arms',
    clothes: 'character/clothes',
    effects: 'character/effects',
    expressions: 'character/expressions'
  };

  constructor() { }

  getAssetUrl(type: string, id: string, subType?: string): string {
    let path = this.assetPaths[type];
    if (!path) {
      console.warn(`Unknown asset type: ${type}`);
      return '';
    }

    if (subType) {
      path = `${path}/${subType}`;
    }

    return `${path}/${id}.png`;
  }
}
