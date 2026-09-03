/* ═════════════════════════════════════════════════════════════ */
/* ТАРО КАРТОМАНТИЯ — КОНФИГУРАЦИЯ                              */
/* ═════════════════════════════════════════════════════════════ */

const IMAGE_BASE = 'assets/tarot-images/';
const IMAGE_EXT = '.png';

/* Ако си конвертирал файловете във .webp, променяй IMAGE_EXT на '.webp'
   Очакваното именуване на файлове:
   - major-00.png до major-21.png
   - wands-01.png до wands-14.png  (01=Ace, 11-14=Page/Knight/Queen/King)
   - същото за cups, swords, pentacles
*/

const CARD_NAMES = {
  'major-00': 'The Fool',
  'major-01': 'The Magician',
  'major-02': 'The High Priestess',
  'major-03': 'The Empress',
  'major-04': 'The Emperor',
  'major-05': 'The Hierophant',
  'major-06': 'The Lovers',
  'major-07': 'The Chariot',
  'major-08': 'Strength',
  'major-09': 'The Hermit',
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

function padZero(num) {
  return String(num).padStart(2, '0');
}

function buildDeck() {
  const deck = [];

  // Мажорни аркани (0-21)
  for (let i = 0; i <= 21; i++) {
    const id = `major-${padZero(i)}`;
    deck.push({
      id,
      name: CARD_NAMES[id] || `Major ${i}`,
      suit: 'major',
      rank: i,
      filename: `${id}${IMAGE_EXT}`
    });
  }

  // Минорни аркани
  SUITS.forEach(suit => {
    for (let rank = 1; rank <= 14; rank++) {
      const id = `${suit}-${padZero(rank)}`;
      const rankName = RANKS[rank - 1];
      const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
      deck.push({
        id,
        name: `${rankName} of ${suitName}`,
        suit,
        rank,
        filename: `${id}${IMAGE_EXT}`
      });
    }
  });

  return deck;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

let lastSpread = null;
let deck = buildDeck();

function drawThreeCards() {
  let candidates = shuffle(deck);

  while (
    candidates[0].id === candidates[1].id ||
    candidates[0].id === candidates[2].id ||
    candidates[1].id === candidates[2].id
  ) {
    candidates = shuffle(deck);
  }

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

async function revealCard(cardElement, card) {
  const cardFront = cardElement.querySelector('.card__front');
  const img = document.createElement('img');
  img.src = IMAGE_BASE + card.filename;
  img.alt = card.name + (card.reversed ? ' reversed' : '');

  try {
    await img.decode();
    cardFront.innerHTML = '';
    cardFront.appendChild(img);

    if (card.reversed) {
      img.style.transform = 'rotate(180deg)';
    }
  } catch (err) {
    console.log(`Failed to load ${card.filename}, using SVG fallback`);
    const emblemDiv = document.createElement('div');
    emblemDiv.className = 'card__emblem';
    emblemDiv.innerHTML = getEmblemSVG(card.suit);
    cardFront.innerHTML = '';
    cardFront.appendChild(emblemDiv);
  }

  cardElement.classList.add('is-revealed');
}

async function showSpread() {
  const cards = drawThreeCards();
  const cardElements = document.querySelectorAll('.tarot .card');

  for (let i = 0; i < 3; i++) {
    const cardElement = cardElements[i];
    const card = cards[i];

    cardElement.classList.remove('is-revealed');

    setTimeout(async () => {
      await revealCard(cardElement, card);
    }, i * 140);
  }

  setTimeout(() => {
    document.getElementById('tarot-meanings').innerHTML = cards.map((card) => `
      <div class="tarot-meaning">
        <h4>${card.name}</h4>
        <p>${card.reversed ? 'Обърната' : 'Изправена'}</p>
      </div>
    `).join('');
  }, 500);
}

window.initTarot = function() {
  const drawBtn = document.getElementById('tarot-draw-btn');
  if (drawBtn) {
    drawBtn.addEventListener('click', showSpread);
  }
};
