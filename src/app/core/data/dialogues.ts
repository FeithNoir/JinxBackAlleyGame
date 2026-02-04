import { DialogueNode } from '../interfaces/dialogue-node.interface';

export const DIALOGUE_DATA: DialogueNode[] = [
  {
    id: 1,
    character: 'jinx',
    text: "Hey! You finally showed up. I was getting bored.",
    characterProps: { eyes: 'e-2', mouth: 'm-1', leftArm: 'left-2', rightArm: 'right-1' },
    chaosChange: 5,
    nextNodeId: 2,
  },
  {
    id: 2,
    character: 'jinx',
    text: "What do you want to do? Cause I've got PLANS.",
    characterProps: {
      eyes: 'e-4',
      mouth: 'm-3',
      head: 'cat-ears',
      top: 'cat-top',
      bottom: 'cat-bottom',
      effects: { head: 'blush' }
    },
    options: [
      { text: "What kind of plans?", nextNodeId: 3, chaosChange: 10 },
      { text: "I'm not sure I have time for plans...", nextNodeId: 4, chaosChange: -5 },
      {
        text: "Actually, why don't you try this 'Cat' outfit?",
        nextNodeId: 6,
        chaosRequirement: 30
      },
    ],
  },
  {
    id: 3,
    character: 'jinx',
    text: "The fun kind! Explosions, chaos... the usual.",
    characterProps: {
      eyes: 'e-5',
      mouth: 'm-4',
      leftArm: 'left-3',
      rightArm: 'right-2',
      effects: { overlay: 'biri-biri' }
    },
    chaosChange: 15,
    nextNodeId: 5,
  },
  {
    id: 4,
    character: 'jinx',
    text: "BO-RING! You're no fun at all.",
    characterProps: {
      eyes: 'e-7',
      mouth: 'm-5',
      leftArm: 'left-4',
      rightArm: 'right-3',
      top: 'top-1',
      bottom: 'short-1',
      effects: { head: 'mean' }
    },
    chaosChange: 5,
    nextNodeId: 5,
  },
  {
    id: 5,
    character: 'jinx',
    text: "Anyway, let's get this show on the road.",
    characterProps: { eyes: 'e-1', mouth: 'm-2', effects: {} },
    nextNodeId: 1, // Loop back for now
  },
  {
    id: 6,
    character: 'jinx',
    text: "A cat outfit? Oh, you're getting interesting now! Fine, for a little while...",
    characterProps: {
      eyes: 'e-2',
      mouth: 'm-2',
      head: 'cat-ears',
      top: 'cat-top',
      bottom: 'cat-bottom'
    },
    chaosChange: 20,
    nextNodeId: 5,
  },
];
