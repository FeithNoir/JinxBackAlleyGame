import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GameService } from './game.service';

describe('GameService', () => {
  let svc: GameService;
  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    svc = TestBed.inject(GameService);
    await svc.whenLoaded();
    svc.newGame();
  });

  it('empieza en el nodo 100 con caos 0', () => {
    expect(svc.gameState().currentNodeId).toBe(100);
    expect(svc.gameState().chaosLevel).toBe(0);
  });

  it('aplica presets de vestuario al estado (bug previo: se perdían)', () => {
    svc.selectOption(6); // nodo 6: outfit cat
    expect(svc.gameState().characters['jinx'].head).toBe('cat-ears');
  });

  it('INVENTORY_ADD agrega el ítem y ITEM_BRANCH lo detecta', () => {
    svc.selectOption(310);
    expect(svc.hasItem('shimmer-keycard')).toBeTrue();
    svc.selectOption(345);
    expect(svc.gameState().currentNodeId).toBe(341);
  });

  it('CHAOS_BRANCH con caos bajo lleva al final temprano', () => {
    svc.selectOption(335);
    expect(svc.gameState().currentNodeId).toBe(337);
    expect(svc.endings()).toContain('Smoke and Sirens');
  });

  it('guarda en localStorage', async () => {
    svc.selectOption(1);
    await svc.saveGame();
    expect(JSON.parse(localStorage.getItem('gameState')!).currentNodeId).toBe(1);
  });

  it('las opciones con requiresItem se ocultan sin el ítem', () => {
    svc.selectOption(300);
    const texts = svc.getCurrentNode().options!.map(o => o.text);
    expect(texts.some(t => t.includes('cat outfit'))).toBeFalse();
  });
});
