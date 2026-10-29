import { DIALOGUE_MAP } from './dialogues';
import { INVENTORY_ITEMS_DATA } from './inventory-items.data';
import { OUTFIT_PRESETS, EXPRESSION_PRESETS } from '../services/character.service';

/** Pruebas de integridad del grafo narrativo: evitan nodos huérfanos o rotos. */
describe('DIALOGUE_DATA (integridad del guion)', () => {
  const nodes = Array.from(DIALOGUE_MAP.values());
  const HANDLERS = ['OFFER_OUTFIT', 'NAKED_SUGGEST', 'CHAOS_BRANCH', 'ITEM_BRANCH'];

  it('todos los nextNodeId apuntan a nodos existentes', () => {
    const broken: string[] = [];
    for (const n of nodes) {
      const targets = [n.nextNodeId, ...(n.options ?? []).map(o => o.nextNodeId), ...(n.metadata?.branches ?? []).map(b => b.nodeId)];
      targets.filter(t => t !== undefined).forEach(t => { if (!DIALOGUE_MAP.has(t!)) broken.push(`${n.id} -> ${t}`); });
    }
    expect(broken).toEqual([]);
  });

  it('ningún nodo visible queda sin salida (salvo handlers)', () => {
    const deadEnds = nodes.filter(n => !n.nextNodeId && !(n.options?.length) && !HANDLERS.includes(n.metadata?.type ?? '') && n.metadata?.type !== 'RESTART');
    expect(deadEnds.map(n => n.id)).toEqual([]);
  });

  it('los presets usados existen', () => {
    const missing: string[] = [];
    nodes.forEach(n => n.presets?.forEach(p => {
      const table = p.type === 'outfit' ? OUTFIT_PRESETS : EXPRESSION_PRESETS;
      if (!table[p.id]) missing.push(`${n.id}:${p.type}/${p.id}`);
    }));
    expect(missing).toEqual([]);
  });

  it('los ítems referenciados existen', () => {
    const refs = nodes.flatMap(n => [n.metadata?.item, ...(n.options ?? []).map(o => o.requiresItem)]).filter(Boolean) as string[];
    refs.forEach(r => expect(INVENTORY_ITEMS_DATA[r]).withContext(r).toBeDefined());
  });

  it('hay al menos 5 finales', () => {
    expect(nodes.filter(n => n.metadata?.type === 'ENDING').length).toBeGreaterThanOrEqual(5);
  });
});
