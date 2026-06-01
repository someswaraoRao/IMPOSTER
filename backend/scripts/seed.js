const db = require('../config/db');

const WORD_PAIRS = [
  { i: 'Apple',      m: 'Orange',     d: 'easy' },
  { i: 'Dog',        m: 'Cat',        d: 'easy' },
  { i: 'Train',      m: 'Bus',        d: 'easy' },
  { i: 'Tea',        m: 'Coffee',     d: 'easy' },
  { i: 'Sun',        m: 'Moon',       d: 'easy' },
  { i: 'Chair',      m: 'Sofa',       d: 'easy' },
  { i: 'Laptop',     m: 'Tablet',     d: 'medium' },
  { i: 'Pizza',      m: 'Burger',     d: 'medium' },
  { i: 'Ocean',      m: 'Lake',       d: 'medium' },
  { i: 'Camera',     m: 'Telescope',  d: 'medium' },
  { i: 'Guitar',     m: 'Violin',     d: 'medium' },
  { i: 'Shark',      m: 'Dolphin',    d: 'medium' },
  { i: 'Democracy',  m: 'Republic',   d: 'hard' },
  { i: 'River',      m: 'Stream',     d: 'hard' },
  { i: 'Mountain',   m: 'Volcano',    d: 'hard' },
  { i: 'Theory',     m: 'Hypothesis', d: 'hard' },
  { i: 'Painting',   m: 'Drawing',    d: 'hard' },
  { i: 'Hurricane',  m: 'Tornado',    d: 'hard' },
];

const CPU_CLUES = {
  Apple:      ['juice', 'red', 'fruit', 'sweet', 'crisp', 'pie', 'orchard'],
  Orange:     ['citrus', 'peel', 'vitamin', 'florida', 'bright', 'segments'],
  Dog:        ['bark', 'leash', 'fetch', 'loyal', 'kennel', 'paws', 'woof'],
  Cat:        ['meow', 'whiskers', 'purr', 'feline', 'scratch', 'hiss'],
  Train:      ['track', 'engine', 'rail', 'station', 'steam', 'conductor'],
  Bus:        ['route', 'stop', 'driver', 'diesel', 'fare', 'transit'],
  Tea:        ['brew', 'steep', 'kettle', 'leaf', 'herbal', 'sip', 'cup'],
  Coffee:     ['bean', 'espresso', 'roast', 'grind', 'caffeine', 'morning', 'bitter'],
  Sun:        ['solar', 'bright', 'warm', 'rise', 'daytime', 'photon', 'star'],
  Moon:       ['lunar', 'night', 'crater', 'tide', 'orbit', 'phase', 'glow'],
  Chair:      ['seat', 'legs', 'sit', 'wooden', 'cushion', 'furniture'],
  Sofa:       ['lounge', 'cushion', 'couch', 'comfortable', 'living'],
  Laptop:     ['keyboard', 'portable', 'screen', 'charger', 'processor', 'battery'],
  Tablet:     ['touchscreen', 'stylus', 'portable', 'flat', 'app', 'display'],
  Pizza:      ['dough', 'sauce', 'mozzarella', 'slice', 'crust', 'oven'],
  Burger:     ['bun', 'patty', 'grill', 'ketchup', 'sesame', 'beef', 'fries'],
  Ocean:      ['waves', 'salt', 'vast', 'deep', 'marine', 'tide', 'endless'],
  Lake:       ['freshwater', 'calm', 'fishing', 'shore', 'still', 'pond', 'swim'],
  Camera:     ['lens', 'shutter', 'aperture', 'focus', 'pixel', 'capture'],
  Telescope:  ['lens', 'stars', 'optical', 'distant', 'magnify', 'astronomy'],
  Guitar:     ['strings', 'frets', 'acoustic', 'chord', 'pluck', 'strum'],
  Violin:     ['bow', 'strings', 'classical', 'bridge', 'rosin', 'quartet'],
  Shark:      ['fins', 'predator', 'teeth', 'ocean', 'gill', 'attack', 'apex'],
  Dolphin:    ['smart', 'sonar', 'pod', 'playful', 'fin', 'mammal'],
  Democracy:  ['vote', 'freedom', 'election', 'citizen', 'ballot', 'majority'],
  Republic:   ['constitution', 'senate', 'civic', 'federal', 'law', 'govern'],
  River:      ['current', 'bank', 'flow', 'delta', 'tributary', 'boat'],
  Stream:     ['brook', 'babble', 'clear', 'forest', 'pebble', 'small'],
  Mountain:   ['peak', 'summit', 'snow', 'rocky', 'elevation', 'trail', 'climb'],
  Volcano:    ['lava', 'eruption', 'magma', 'ash', 'crater', 'hot', 'explosive'],
  Theory:     ['idea', 'proof', 'evidence', 'model', 'science', 'test'],
  Hypothesis: ['experiment', 'predict', 'assume', 'test', 'variable', 'trial'],
  Painting:   ['canvas', 'brushstroke', 'oil', 'gallery', 'palette', 'frame'],
  Drawing:    ['pencil', 'sketch', 'line', 'paper', 'graphite', 'outline'],
  Hurricane:  ['wind', 'spiral', 'category', 'tropical', 'flooding', 'coast'],
  Tornado:    ['funnel', 'vortex', 'twister', 'violent', 'midwest', 'spin'],
};

async function seedData() {
    try {
        console.log('Creating tables if not exist...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS word_pairs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                innocent_word VARCHAR(100) NOT NULL,
                imposter_word VARCHAR(100) NOT NULL,
                difficulty ENUM('easy', 'medium', 'hard') NOT NULL
            )
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS cpu_clues (
                id INT AUTO_INCREMENT PRIMARY KEY,
                word VARCHAR(100) NOT NULL,
                clue VARCHAR(100) NOT NULL,
                INDEX idx_cpu_clues_word (word)
            )
        `);

        console.log('Seeding word_pairs...');
        for (const wp of WORD_PAIRS) {
            await db.execute(
                'INSERT INTO word_pairs (innocent_word, imposter_word, difficulty) VALUES (?, ?, ?)',
                [wp.i, wp.m, wp.d]
            );
        }
        console.log('Word pairs seeded.');

        console.log('Seeding cpu_clues...');
        for (const [word, clues] of Object.entries(CPU_CLUES)) {
            for (const clue of clues) {
                await db.execute(
                    'INSERT INTO cpu_clues (word, clue) VALUES (?, ?)',
                    [word, clue]
                );
            }
        }
        console.log('CPU clues seeded.');

        console.log('Seeding complete. Exiting.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
