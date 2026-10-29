import { Injectable } from '@angular/core';

/** Cambia a 'webp' tras ejecutar `npm run optimize:assets` (ver scripts/optimize-assets.mjs). */
export const ASSET_EXT: 'png' | 'webp' | 'avif' = 'png';

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

  /** Precarga en caché las capas indicadas (p. ej. el siguiente vestuario) sin bloquear el render. */
  preload(urls: string[]): void {
    const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    idle(() => urls.forEach(u => { const img = new Image(); img.decoding = 'async'; img.src = u; }));
  }

  getAssetUrl(type: string, id: string, subType?: string): string {
    let path = this.assetPaths[type];
    if (!path) {
      console.warn(`Unknown asset type: ${type}`);
      return '';
    }

    if (subType) {
      path = `${path}/${subType}`;
    }

    return `${path}/${id}.${ASSET_EXT}`;
  }
}
