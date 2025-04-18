document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer;
    let seconds = 0;
    let matchedPairs = 0;

    // DOM Elements
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalTimeDisplay = document.getElementById('final-time');
    const playAgainButton = document.getElementById('play-again');

    // Icons for cards (Font Awesome)
    const icons = [
        'fa-heart', 'fa-star', 'fa-cloud', 'fa-moon',
        'fa-sun', 'fa-tree', 'fa-car', 'fa-house'
    ];

    // Initialize game
    function initGame() {
        // Reset game state
        cards = [];
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        
        // Clear previous game
        gameBoard.innerHTML = '';
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '00:00';
        
        // Create cards
        const gameCards = [...icons, ...icons];
        shuffleArray(gameCards);
        
        // Generate card elements
        gameCards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card', 'h-24', 'md:h-32');
            card.dataset.icon = icon;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <i class="fas ${icon} text-white text-3xl md:text-4xl"></i>
                    </div>
                    <div class="card-back">
                        <i class="fas fa-question text-purple-600 text-3xl md:text-4xl"></i>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
        
        // Start timer
        startTimer();
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Flip card
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First card flip
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flip
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        
        checkForMatch();
    }

    // Check for match
    function checkForMatch() {
        const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Check for game completion
            if (matchedPairs === icons.length) {
                setTimeout(() => {
                    endGame();
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }

    // Unflip unmatched cards
    function unflipCards() {
        lockBoard = true;
        
        firstCard.classList.add('wrong-match');
        secondCard.classList.add('wrong-match');
        
        setTimeout(() => {
            firstCard.classList.remove('flipped', 'wrong-match');
            secondCard.classList.remove('flipped', 'wrong-match');
            
            resetBoard();
        }, 1000);
    }

    // Reset board state
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Timer functions
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    // End game
    function endGame() {
        stopTimer();
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timeDisplay.textContent;
        gameOverModal.classList.add('active');
    }

    // Event Listeners
    restartButton.addEventListener('click', () => {
        stopTimer();
        initGame();
    });

    playAgainButton.addEventListener('click', () => {
        gameOverModal.classList.remove('active');
        initGame();
    });

    // Start the game
    initGame();
}); 