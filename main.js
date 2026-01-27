class CoinFlipGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.balance = 1000;
    this.history = [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #00ffc3;
          --text-color: #f0f0f0;
          --error-color: #ff4757;
          --success-color: #2ed573;
          --surface-color-darker: #1e1e1e;
          --border-radius: 12px; /* Increased border-radius */
        }
        
        @keyframes result-pop {
          0% { transform: scale(0.8); opacity: 0; }
          80% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .game-container {
          display: grid;
          gap: 20px;
          grid-template-areas:
            "controls"
            "actions"
            "result"
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
        }
        .result.pop {
          animation: result-pop 0.4s ease-out;
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

        <div class="result" id="result-display"></div>
        
        <div class="history">
            <h3>History</h3>
            <ul class="history-list" id="history-list">
            </ul>
        </div>
      </div>
    `;

    this.balanceElement = document.getElementById('balance-amount');
  }

  connectedCallback() {
    this.shadowRoot.getElementById('up-button').addEventListener('click', () => this.handleFlip('up'));
    this.shadowRoot.getElementById('down-button').addEventListener('click', () => this.handleFlip('down'));
    this.updateBalanceDisplay();
  }

  updateBalanceDisplay() {
      if (this.balanceElement) {
        this.balanceElement.textContent = `${this.balance.toLocaleString()}`;
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