import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, onSnapshot, updateDoc, increment, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// TODO: Replace with your project's actual Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const globalEarningsRef = doc(db, 'earnings', 'global_earnings');

class CoinFlipGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.initialBalance = 1000;
    this.balance = this.initialBalance;
    this.history = [];
    this.stats = this.loadStats();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #00ffc3;
          --text-color: #f0f0f0;
          --error-color: #ff4757;
          --success-color: #2ed573;
          --surface-color-darker: #1e1e1e;
          --border-radius: 12px;
        }
        
        @keyframes result-pop {
          0% { transform: scale(0.8); opacity: 0; }
          80% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .game-container {
          display: grid;
          gap: 24px; /* Increased gap */
          grid-template-areas:
            "controls"
            "actions"
            "result"
            "stats" /* New stats area */
            "history";
        }
        .controls {
          grid-area: controls;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 8px;
          font-size: 0.9em;
          color: var(--text-color);
        }
        input {
          padding: 12px;
          border: 1px solid #444;
          border-radius: var(--border-radius);
          background-color: var(--surface-color-darker);
          color: var(--text-color);
          font-size: 1em;
        }
        .actions {
          grid-area: actions;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        button {
          padding: 16px;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1.2em;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.3s ease;
        }
        button:active {
          transform: scale(0.98);
        }
        #up-button {
          background-color: var(--success-color);
          color: #111;
          box-shadow: 0 0 20px var(--success-color);
        }
        #down-button {
          background-color: var(--error-color);
          color: #111;
          box-shadow: 0 0 20px var(--error-color);
        }
        .result {
          grid-area: result;
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column; /* Allow content to stack */
          gap: 10px; /* Space between text and button */
        }
        .result.pop {
          animation: result-pop 0.4s ease-out;
        }
        #reset-button {
            display: none; /* Hidden by default */
            background-color: var(--primary-color);
            color: #111;
            font-size: 1em;
            padding: 10px 20px;
        }
        #reset-button.visible {
            display: block; /* Show when balance is zero */
        }
        .stats {
            grid-area: stats;
            background-color: var(--surface-color-darker);
            padding: 16px;
            border-radius: var(--border-radius);
        }
        .stats h3 {
            margin: 0 0 10px 0;
            text-align: center;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            text-align: center;
        }
        .stats-item p {
            margin: 0;
            font-size: 0.9em;
            color: #ccc;
        }
        .stats-item span {
            font-size: 1.1em;
            font-weight: bold;
        }
        .stats-item.up-stats span {
            color: var(--success-color);
        }
        .stats-item.down-stats span {
            color: var(--error-color);
        }

        .history {
            grid-area: history;
        }
        .history h3 {
            margin-top: 0;
        }
        .history-list {
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 150px;
            overflow-y: auto;
        }
        .history-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid #333;
        }
        .history-item.win .amount {
            color: var(--success-color);
        }
        .history-item.loss .amount {
            color: var(--error-color);
        }
      </style>

      <div class="game-container">
        <div class="controls">
          <div class="control-group">
            <label for="bet-amount">Bet Amount</label>
            <input type="number" id="bet-amount" value="10" />
          </div>
          <div class="control-group">
            <label for="leverage">Leverage</label>
            <input type="number" id="leverage" value="1" min="1" max="100" />
          </div>
        </div>

        <div class="actions">
          <button id="up-button">Up</button>
          <button id="down-button">Down</button>
        </div>

        <div class="result" id="result-display">
            <span id="result-text"></span>
            <button id="reset-button">Get Initial Balance</button>
        </div>

        <div class="stats" id="stats-container">
            <h3>My Stats</h3>
            <div class="stats-grid">
                <div class="stats-item up-stats">
                    <p>Up Win %</p>
                    <span id="up-win-rate">0%</span>
                </div>
                <div class="stats-item down-stats">
                    <p>Down Win %</p>
                    <span id="down-win-rate">0%</span>
                </div>
            </div>
        </div>
        
        <div class="history">
            <h3>History</h3>
            <ul class="history-list" id="history-list">
            </ul>
        </div>
      </div>
    `;

    this.balanceElement = document.getElementById('balance-amount');
    this.upEarningsElement = document.getElementById('up-earnings-amount');
    this.downEarningsElement = document.getElementById('down-earnings-amount');
  }

  connectedCallback() {
    this.shadowRoot.getElementById('up-button').addEventListener('click', () => this.handleFlip('up'));
    this.shadowRoot.getElementById('down-button').addEventListener('click', () => this.handleFlip('down'));
    
    const resetButton = this.shadowRoot.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => this.resetGame());
    }

    this.updateBalanceDisplay();
    this.setupRealtimeEarningsListener();
  }

  updateBalanceDisplay() {
      if (this.balanceElement) {
        this.balanceElement.textContent = `$${this.balance.toLocaleString()}`;
      }
  }

  async setupRealtimeEarningsListener() {
    onSnapshot(globalEarningsRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.upEarningsElement.textContent = `$${(data.up_earnings || 0).toLocaleString()}`;
        this.downEarningsElement.textContent = `$${(data.down_earnings || 0).toLocaleString()}`;
      } else {
        // Document doesn't exist, create it with initial values
        await setDoc(globalEarningsRef, {
          up_earnings: 0,
          down_earnings: 0
        });
        this.upEarningsElement.textContent = '$0';
        this.downEarningsElement.textContent = '$0';
      }
    });
  }

  async updateGlobalEarnings(type, amount) {
    if (type === 'up') {
      await updateDoc(globalEarningsRef, {
        up_earnings: increment(amount)
      });
    } else if (type === 'down') {
      await updateDoc(globalEarningsRef, {
        down_earnings: increment(amount)
      });
    }
  }

  handleFlip(choice) {
    const betAmountInput = this.shadowRoot.getElementById('bet-amount');
    const leverageInput = this.shadowRoot.getElementById('leverage');
    const resultDisplay = this.shadowRoot.getElementById('result-display');

    const betAmount = parseFloat(betAmountInput.value);
    const leverage = parseFloat(leverageInput.value);
    
    resultDisplay.classList.remove('pop');

    if (isNaN(betAmount) || betAmount <= 0) {
      resultDisplay.textContent = "Invalid bet amount!";
      resultDisplay.style.color = 'orange';
      return;
    }
    if (betAmount > this.balance) {
      resultDisplay.textContent = "Not enough balance!";
      resultDisplay.style.color = 'orange';
      return;
    }
    
    const outcome = Math.random() < 0.5 ? 'up' : 'down';
    const isWin = choice === outcome;
    const changeAmount = betAmount * leverage;

    let resultText;
    let resultColor;
    let historyItem;

    if (isWin) {
      this.balance += changeAmount;
      resultText = `You won ${changeAmount.toLocaleString()}!`;
      resultColor = 'var(--success-color)';
      historyItem = { outcome: 'win', amount: `+${changeAmount.toLocaleString()}`, choice: choice.toUpperCase() };
    } else {
      this.balance -= changeAmount;
      resultText = `You lost ${changeAmount.toLocaleString()}!`;
      resultColor = 'var(--error-color)';
      historyItem = { outcome: 'loss', amount: `-${changeAmount.toLocaleString()}`, choice: choice.toUpperCase() };
    }

    if (this.balance <= 0) {
        this.balance = 0;
        resultText += ' You are liquidated!';
    }
    
    resultDisplay.textContent = resultText;
    resultDisplay.style.color = resultColor;
    resultDisplay.classList.add('pop');
    
    this.history.unshift(historyItem);
    if(this.history.length > 10) {
        this.history.pop();
    }
    
    this.updateHistoryList();
    this.updateBalanceDisplay();
    // Update global earnings in Firestore
    this.updateGlobalEarnings(choice, changeAmount);
  }

  resetGame() {
      this.balance = this.initialBalance;
      this.history = []; // Clear history on reset
      this.stats = { upWins: 0, upLosses: 0, downWins: 0, downLosses: 0 }; // Reset stats
      this.saveStats();
      this.updateBalanceDisplay();
      this.updateHistoryList();
      this.updateStatsDisplay();
      this.shadowRoot.getElementById('reset-button').classList.remove('visible');
      this.shadowRoot.getElementById('result-text').textContent = "Balance restored!";
      // Also clear any result message and color
      this.shadowRoot.getElementById('result-text').style.color = '';
  }

  loadStats() {
      const storedStats = localStorage.getItem('coinFlipStats');
      return storedStats ? JSON.parse(storedStats) : { upWins: 0, upLosses: 0, downWins: 0, downLosses: 0 };
  }

  saveStats() {
      localStorage.setItem('coinFlipStats', JSON.stringify(this.stats));
  }

  updateStatsDisplay() {
      const upWinRateElement = this.shadowRoot.getElementById('up-win-rate');
      const downWinRateElement = this.shadowRoot.getElementById('down-win-rate');

      const totalUpBets = this.stats.upWins + this.stats.upLosses;
      const upWinRate = totalUpBets === 0 ? 0 : (this.stats.upWins / totalUpBets) * 100;
      upWinRateElement.textContent = `${upWinRate.toFixed(1)}%`;

      const totalDownBets = this.stats.downWins + this.stats.downLosses;
      const downWinRate = totalDownBets === 0 ? 0 : (this.stats.downWins / totalDownBets) * 100;
      downWinRateElement.textContent = `${downWinRate.toFixed(1)}%`;
  }

  updateHistoryList() {
    const historyList = this.shadowRoot.getElementById('history-list');
    historyList.innerHTML = '';
    for(const item of this.history) {
        const li = document.createElement('li');
        li.classList.add('history-item', item.outcome);
        li.innerHTML = `
            <span>Chose: ${item.choice}</span>
            <span class="amount">${item.amount}</span>
        `;
        historyList.appendChild(li);
    }
  }
}

customElements.define('coin-flip-game', CoinFlipGame);