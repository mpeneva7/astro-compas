const IMAGE_BASE = 'assets/tarot-images/';

// Карт-ID към filename маппинг
const CARD_MAPPING = {
  // Мажорни аркани (0-21)
  'major-0': '0 - The Fool_enhanced Medium.jpeg',
  'major-1': '1 - The Magician_enhanced Medium.jpeg',
  'major-2': '2 - The High Priestess_enhanced Medium.jpeg',
  'major-3': '3 - The Empress_enhanced Medium.jpeg',
  'major-4': '4 - The Emperor_enhanced Medium.jpeg',
  'major-5': '5 - The Hierophant_enhanced Medium.jpeg',
  'major-6': '6 - The Lovers_enhanced Medium.jpeg',
  'major-7': '7 - The Chariot_enhanced Medium.jpeg',
  'major-8': '8 - Strength_enhanced Medium.jpeg',
  'major-9': '9 - The Hermit_enhanced Medium.jpeg',
  'major-10': '10 - Wheel of Fortune_enhanced Medium.jpeg',
  'major-11': '11 - Justice_enhanced Medium.jpeg',
  'major-12': '12 - The Hanged Man_enhanced Medium.jpeg',
  'major-13': '13 - Death_enhanced Medium.jpeg',
  'major-14': '14 - Temperance_enhanced Medium.jpeg',
  'major-15': '15 - The Devil_enhanced Medium.jpeg',
  'major-16': '16 - The Tower_enhanced Medium.jpeg',
  'major-17': '17 - The Star_enhanced Medium.jpeg',
  'major-18': '18 - The Moon_enhanced Medium.jpeg',
  'major-19': '19 - The Sun_enhanced Medium.jpeg',
  'major-20': '20 - Judgement_enhanced Medium.jpeg',
  'major-21': '21 - The World_enhanced Medium.jpeg',

  // Червата (Cups) - 1-13 = Ace-King
  'cups-0': '1 - Ace of Cups_enhanced Medium.jpeg',
  'cups-1': '2 - Two of Cups_enhanced Medium.jpeg',
  'cups-2': '3 - Three of Cups_enhanced Medium.jpeg',
  'cups-3': '4 - Four of Cups_enhanced Medium.jpeg',
  'cups-4': '5 - Five of Cups_enhanced Medium.jpeg',
  'cups-5': '6 - Six of Cups_enhanced Medium.jpeg',
  'cups-6': '7 - Seven of Cups_enhanced Medium.jpeg',
  'cups-7': '8 - Eight of Cups_enhanced Medium.jpeg',
  'cups-8': '9 - Nine of Cups_enhanced Medium.jpeg',
  'cups-9': '10 - Ten of Cups_enhanced Medium.jpeg',
  'cups-10': 'Page of Cups_enhanced Medium.jpeg',
  'cups-11': 'Knight of Cups_enhanced Medium.jpeg',
  'cups-12': 'Queen of Cups_enhanced Medium.jpeg',
  'cups-13': 'King of Cups_enhanced Medium.jpeg',

  // Мечове (Wands) - 1-13 = Ace-King
  'wands-0': '1 - Ace of Wands_enhanced Medium.jpeg',
  'wands-1': '2 - Two of Wands_enhanced Medium.jpeg',
  'wands-2': '3 - Three of Wands_enhanced Medium.jpeg',
  'wands-3': '4 - Four of Wands_enhanced Medium.jpeg',
  'wands-4': '5 - Five of Wands_enhanced Medium.jpeg',
  'wands-5': '6 - Six of Wands_enhanced Medium.jpeg',
  'wands-6': '7 - Seven of Wands_enhanced Medium.jpeg',
  'wands-7': '8 - Eight of Wands_enhanced Medium.jpeg',
  'wands-8': '9 - Nine of Wands_enhanced Medium.jpeg',
  'wands-9': '10 - Ten of Wands_enhanced Medium.jpeg',
  'wands-10': 'Page of Wands_enhanced Medium.jpeg',
  'wands-11': 'Knight of Wands_enhanced Medium.jpeg',
  'wands-12': 'Queen of Wands_enhanced Medium.jpeg',
  'wands-13': 'King of Wands_enhanced Medium.jpeg',

  // Мечове (Swords) - 1-13 = Ace-King
  'swords-0': '1 - Ace of Swords_enhanced Medium.jpeg',
  'swords-1': '2 - Two of Swords_enhanced Medium.jpeg',
  'swords-2': '3 - Three of Swords_enhanced Medium.jpeg',
  'swords-3': '4 - Four of Swords_enhanced Medium.jpeg',
  'swords-4': '5 - Five of Swords_enhanced Medium.jpeg',
  'swords-5': '6 - Six of Swords_enhanced Medium.jpeg',
  'swords-6': '7 - Seven of Swords_enhanced Medium.jpeg',
  'swords-7': '8 - Eight of Swords_enhanced Medium.jpeg',
  'swords-8': '9 - Nine of Swords_enhanced Medium.jpeg',
  'swords-9': '10 - Ten of Swords_enhanced Medium.jpeg',
  'swords-10': 'Page of Swords_enhanced Medium.jpeg',
  'swords-11': 'Knight of Swords_enhanced Medium.jpeg',
  'swords-12': 'Queen of Swords_enhanced Medium.jpeg',
  'swords-13': 'King of Swords_enhanced Medium.jpeg',

  // Пентакли (Pentacles) - 1-13 = Ace-King
  'pentacles-0': '1 - Ace of Pentacles_enhanced Medium.jpeg',
  'pentacles-1': '2 - Two of Pentacles_enhanced Medium.jpeg',
  'pentacles-2': '3 - Three of Pentacles_enhanced Medium.jpeg',
  'pentacles-3': '4 - Four of Pentacles_enhanced Medium.jpeg',
  'pentacles-4': '5 - Five of Pentacles_enhanced Medium.jpeg',
  'pentacles-5': '6 - Six of Pentacles_enhanced Medium.jpeg',
  'pentacles-6': '7 - Seven of Pentacles_enhanced Medium.jpeg',
  'pentacles-7': '8 - Eight of Pentacles_enhanced Medium.jpeg',
  'pentacles-8': '9 - Nine of Pentacles_enhanced Medium.jpeg',
  'pentacles-9': '10 - Ten of Pentacles_enhanced Medium.jpeg',
  'pentacles-10': 'Page of Pentacles_enhanced Medium.jpeg',
  'pentacles-11': 'Knight of Pentacles_enhanced Medium.jpeg',
  'pentacles-12': 'Queen of Pentacles_enhanced Medium.jpeg',
  'pentacles-13': 'King of Pentacles_enhanced Medium.jpeg',
};

