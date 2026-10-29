import { DialogueNode } from '../interfaces/dialogue-node.interface';

const DIALOGUE_DATA: DialogueNode[] = [
    // === ACTO I - EL ENCUENTRO (sin cambios en la parte inicial) ===
    {
        id: 100,
        character: 'jinx',
        text: "...Who's there?",
        sceneEffect: 'night',
        presets: [{ type: 'expression', id: 'neutral' }],
        nextNodeId: 101,
    },
    {
        id: 101,
        character: 'jinx',
        text: "Hey! Stop pointing that thing at me! It's blinding!",
        sceneEffect: 'flashlight',
        characterProps: { eyes: 'e-7', mouth: 'm-5' },
        nextNodeId: 150,
    },
    {
        id: 150,
        character: 'jinx',
        text: "...Wait, I don't think I've seen your face before. Who are you exactly?",
        metadata: { type: 'NAME_REQUEST' },
        nextNodeId: 1,
    },
    {
        id: 1,
        character: 'jinx',
        text: "Oh, it's you... {playerName}! You finally showed up! I was starting to get bored.",
        presets: [{ type: 'expression', id: 'happy' }],
        characterProps: { leftArm: 'left-2', rightArm: 'right-1' },
        chaosChange: 5,
        nextNodeId: 2,
    },

    // === PLANES (nodo 2 sin cambios) ===
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
        characterProps: { eyes: 'e-5', mouth: 'm-4', leftArm: 'left-3', rightArm: 'right-2', effects: { overlay: 'biri-biri' } },
        chaosChange: 15,
        nextNodeId: 8,   // ← NUEVO: va directo a infiltración
    },
    {
        id: 7,
        character: 'jinx',
        text: "Wanna see something REALLY cool? It's gonna be a blast!",
        characterProps: { eyes: 'e-3', mouth: 'm-2', effects: { overlay: 'action-lines' } },
        chaosChange: 10,
        nextNodeId: 8,   // ← NUEVO
    },
    {
        id: 4,
        character: 'jinx',
        text: "BO-RING! You're really no fun at all. Lighten up!",
        presets: [{ type: 'expression', id: 'mad' }],
        characterProps: { leftArm: 'left-4', rightArm: 'right-3', effects: { head: 'mean' } },
        chaosChange: 5,
        nextNodeId: 8,   // ← NUEVO
    },
    {
        id: 6,
        character: 'jinx',
        text: "A cat outfit? Oh, you're getting interesting now! Fine, I'll wear it for a bit...",
        presets: [{ type: 'outfit', id: 'cat' }, { type: 'expression', id: 'happy' }],
        chaosChange: 20,
        nextNodeId: 8,   // ← NUEVO: después de ponérselo también va a infiltración
    },

    // === NUEVA RUTA: INFILTRACIÓN (el corazón de esta primera ruta) ===
    {
        id: 8,
        character: 'jinx',
        text: "Heh, perfect! So we gotta infiltrate that chem-baron warehouse tonight. Guards everywhere… What’s the plan, {playerName}?",
        presets: [{ type: 'expression', id: 'smirk' }],
        options: [
            {
                text: "Let’s search the surroundings for something useful",
                nextNodeId: 200,
                chaosChange: 5
            },
            {
                text: "You should go completely naked… that’ll distract them for sure~",
                nextNodeId: 210,
                chaosChange: 12
            },
            {
                text: "Just charge in with your rockets!",
                nextNodeId: 5,
                chaosChange: 15
            },
        ],
    },

    // Rama A - Buscar en el callejón
    {
        id: 200,
        character: 'jinx',
        text: "Good call! You start kicking trash piles… and look what we have here~ A full cat-girl outfit: ears, tail, tight black latex and little bells. Someone had fun last night, huh?",
        metadata: { type: 'INVENTORY_ADD', item: 'cat-outfit' },
        presets: [{ type: 'expression', id: 'curious' }],
        characterProps: { effects: { overlay: 'sparkles' } },
        chaosChange: 8,
        nextNodeId: 201,
    },
    {
        id: 201,
        character: 'jinx',
        text: "You actually found a cat outfit? Bring it here, cutie. So… you gonna offer it to me or what?",
        options: [
            {
                text: "Here, try the cat outfit on for the mission!",
                nextNodeId: 230,   // ← nodo handler que decide según caos
                chaosChange: 5
            },
        ],
    },

    // Rama B - Sugerir desnuda
    {
        id: 210,
        character: 'jinx',
        text: "Naked?! Heh… you really are a perv, {playerName}. My body on full display while we sneak in? That’s dangerous… but kinda hot. Let’s see how chaotic you made me feel first.",
        nextNodeId: 240,   // ← handler que decide según caos
    },

    // === HANDLERS DINÁMICOS (el GameService decidirá el nextNodeId real) ===
    // Ofrecer traje de gato → según caos actual
    {
        id: 230, // Handler - NO se muestra directamente
        character: 'jinx',
        text: "PLACEHOLDER - GameService will replace this with 231/232/233",
        metadata: { type: 'OFFER_OUTFIT' },
        nextNodeId: 9999,
    },
    {
        id: 231, // Low chaos (<20) - Annoyed but accepts
        character: 'jinx',
        text: "Pfft, fine… I’ll wear the stupid cat ears. But if anyone laughs I’m blowing you up first, got it?",
        presets: [{ type: 'outfit', id: 'cat' }, { type: 'expression', id: 'mad' }],
        chaosChange: 10,
        nextNodeId: 5,
    },
    {
        id: 232, // Medium chaos (20-39) - Shy + playful
        character: 'jinx',
        text: "Umm… it’s really tight on my curves… you sure you’re not just trying to stare? Heh, fine… I’ll wear it. Just for you~",
        presets: [{ type: 'outfit', id: 'cat' }, { type: 'expression', id: 'nervous-happy' }],
        chaosChange: 18,
        nextNodeId: 5,
    },
    {
        id: 233, // High chaos (40+) - Super excited
        character: 'jinx',
        text: "YES! This is gonna be PERFECT! Look how the tail swishes when I move… I’m keeping this forever. You’re the best, {playerName}!",
        presets: [{ type: 'outfit', id: 'cat' }, { type: 'expression', id: 'ecstatic' }],
        chaosChange: 25,
        nextNodeId: 5,
    },

    // Sugerir desnuda → según caos
    {
        id: 240, // Handler
        character: 'jinx',
        text: "PLACEHOLDER - GameService will replace with 241/242/243",
        metadata: { type: 'NAKED_SUGGEST' },
        nextNodeId: 9999,
    },
    {
        id: 241, // Low chaos - Rechazo juguetón
        character: 'jinx',
        text: "Haha! Nice try, but I’m not giving the guards a free show yet. Put some chaos in me first, perv~",
        presets: [{ type: 'expression', id: 'tease' }],
        chaosChange: -5,
        nextNodeId: 5,
    },
    {
        id: 242, // Medium chaos - Acepta parcial (ropa interior)
        character: 'jinx',
        text: "Only the top then… my tits are already half out anyway. Happy now, you little degenerate?",
        presets: [{ type: 'outfit', id: 'naked-top' }],
        chaosChange: 15,
        nextNodeId: 5,
    },
    {
        id: 243, // High chaos - Acepta full naked + tease fuerte
        character: 'jinx',
        text: "Fuck it. Clothes off. If we get caught it’s your fault… but I bet you’re gonna enjoy every second of me running naked through the alley, huh? 😏",
        presets: [{ type: 'outfit', id: 'naked' }, { type: 'expression', id: 'lusty' }],
        chaosChange: 30,
        nextNodeId: 5,
    },

    // ===================================================================
    // === ACTO II - EL ALMACÉN DEL QUÍMICO (expansión feat/mejoras-auditoria)
    // Antes el nodo 5 no existía y todas las ramas caían en 9999 ("not written yet").
    // ===================================================================
    {
        id: 5,
        character: 'jinx',
        text: "Alright, alright! Fishbones is loaded, the night is young… let's go pay that chem-baron a visit.",
        sceneEffect: 'night',
        presets: [{ type: 'expression', id: 'excited' }],
        characterProps: { leftArm: 'left-3', rightArm: 'right-2' },
        chaosChange: 5,
        nextNodeId: 300,
    },
    {
        id: 300,
        character: 'jinx',
        text: "There it is. Two goons at the gate, one lamp, zero brains. How do we get in, {playerName}?",
        sceneEffect: 'night',
        presets: [{ type: 'expression', id: 'suspicious' }],
        hint: "Explorar es gratis: el muelle de carga suele esconder cosas útiles. Si llevas cierto disfraz en el inventario, se abre otra opción.",
        options: [
            { text: "Check the loading dock around the back.", nextNodeId: 310, chaosChange: 2 },
            { text: "Use the cat outfit to distract the guards~", nextNodeId: 320, chaosChange: 10, requiresItem: 'cat-outfit', setsFlag: 'guards-distracted' },
            { text: "Forget subtle. Fishbones, front gate. NOW.", nextNodeId: 330, chaosChange: 20, setsFlag: 'alarm' },
        ],
    },

    // Rama A - Muelle de carga (objeto: tarjeta)
    {
        id: 310,
        character: 'jinx',
        text: "Ugh, it smells like shimmer and old socks back here… OH! A guard dropped his keycard in the puddle. Finders keepers!",
        metadata: { type: 'INVENTORY_ADD', item: 'shimmer-keycard' },
        presets: [{ type: 'expression', id: 'happy' }],
        characterProps: { effects: { overlay: 'sparkles' } },
        chaosChange: 3,
        nextNodeId: 311,
    },
    {
        id: 311,
        character: 'jinx',
        text: "Side door goes beep, door goes click, Jinx goes in. Easy-peasy. Stay close, ok?",
        characterProps: { effects: {} },
        nextNodeId: 340,
    },

    // Rama B - Distracción con el disfraz (sugerente, sin contenido gráfico)
    {
        id: 320,
        character: 'jinx',
        text: "Watch and learn. *She struts into the lamplight, tail swishing, and gives the goons a slow little twirl.* …Yep. Their jaws just hit the floor.",
        presets: [{ type: 'outfit', id: 'cat' }, { type: 'expression', id: 'tease' }],
        characterProps: { effects: { head: 'blush' } },
        chaosChange: 10,
        nextNodeId: 321,
    },
    {
        id: 321,
        character: 'jinx',
        text: "While they're busy drooling, slip past the gate. Don't you dare enjoy the show more than they do. …Or do. I won't tell.",
        characterProps: { effects: {} },
        nextNodeId: 340,
    },

    // Rama C - Fishbones (alarma + bifurcación por caos)
    {
        id: 330,
        character: 'jinx',
        text: "KA-BOOOOM! Ha! Did you see that gate fly?! …Uh-oh. Is that an alarm?",
        presets: [{ type: 'expression', id: 'excited' }],
        characterProps: { effects: { overlay: 'action-lines' } },
        nextNodeId: 335,
    },
    {
        id: 335, // Handler: decide según el caos acumulado
        character: 'jinx',
        text: "PLACEHOLDER - CHAOS_BRANCH",
        metadata: { type: 'CHAOS_BRANCH', branches: [{ minChaos: 60, nodeId: 336 }, { minChaos: 0, nodeId: 337 }] },
    },
    {
        id: 336,
        character: 'jinx',
        text: "Sirens? That's just MUSIC! Come on, {playerName}, we run in while they're still finding their pants!",
        presets: [{ type: 'expression', id: 'ecstatic' }],
        characterProps: { effects: { overlay: 'biri-biri' } },
        chaosChange: 10,
        nextNodeId: 340,
    },
    {
        id: 337,
        character: 'jinx',
        text: "Too many of them! Abort, abort! …Next time you let me warm up first, got it? My chaos wasn't high enough for this.",
        presets: [{ type: 'expression', id: 'mad' }],
        metadata: { type: 'ENDING', ending: 'Smoke and Sirens' },
        hint: "Final temprano: sube el caos antes de volar la puerta (por encima de 60) o entra con sigilo.",
        options: [
            { text: "Try again from the alley.", nextNodeId: 990 },
        ],
    },

    // === DENTRO DEL ALMACÉN ===
    {
        id: 340,
        character: 'jinx',
        text: "Crates of shimmer as far as the eye can see… and a big shiny vault in the back. Bet the good stuff's in there.",
        presets: [{ type: 'expression', id: 'curious' }],
        characterProps: { effects: {} },
        hint: "La bóveda reacciona a cierta tarjeta. Si no la tienes, Jinx improvisará… a su manera.",
        nextNodeId: 345,
    },
    {
        id: 345, // Handler: ¿tenemos la tarjeta?
        character: 'jinx',
        text: "PLACEHOLDER - ITEM_BRANCH",
        metadata: { type: 'ITEM_BRANCH', item: 'shimmer-keycard', branches: [{ minChaos: 0, nodeId: 341 }, { minChaos: 0, nodeId: 342 }] },
    },
    {
        id: 341,
        character: 'jinx',
        text: "Keycard, do your thing… *beep* Ooooh, it opens! See? Sometimes I can be sneaky. Sometimes.",
        presets: [{ type: 'expression', id: 'smirk' }],
        nextNodeId: 350,
    },
    {
        id: 342,
        character: 'jinx',
        text: "No key? No problem. One tiny chomper on the lock… cover your ears~",
        presets: [{ type: 'expression', id: 'excited' }],
        characterProps: { effects: { overlay: 'action-lines' } },
        chaosChange: 10,
        nextNodeId: 350,
    },
    {
        id: 350,
        character: 'jinx',
        text: "Jackpot! Hextech gems, a pile of cogs… and the baron's little black ledger. So, partner, what's the move?",
        presets: [{ type: 'expression', id: 'happy' }],
        characterProps: { effects: { overlay: 'sparkles' } },
        metadata: { type: 'INVENTORY_ADD', item: 'chem-ledger' },
        hint: "Hay cuatro finales aquí. Uno exige mucho caos; otro, que hayas distraído a los guardias y que Jinx confíe en ti (caos 70+).",
        options: [
            { text: "Grab the gems and vanish.", nextNodeId: 360, chaosChange: 5 },
            { text: "Keep the ledger. Knowledge is leverage.", nextNodeId: 380, chaosChange: -5 },
            { text: "Light it ALL up. Fireworks over Zaun!", nextNodeId: 370, chaosChange: 20, chaosRequirement: 50 },
            { text: "Forget the loot… meet me on the rooftop?", nextNodeId: 390, chaosChange: 10, chaosRequirement: 70, requiresFlag: 'guards-distracted' },
        ],
    },

    // === FINALES ===
    {
        id: 360,
        character: 'jinx',
        text: "Pockets full, nobody hurt, nobody the wiser. Boring… but shiny! Same time next week, {playerName}?",
        presets: [{ type: 'expression', id: 'happy' }],
        characterProps: { effects: {} },
        metadata: { type: 'ENDING', ending: 'Shiny Pockets' },
        options: [{ text: "Play again", nextNodeId: 990 }],
    },
    {
        id: 380,
        character: 'jinx',
        text: "The ledger, huh? Names, debts, secrets… ooh, you're devious. The baron's gonna be dancing to OUR tune now.",
        presets: [{ type: 'expression', id: 'smirk' }],
        characterProps: { effects: {} },
        metadata: { type: 'ENDING', ending: 'Leverage' },
        options: [{ text: "Play again", nextNodeId: 990 }],
    },
    {
        id: 370,
        character: 'jinx',
        text: "Three… two… one… BOOOOM! Look at the colors, {playerName}! Pink, blue, PURPLE! Best. Night. EVER!",
        presets: [{ type: 'expression', id: 'ecstatic' }],
        characterProps: { effects: { overlay: 'action-lines' } },
        metadata: { type: 'ENDING', ending: 'Fireworks Over Zaun' },
        options: [{ text: "Play again", nextNodeId: 990 }],
    },
    {
        id: 390,
        character: 'jinx',
        text: "The rooftop, the neon, the sirens far away… *She leans in close, grinning, and pulls you down beside her.* Shh. Nobody needs to see what happens next. 💜",
        sceneEffect: 'night',
        presets: [{ type: 'expression', id: 'nervous-happy' }],
        characterProps: { effects: { head: 'blush' } },
        metadata: { type: 'ENDING', ending: 'Rooftop Afterglow' },
        options: [{ text: "Play again", nextNodeId: 990 }],
    },
    {
        id: 990, // Reinicio controlado (GameService.newGame)
        character: 'jinx',
        text: "Again? Hehe, I knew you'd come back.",
        metadata: { type: 'RESTART' },
        nextNodeId: 100,
    },
    {
        id: 9999,
        character: 'jinx',
        text: "This dialogue hasn't been written yet. Please be patient, or bother the developer!",
        presets: [{ type: 'expression', id: 'neutral' }],
        nextNodeId: 100 // Go back to the start
    }
];

export const DIALOGUE_MAP = new Map<number, DialogueNode>(
    DIALOGUE_DATA.map(node => [node.id, node])
);
