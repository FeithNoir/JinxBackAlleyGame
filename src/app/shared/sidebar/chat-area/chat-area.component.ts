import { afterNextRender, Component, DestroyRef, ElementRef, input, output, ChangeDetectionStrategy, signal, effect, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { DialoguesComponent } from '@shared/dialogues/dialogues.component';
import { OptionsComponent } from '@shared/options/options.component';

export interface ChatMessage {
  speaker: string;
  text: string;
  isPlayer?: boolean;
}

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, FormsModule, DialoguesComponent, OptionsComponent],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'z-index: 2001; position: relative;' // Ensure it's above night effect, below active dialogue
  }
})
export class ChatAreaComponent {
  dialogueHistory = input<ChatMessage[]>([]);
  currentNode = input<DialogueNode | undefined>(undefined);
  isAskingName = input<boolean>(false);
  isMobile = input<boolean>(false);

  dialogueAdvanced = output<void>();
  optionSelected = output<number>();
  playerNameSubmitted = output<string>();
  menuRequested = output<void>();
  settingsToggled = output<void>();

  tempPlayerName = '';
  showHint = signal<boolean>(false);
  private chatScroll = viewChild<ElementRef<HTMLElement>>('chatScroll');
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  /** Solo auto-scroll si el jugador ya estaba abajo (no interrumpe la lectura). */
  private pinnedToBottom = true;

  constructor() {
    // La pista se oculta al cambiar de nodo
    effect(() => { this.currentNode(); this.showHint.set(false); });

    // El historial crece (mensajes nuevos y efecto máquina de escribir), así que
    // observamos el contenido y mantenemos el fondo visible salvo que el jugador
    // haya subido a leer.
    afterNextRender(() => {
      const el = this.chatScroll()?.nativeElement;
      this.scrollToBottom();
      if (!el) return;

      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => {
          if (this.pinnedToBottom) this.scrollToBottom();
        });
        this.mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });
      }

      // El alto disponible cambia con el layout (fuentes, resize de ventana).
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.pinnedToBottom) this.scrollToBottom();
        });
        this.resizeObserver.observe(el);
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.mutationObserver?.disconnect();
      this.resizeObserver?.disconnect();
    });
  }

  onScroll(): void {
    const el = this.chatScroll()?.nativeElement;
    if (!el) return;
    this.pinnedToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  }

  private scrollToBottom(): void {
    const el = this.chatScroll()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onDialogueAdvance(): void {
    this.dialogueAdvanced.emit();
  }

  onOptionSelected(nextNodeId: number): void {
    this.optionSelected.emit(nextNodeId);
  }

  submitPlayerName(): void {
    if (this.tempPlayerName.trim()) {
      this.playerNameSubmitted.emit(this.tempPlayerName);
      this.tempPlayerName = '';
    }
  }

  goToMenu(): void {
    this.menuRequested.emit();
  }

  toggleSettings(): void {
    this.settingsToggled.emit();
  }
}
