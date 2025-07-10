const cardsArray = ['🍎','🍌','🍇','🍓','🍒','🥝','🍍','🥭'];
let cards = [...cardsArray, ...cardsArray];  //duplicate for pairs
let moves = 0, flippedCards = [], matched = 0, timer = 0, interval;
let lockBoard = false;

const board = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const winMessage = document.getElementById('win-message');
const themeBtn = document.getElementById('toggle-theme');

//Sound effects
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const winSound = new Audio('sounds/win.mp3');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerEl.textContent = `Time: ${timer}s`;
    }, 1000);
}

function generateBoard() {
    board.innerHTML = '';
    cards = shuffle(cards);
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="card-inner" data-index ="${index}">
        <div class="card-front">?</div>
        <div class="card-back">${icon}</div>
        <div class="celebration">🎉</div>
        </div>`;
        board.appendChild(card);
    });
}

function flipCard(cardEl) {
    if (
        lockBoard ||
        flippedCards.includes(cardEl) ||
        cardEl.parentElement.classList.contains('flipped')
    ) return;

    cardEl.parentElement.classList.add('flipped');

    //play flip sound
    flipSound.play();

    flippedCards.push(cardEl);

    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = `Moves: ${moves}`;
        lockBoard = true;
        checkMatch();
    }
}

function updateStars() {
            const starsEl = document.getElementById('stars');
            if (moves > 18) {
                starsEl.textContent = '⭐️';
            } else if (moves > 12) {
                starsEl.textContent = '⭐️⭐️';
            } else {
                starEl.textContent = '⭐️⭐️⭐️';
            }
        }
function checkMatch() {
    const [first, second] = flippedCards;
    const val1 = first.querySelector('.card-back').textContent;
    const val2 = second.querySelector('.card-back').textContent;

    if (val1 === val2) {
        //play match sound
        matchSound.play();

        //add bounce animation to matched cards
        first.parentElement.classList.add('matched');
        second.parentElement.classList.add('matched');

        setTimeout(() => {
            first.parentElement.classList.remove('matched');
            second.parentElement.classList.remove('matched');
        }, 800);

        matched ++;
        flippedCards = [];
        lockBoard = false;

        if (matched === cardsArray.length) {
            clearInterval(interval);

            //play win sound
            winSound.play();

            //confetti effect
            confetti({
                particleCount: 200,
                spread: 70,
                origin: {y: 0.6}
            });


            setTimeout(() => {
                winMessage.style.display = 'block';
                setTimeout(() => {
                    restartGame();
                }, 3000);  
            }, 500);
        }
    } else {
        //play wrong sound
        wrongSound.play();

        setTimeout(() => {
            first.parentElement.classList.remove('flipped');
            second.parentElement.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 800);
    }
}

board.addEventListener('click', e => {
    const cardEl = e.target.closest('.card-inner');
    if (cardEl) flipCard(cardEl);
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

function restartGame() {
    moves = 0;
    matched = 0;
    timer = 0;
    flippedCards = [];
    lockBoard = false;

    clearInterval(interval);
    movesEl.textContent = 'Moves: 0';
    timerEl.textContent = 'Time: 0s';
    winMessage.style.display = 'none';

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('flipped','matched',);
    });
    
    generateBoard();
    startTimer();
}

window.onload = () => {
    generateBoard();
    startTimer();
};