const CARD_NAMES = {
  'major-0': 'The Fool',
  'major-1': 'The Magician',
  'major-2': 'The High Priestess',
  'major-3': 'The Empress',
  'major-4': 'The Emperor',
  'major-5': 'The Hierophant',
  'major-6': 'The Lovers',
  'major-7': 'The Chariot',
  'major-8': 'Strength',
  'major-9': 'The Hermit',
  'major-10': 'Wheel of Fortune',
  'major-11': 'Justice',
  'major-12': 'The Hanged Man',
  'major-13': 'Death',
  'major-14': 'Temperance',
  'major-15': 'The Devil',
  'major-16': 'The Tower',
  'major-17': 'The Star',
  'major-18': 'The Moon',
  'major-19': 'The Sun',
  'major-20': 'Judgement',
  'major-21': 'The World',
};

const SUITS = ['cups', 'wands', 'swords', 'pentacles'];
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

// Генериране на всички карти с filename
function buildDeck() {
  const deck = [];

  // Мажорни аркани
  for (let i = 0; i <= 21; i++) {
    const id = `major-${i}`;
    deck.push({
      id,
      name: CARD_NAMES[id] || `Major ${i}`,
      suit: 'major',
      rank: i,
      filename: CARD_MAPPING[id]
    });
  }

  // Минорни аркани
  SUITS.forEach(suit => {
    for (let rank = 0; rank <= 13; rank++) {
      const id = `${suit}-${rank}`;
      const name = rank < 10 ? `${RANKS[rank]} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}` : `${RANKS[rank]} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;
      deck.push({
        id,
        name,
        suit,
        rank,
        filename: CARD_MAPPING[id]
      });
    }
  });

  return deck;
}

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Таро четене
let lastSpread = null;
let deck = buildDeck();

function drawThreeCards() {
  let candidates = shuffle(deck);

  // Гарантира три различни карти
  while (
    candidates[0].id === candidates[1].id ||
    candidates[0].id === candidates[2].id ||
    candidates[1].id === candidates[2].id
  ) {
    candidates = shuffle(deck);
  }

  // Избягва повторението на предишния спред
  if (lastSpread && (
    candidates[0].id === lastSpread[0].id ||
    candidates[1].id === lastSpread[1].id ||
    candidates[2].id === lastSpread[2].id
  )) {
    return drawThreeCards();
  }

  lastSpread = [candidates[0], candidates[1], candidates[2]];

  return lastSpread.map(card => ({
    ...card,
    reversed: Math.random() < 0.5
  }));
}

// SVG резервно изображение
function getEmblemSVG(suit) {
  const svgs = {
    cups: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 10 L20 20 Q16 24 16 30 Q16 40 32 48 Q48 40 48 30 Q48 24 44 20 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    wands: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="12" r="4" fill="currentColor"/></svg>',
    swords: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 8 L28 24 L16 32 L28 40 L32 56 L36 40 L48 32 L36 24 Z" fill="currentColor"/></svg>',
    pentacles: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="32,16 40,24 38,36 26,36 24,24" fill="currentColor"/></svg>',
    major: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 8 L48 24 L40 40 L24 40 L16 24 Z" fill="currentColor" opacity="0.3"/></svg>'
  };
  return svgs[suit] || svgs.major;
}

async function revealCard(cardElement, card) {
  const cardFront = cardElement.querySelector('.card__front');
  const img = document.createElement('img');
  img.src = IMAGE_BASE + card.filename;
  img.alt = card.name + (card.reversed ? ' reversed' : '');

  // Декодира изображението преди да го покаже
  try {
    await img.decode();
    cardFront.innerHTML = '';
    cardFront.appendChild(img);
  } catch (err) {
    console.log(`Failed to load image for ${card.id}, using SVG fallback`);
    const emblemDiv = document.createElement('div');
    emblemDiv.className = 'card__emblem';
    emblemDiv.innerHTML = getEmblemSVG(card.suit);
    cardFront.innerHTML = '';
    cardFront.appendChild(emblemDiv);
  }

  // Отива да rotira картата
  if (card.reversed) {
    img.style.transform = 'rotate(180deg)';
  }

  cardElement.classList.add('is-revealed');
}

async function showSpread() {
  const cards = drawThreeCards();
  const cardElements = document.querySelectorAll('.tarot .card');

  // Декодира всички изображения преди да ги покаже
  for (let i = 0; i < 3; i++) {
    const cardElement = cardElements[i];
    const card = cards[i];

    cardElement.classList.remove('is-revealed');

    // Закъсни 140ms между картите
    setTimeout(async () => {
      await revealCard(cardElement, card);
    }, i * 140);
  }

  // Актуализира информацията за картите
  setTimeout(() => {
    document.getElementById('tarot-meanings').innerHTML = cards.map((card, idx) => `
      <div class="tarot-meaning">
        <h4>${card.name}</h4>
        <p>${card.reversed ? 'Обърната' : 'Изправена'}</p>
      </div>
    `).join('');
  }, 500);
}

// Инициализирай tarot интерфейса
window.initTarot = function() {
  const drawBtn = document.getElementById('tarot-draw-btn');
  if (drawBtn) {
    drawBtn.addEventListener('click', showSpread);
    showSpread(); // Първоначално четене
  }
};
