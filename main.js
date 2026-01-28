

class CoinFlipGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.initialBalance = 1000;
    this.balance = this.initialBalance;
    this.history = [];

    this.shadowRoot.innerHTML = `
              <style>
                :host { 
                  --primary-color: #00ffc3; --text-color: #f0f0f0; --error-color: #ff4757;
                  --success-color: #2ed573; --surface-color-darker: #1e1e1e; --border-radius: 12px;
                }
                .game-container { 
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 24px;
                }
                .controls { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 300px; }
                .control-group { display: flex; flex-direction: column; }
                label { margin-bottom: 8px; font-size: 0.9em; color: var(--text-color); }
                input { padding: 12px; border: 1px solid #444; border-radius: var(--border-radius); background-color: var(--surface-color-darker); color: var(--text-color); font-size: 1em; }
                .coin-container {
                  width: 150px;
                  height: 150px;
                  perspective: 1000px;
                  cursor: pointer;
                }
                .coin {
                  width: 100%;
                  height: 100%;
                  position: relative;
                  transform-style: preserve-3d;
                  transition: transform 0.6s ease-out;
                }
                .coin.flipping {
                  animation: coin-flip 0.6s forwards;
                }
                .heads, .tails {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  backface-visibility: hidden;
                  border-radius: 50%;
                  background-size: cover;
                  background-position: center;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 2em;
                  font-weight: bold;
                  color: #fff;
                  border: 4px solid #ffcc00;
                }
                .heads {
                  background-image: url('https://upload.wikimedia.org/wikipedia/commons/2/2f/Indian_5_Rupee_Coin.png');
                  background-color: #ffcc00;
                }
                .tails {
                  background-image: url('https://upload.wikimedia.org/wikipedia/commons/3/30/Coin-back.png');
                  background-color: #cccccc;
                  transform: rotateY(180deg);
                }
                @keyframes coin-flip {
                  0% { transform: rotateY(0deg); }
                  100% { transform: rotateY(1800deg); } /* 5 full rotations */
                }
                .coin-result {
                  text-align: center;
                  font-size: 1.8em;
                  font-weight: bold;
                  color: var(--primary-color);
                  min-height: 1.5em;
                }
                .history { margin-top: 20px; width: 100%; max-width: 300px; }
                .history h3 { margin-top: 0; text-align: center; }
                .history-list { list-style: none; padding: 0; margin: 0; max-height: 150px; overflow-y: auto; }
                .history-item { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #333; }
                .history-item.win .amount { color: var(--success-color); }
                .history-item.loss .amount { color: var(--error-color); }
              </style>
      <div class="game-container">
        <div class="controls">
          <div class="control-group"><label for="bet-amount">Bet Amount</label><input type="number" id="bet-amount" value="10" /></div>
          <div class="control-group"><label for="leverage">Leverage</label><input type="number" id="leverage" value="1" min="1" max="100" /></div>
        </div>
        <div class="coin-container" id="coin-container">
          <div class="coin" id="coin">
            <div class="heads"></div>
            <div class="tails"></div>
          </div>
        </div>
        <div class="coin-result" id="result-display">Click the coin to flip!</div>
        <div class="history">
          <h3>History</h3>
          <ul class="history-list" id="history-list"></ul>
        </div>
      </div>
    `;

    this.balanceElement = document.getElementById('balance-amount');
    // Remove earnings elements as they are no longer relevant for a simple coin flip
    // this.upEarningsElement = document.getElementById('up-earnings');
    // this.downEarningsElement = document.getElementById('down-earnings');

    // Load coin sound effect
    this.coinSound = new Audio('./audio/pickupCoin.wav'); // Using the local sound effect provided by the user
  }

  connectedCallback() {
    this.coin = this.shadowRoot.getElementById('coin');
    this.coin.addEventListener('click', () => this.flipCoin());
    this.updateBalanceDisplay();
  }

  updateBalanceDisplay() {
    if (this.balanceElement) this.balanceElement.textContent = `$${this.balance.toLocaleString()}`;
  }

  flipCoin() {
    const betAmountInput = this.shadowRoot.getElementById('bet-amount');
    const leverageInput = this.shadowRoot.getElementById('leverage');
    const resultDisplay = this.shadowRoot.getElementById('result-display');
    const coin = this.shadowRoot.getElementById('coin');

    const betAmount = parseFloat(betAmountInput.value);
    const leverage = parseFloat(leverageInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
      resultDisplay.textContent = "Invalid bet amount!";
      resultDisplay.style.color = 'var(--error-color)';
      return;
    }
    if (betAmount * leverage > this.balance) {
      resultDisplay.textContent = "Not enough balance for this bet and leverage!";
      resultDisplay.style.color = 'var(--error-color)';
      return;
    }

    // Disable coin click during flip
    coin.style.pointerEvents = 'none';
    resultDisplay.textContent = 'Flipping...';
    resultDisplay.style.color = 'var(--primary-color)';

    // Play coin flip sound
    this.coinSound.currentTime = 0; // Rewind to start
    this.coinSound.play().catch(e => console.error("Error playing sound:", e));

    // Reset coin rotation (initial state for animation)
    coin.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(0px) scale(1)'; // Set explicitly for reset
    coin.classList.remove('heads-up', 'tails-up');

    // Trigger animation
    coin.classList.add('flipping');

    // Determine flip outcome immediately
    const isHeads = Math.random() < 0.5; // True for heads, false for tails
    let resultText, resultColor, historyItem;
    const effectiveBet = betAmount * leverage;
    const winningSide = 'heads'; // Assuming 'heads' is the winning outcome for now.

    if ((isHeads && winningSide === 'heads') || (!isHeads && winningSide === 'tails')) {
      this.balance += effectiveBet;
      resultText = `It's ${isHeads ? 'Heads' : 'Tails'}! You won $${effectiveBet.toLocaleString()}!`;
      resultColor = 'var(--success-color)';
      historyItem = { outcome: 'win', amount: `+$${effectiveBet.toLocaleString()}`, choice: isHeads ? 'HEADS' : 'TAILS' };
    } else {
      this.balance -= effectiveBet;
      resultText = `It's ${isHeads ? 'Heads' : 'Tails'}! You lost $${effectiveBet.toLocaleString()}!`;
      resultColor = 'var(--error-color)';
      historyItem = { outcome: 'loss', amount: `-$${effectiveBet.toLocaleString()}`, choice: isHeads ? 'HEADS' : 'TAILS' };
    }

    if (this.balance <= 0) {
      this.balance = 0;
      resultText += ' You are liquidated!';
    }

    // Display results immediately
    resultDisplay.textContent = resultText;
    resultDisplay.style.color = resultColor;
    this.history.unshift(historyItem);
    if (this.history.length > 10) this.history.pop();
    this.updateHistoryList();
    this.updateBalanceDisplay();

    // The animation will play out visually
    setTimeout(() => {
      coin.classList.remove('flipping'); // Remove animation class after visual animation
      // Visually set the coin to the determined outcome
      if (!isHeads) {
        coin.classList.add('tails-up');
      } else {
        coin.classList.remove('tails-up'); // Ensure it's not present if heads
      }
      coin.style.pointerEvents = 'auto'; // Re-enable coin click
    }, 1500); // Duration of the CSS animation (1.5s)
  }

  updateHistoryList() {
    const historyList = this.shadowRoot.getElementById('history-list');
    historyList.innerHTML = '';
    for (const item of this.history) {
      const li = document.createElement('li');
      li.classList.add('history-item', item.outcome);
      li.innerHTML = `<span>Result: ${item.choice}</span><span class="amount">${item.amount}</span>`;
      historyList.appendChild(li);
    }
  }
}

customElements.define('coin-flip-game', CoinFlipGame);
