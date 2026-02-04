import { DialogueNode } from '../interfaces/dialogue-node.interface';

export const DIALOGUE_DATA: DialogueNode[] = [
  {
    id: 100, // Intro start
    character: 'jinx',
    text: "...Who's there?",
    sceneEffect: 'flashlight',
    presets: [{ type: 'expression', id: 'neutral' }],
    nextNodeId: 101,
  },
  {
    id: 101,
    character: 'jinx',
    text: "Hey! Stop pointing that thing at me! It's blinding!",
    sceneEffect: 'flashlight',
    characterProps: { eyes: 'e-7', mouth: 'm-5' },
    nextNodeId: 1,
  },
  {
    id: 1,
    character: 'jinx',
    text: "Oh, it's you. You finally showed up! I was starting to get bored.",
    presets: [{ type: 'expression', id: 'happy' }],
    characterProps: { leftArm: 'left-2', rightArm: 'right-1' },
    chaosChange: 5,
    nextNodeId: 2,
  },
  {
    id: 2,
    character: 'jinx',
    text: "So, what are we doing? Because I've got some BIG plans.",
    presets: [
      { type: 'outfit', id: 'normal' },
      { type: 'expression', id: 'happy' }
    ],
    options: [
      { text: "What kind of plans?", nextNodeId: 3, chaosChange: 10 },
      { text: "I'm not sure if I have time for 'plans'...", nextNodeId: 4, chaosChange: -5 },
      {
        text: "How about you try this 'Cat' outfit?",
        nextNodeId: 6,
        chaosRequirement: 30
      },
    ],
  },
  {
    id: 3,
    character: 'jinx',
    text: "The fun kind! You know... explosions, chaos, total mayhem! The usual stuff.",
    characterProps: {
      eyes: 'e-5',
      mouth: 'm-4',
      leftArm: 'left-3',
      rightArm: 'right-2',
      effects: { overlay: 'biri-biri' }
    },
    chaosChange: 15,
    nextNodeId: 7,
  },
  {
    id: 7,
    character: 'jinx',
    text: "Wanna see something REALLY cool? It's gonna be a blast!",
    characterProps: {
      eyes: 'e-3',
      mouth: 'm-2',
      effects: { overlay: 'action-lines' }
    },
    chaosChange: 10,
    nextNodeId: 5,
  },
  {
    id: 4,
    character: 'jinx',
    text: "BO-RING! You're really no fun at all. Lighten up!",
    presets: [{ type: 'expression', id: 'mad' }],
    characterProps: {
      leftArm: 'left-4',
      rightArm: 'right-3',
      effects: { head: 'mean' }
    },
    chaosChange: 5,
    nextNodeId: 5,
  },
  {
    id: 5,
    character: 'jinx',
    text: "Anyway, let's get this show on the road. Don't blink!",
    presets: [{ type: 'expression', id: 'neutral' }],
    nextNodeId: 5, // Loop back
  },
  {
    id: 6,
    character: 'jinx',
    text: "A cat outfit? Oh, you're getting interesting now! Fine, I'll wear it for a bit...",
    presets: [
      { type: 'outfit', id: 'cat' },
      { type: 'expression', id: 'happy' }
    ],
    chaosChange: 20,
    nextNodeId: 5,
  },
  // --- Interaction Reactions ---
  // Head
  {
    id: 1000,
    character: 'jinx',
    text: "Hey! Don't mess with my hair! I took... like, two minutes to do it!",
    characterProps: { eyes: 'e-7', mouth: 'm-5' },
    isInteraction: true,
    metadata: { part: 'head', mood: 'annoyed' },
    nextNodeId: 5,
  },
  {
    id: 1001,
    character: 'jinx',
    text: "Umm... checking for lice? I don't have any! I think.",
    characterProps: { eyes: 'e-4', mouth: 'm-3' },
    isInteraction: true,
    metadata: { part: 'head', mood: 'nervous' },
    nextNodeId: 5,
  },
  {
    id: 1002,
    character: 'jinx',
    text: "Heh, you like the ears? They're custom made! By me!",
    characterProps: { eyes: 'e-2', mouth: 'm-2' },
    isInteraction: true,
    metadata: { part: 'head', mood: 'happy' },
    nextNodeId: 5,
  },
  // Top
  {
    id: 1010,
    character: 'jinx',
    text: "Hands to yourself, buddy! I've got bombs, and I'm not afraid to use 'em!",
    characterProps: { eyes: 'e-7', mouth: 'm-5' },
    isInteraction: true,
    metadata: { part: 'top', mood: 'annoyed' },
    nextNodeId: 5,
  },
  {
    id: 1011,
    character: 'jinx',
    text: "Eep! Is there... something on my shirt? A spider?!",
    characterProps: { eyes: 'e-4', mouth: 'm-3' },
    isInteraction: true,
    metadata: { part: 'top', mood: 'nervous' },
    nextNodeId: 5,
  },
  {
    id: 1012,
    character: 'jinx',
    text: "Checking out the gear? It's high-tech. Mostly.",
    characterProps: { eyes: 'e-5', mouth: 'm-4' },
    isInteraction: true,
    metadata: { part: 'top', mood: 'happy' },
    nextNodeId: 5,
  },
  // Bottom
  {
    id: 1020,
    character: 'jinx',
    text: "You're asking for a rocket to the face, you know that?",
    characterProps: { eyes: 'e-7', mouth: 'm-5' },
    isInteraction: true,
    metadata: { part: 'bottom', mood: 'annoyed' },
    nextNodeId: 5,
  },
  {
    id: 1021,
    character: 'jinx',
    text: "Whoa there! Personal space! Ever heard of it?",
    characterProps: { eyes: 'e-4', mouth: 'm-3' },
    isInteraction: true,
    metadata: { part: 'bottom', mood: 'nervous' },
    nextNodeId: 5,
  },
  {
    id: 1022,
    character: 'jinx',
    text: "Psh, looking for where I hide the grenades? Nice try!",
    characterProps: { eyes: 'e-3', mouth: 'm-2' },
    isInteraction: true,
    metadata: { part: 'bottom', mood: 'happy' },
    nextNodeId: 5,
  },
];
