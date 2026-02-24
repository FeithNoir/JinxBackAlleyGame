import { Injectable } from '@angular/core';
import { DialogueNode } from '@interfaces/dialogue-node.interface';
import { DIALOGUE_MAP } from '@data/dialogues';

@Injectable({
  providedIn: 'root'
})
export class DialogueRepositoryService {

  getDialogueNode(id: number): DialogueNode {
    return DIALOGUE_MAP.get(id) ?? DIALOGUE_MAP.get(9999)!;
  }

  getAllDialogueNodes(): DialogueNode[] {
    return Array.from(DIALOGUE_MAP.values());
  }
}