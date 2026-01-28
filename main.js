

class CoinFlipGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.initialBalance = 10000; // Updated initial balance
    // Load balance from localStorage, or use initialBalance if not found
    this.balance = parseFloat(localStorage.getItem('coinFlipBalance')) || this.initialBalance;
    this.history = [];
    this.dailyClaimsUsed = 0; // Initialize
    this.lastClaimDate = ''; // Initialize

    this.shadowRoot.innerHTML = `
                            <style>
                              :host {
                                /* Updated host variables for consistency with main style.css */
                                --background-color: #0d1117;
                                --surface-color: #161b22;
                                --primary-color: #28a745;
                                --secondary-color: #007bff;
                                --text-color: #c9d1d9;
                                --text-secondary: #8b949e;
                                --error-color: #d12d2d;
                                --success-color: #28a745;
                                --warning-color: #ffc107;
                                --border-color: #30363d;
                                --border-radius: 8px;
                                --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                                --shadow-dark: 0 4px 12px rgba(0, 0, 0, 0.4);
                                --shadow-light: 0 2px 6px rgba(0, 0, 0, 0.2);
                              }
                              .game-container {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                gap: 24px;
                                width: 100%;
                                max-width: 400px; /* Constrain width for better look */
                              }
                              .controls { display: flex; flex-direction: column; gap: 16px; width: 100%; }
                              .control-group { display: flex; flex-direction: column; }
                              label { margin-bottom: 8px; font-size: 0.9em; color: var(--text-secondary); }
                              input {
                                padding: 12px;
                                border: 1px solid var(--border-color);
                                border-radius: var(--border-radius);
                                background-color: #0d1117; /* Even darker input background */
                                color: var(--text-color);
                                font-size: 1em;
                                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
                              }
                              input:focus {
                                  outline: none;
                                  border-color: var(--primary-color);
                                  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.4);
                              }
                              /* Button styles consolidated with external style for consistency */
                              button {
                                border: none;
                                padding: 12px 24px;
                                border-radius: var(--border-radius);
                                font-size: 1em;
                                font-weight: bold;
                                cursor: pointer;
                                transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
                                box-shadow: var(--shadow-light);
                                margin-top: 20px; /* Apply margin to all buttons */
                              }
                              button:hover {
                                transform: translateY(-2px);
                                box-shadow: var(--shadow-dark);
                              }
                              button:active {
                                transform: translateY(0);
                                box-shadow: var(--shadow-light);
                              }
                              button:disabled {
                                background-color: #555;
                                cursor: not-allowed;
                                color: #bbb;
                                box-shadow: none;
                                transform: none;
                              }
              
                              .claim-button {
                                background-color: var(--primary-color);
                                color: var(--background-color);
                              }
                              .claim-button:hover {
                                background-color: #218838; /* Darker green on hover */
                              }
              
                              .coin-container {
                                width: 180px; /* Consistent with external CSS */
                                height: 180px;
                                perspective: 1200px; /* Consistent with external CSS */
                                margin: 30px auto;
                                cursor: pointer;
                              }
                              .coin {
                                width: 100%;
                                height: 100%;
                                position: relative;
                                transform-style: preserve-3d;
                                transition: transform 1.5s ease-out;
                              }
                              .coin.flipping {
                                animation: coin-flip 1.5s forwards;
                              }
                              .heads, .tails {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                backface-visibility: hidden;
                                border-radius: 50%;
                                background-size: cover;
                                background-position: center;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 2em;
                                font-weight: bold;
                                color: #fff;
                                border: 4px solid rgba(255, 215, 0, 0.7);
                              }
                              .heads {
                                background-image: url('https://upload.wikimedia.org/wikipedia/fr/d/d0/Dogecoin-logo.png'); /* Dogecoin Meme Coin image */
                                background-color: var(--warning-color); /* Use warning-color for vibrant gold */
                              }
                              .tails {
                                background-image: url('https://upload.wikimedia.org/wikipedia/commons/3/30/Coin-back.png');
                                background-color: #a0a0a0;
                                transform: rotateY(180deg);
                              }
                              @keyframes coin-flip {
                                0% {
                                  transform: perspective(1000px) rotateY(0deg) translateY(0px);
                                  animation-timing-function: ease-out;
                                }
                                25% {
                                  transform: perspective(1000px) rotateY(900deg) translateY(-100px) scale(1.05);
                                  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                                }
                                50% {
                                  transform: perspective(1000px) rotateY(1800deg) translateY(-150px) scale(1.1);
                                  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                                }
                                75% {
                                  transform: perspective(1000px) rotateY(2700deg) translateY(-50px) scale(1.05);
                                  animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
                                }
                                100% {
                                  transform: perspective(1000px) rotateY(3600deg) translateY(0px) scale(1);
                                  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
                                }
                              }
                              .coin-result {
                                text-align: center;
                                margin-top: 20px;
                                font-size: 2em;
                                font-weight: bold;
                                color: var(--primary-color);
                                min-height: 1.5em;
                                text-shadow: var(--shadow-light);
                              }
                              .history { margin-top: 20px; width: 100%; max-width: 300px; }
                              .history h3 { margin-top: 0; text-align: center; color: var(--text-secondary); }
                              .history-list {
                                list-style: none;
                                padding: 0;
                                margin: 0;
                                max-height: 150px;
                                overflow-y: auto;
                                border: 1px solid var(--border-color);
                                border-radius: var(--border-radius);
                                background-color: #0d1117;
                              }
                              .history-item {
                                display: flex;
                                justify-content: space-between;
                                padding: 8px 12px;
                                border-bottom: 1px solid var(--border-color);
                                font-size: 0.9em;
                              }
                              .history-item:last-child {
                                border-bottom: none;
                              }
                              .history-item.win .amount { color: var(--success-color); font-weight: bold; }
                              .history-item.loss .amount { color: var(--error-color); font-weight: bold; }
                            </style>
                    <div class="game-container">
        <div class="controls">
          <div class="control-group"><label for="bet-amount">베팅 금액</label><input type="number" id="bet-amount" value="10" /></div>
          <div class="control-group"><label for="leverage">레버리지</label><input type="number" id="leverage" value="1" min="1" max="100" /></div>
        </div>
        <div class="coin-container" id="coin-container">
          <div class="coin" id="coin">
            <div class="heads"></div>
            <div class="tails"></div>
          </div>
        </div>
        <div class="coin-result" id="result-display">코인을 클릭하여 플립하세요!</div>
        <div class="history">
          <h3>기록</h3>
          <ul class="history-list" id="history-list"></ul>
        </div>
        <button id="claim-button" class="claim-button">Claim Free Balance</button>
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
    this.claimButton = this.shadowRoot.getElementById('claim-button');
    this.claimButton.addEventListener('click', () => this.claimFreeBalance());
    this.loadFreeClaims(); // Load claims when component connects
    this.updateBalanceDisplay();
    this.updateClaimButton(); // Update button state
  }

  updateBalanceDisplay() {
    if (this.balanceElement) this.balanceElement.textContent = `$${this.balance.toLocaleString()}`;
  }

  getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  loadFreeClaims() {
    const storedClaims = localStorage.getItem('coinFlipDailyClaims');
    const storedDate = localStorage.getItem('coinFlipLastClaimDate');
    const today = this.getTodayDateString();

    if (storedDate === today) {
      this.dailyClaimsUsed = parseInt(storedClaims || '0', 10);
      this.lastClaimDate = storedDate;
    } else {
      // New day, reset claims
      this.dailyClaimsUsed = 0;
      this.lastClaimDate = today;
      this.saveFreeClaims();
    }
  }

  saveFreeClaims() {
    localStorage.setItem('coinFlipDailyClaims', this.dailyClaimsUsed.toString());
    localStorage.setItem('coinFlipLastClaimDate', this.lastClaimDate);
  }

  updateClaimButton() {
    const MIN_BALANCE_FOR_CLAIM = 1000;
    const MAX_CLAIMS = 3;
    if (this.claimButton) {
      if (this.balance >= MIN_BALANCE_FOR_CLAIM) {
        this.claimButton.disabled = true;
        this.claimButton.textContent = `잔액이 $${MIN_BALANCE_FOR_CLAIM} 이상입니다 (무료 지급 불가)`;
      } else if (this.dailyClaimsUsed >= MAX_CLAIMS) {
        this.claimButton.disabled = true;
        this.claimButton.textContent = '일일 무료 지급 횟수 소진';
      } else {
        this.claimButton.disabled = false;
        this.claimButton.textContent = `무료 $${this.initialBalance.toLocaleString()} 지급 (${MAX_CLAIMS - this.dailyClaimsUsed}회 남음) - (잔액 < $${MIN_BALANCE_FOR_CLAIM})`;
      }
    }
  }

  claimFreeBalance() {
    const MIN_BALANCE_FOR_CLAIM = 1000;
    const MAX_CLAIMS = 3;

    if (this.balance < MIN_BALANCE_FOR_CLAIM && this.dailyClaimsUsed < MAX_CLAIMS) {
      this.balance = this.initialBalance; // Reset to initial balance (10000)
      this.dailyClaimsUsed++;
      this.saveFreeClaims(); // Save updated claims
      this.saveBalance(); // Save updated balance
      this.updateBalanceDisplay();
      this.updateClaimButton();
      this.shadowRoot.getElementById('result-display').textContent = `무료 지급됨 ${this.initialBalance}! 잔액: $${this.balance.toLocaleString()}`;
      this.shadowRoot.getElementById('result-display').style.color = 'var(--success-color)';
    }
  }



  flipCoin() {
    const betAmountInput = this.shadowRoot.getElementById('bet-amount');
    const leverageInput = this.shadowRoot.getElementById('leverage');
    const resultDisplay = this.shadowRoot.getElementById('result-display');
    const coin = this.shadowRoot.getElementById('coin');

    const betAmount = parseFloat(betAmountInput.value);
    let leverage = parseFloat(leverageInput.value); // Changed to let

    if (isNaN(betAmount) || betAmount <= 0) {
      resultDisplay.textContent = "유효하지 않은 베팅 금액입니다!";
      resultDisplay.style.color = 'var(--error-color)';
      return;
    }
    // Enforce max leverage
    if (leverage > 100) {
      leverage = 100; // Cap leverage at 100
      leverageInput.value = '100'; // Update input field
      resultDisplay.textContent = "레버리지는 최대 100배로 제한됩니다!";
      resultDisplay.style.color = 'var(--error-color)';
    }
    if (betAmount * leverage > this.balance) {
      resultDisplay.textContent = "베팅 및 레버리지를 위한 잔액이 부족합니다!";
      resultDisplay.style.color = 'var(--error-color)';
      return;
    }

    // Disable coin click during flip
    coin.style.pointerEvents = 'none';
    resultDisplay.textContent = '플립 중...';
    resultDisplay.style.color = 'var(--primary-color)';

    // Play coin flip sound
    this.coinSound.currentTime = 0; // Rewind to start
    this.coinSound.play().catch(e => console.error("Error playing sound:", e));

    // Reset coin rotation (initial state for animation)
    coin.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(0px) scale(1)'; // Set explicitly for reset
    coin.classList.remove('heads-up', 'tails-up');

    // Trigger animation
    coin.classList.add('flipping');

    // Determine flip outcome (win/loss) based on random chance
    const didWinBet = Math.random() < 0.5; // True if the user wins the bet, false if they lose

    // Set coin's landing face based on win/loss: heads for win, tails for loss
    const isHeads = didWinBet; // If win, coin lands on heads (isHeads = true). If lose, coin lands on tails (isHeads = false).

    let resultText, resultColor, historyItem;
    const effectiveBet = betAmount * leverage;
    // The concept of 'winningSide' is now tied directly to the bet outcome, not a pre-chosen side.

          if (didWinBet) {
            this.balance += effectiveBet;
            resultText = `결과: 앞면! $${effectiveBet.toLocaleString()} 승리!`; // Explicitly '앞면' for win
            resultColor = 'var(--success-color)';
            historyItem = { outcome: 'win', amount: `+$${effectiveBet.toLocaleString()}`, choice: '앞면' };
            this.saveBalance(); // Save updated balance
        } else {
          this.balance -= effectiveBet;
          resultText = `결과: 뒷면! $${effectiveBet.toLocaleString()} 패배!`; // Explicitly '뒷면' for loss
          resultColor = 'var(--error-color)';
          historyItem = { outcome: 'loss', amount: `-$${effectiveBet.toLocaleString()}`, choice: '뒷면' };
          this.saveBalance(); // Save updated balance
        }
    
            if (this.balance <= 0) {
              this.balance = 0;
              resultText += ' 청산되었습니다!';
              this.saveBalance(); // Save updated balance
              this.updateClaimButton(); // Update claim button if liquidated
            }    
        // Display results immediately
        resultDisplay.textContent = resultText;
        resultDisplay.style.color = resultColor;
        this.history.unshift(historyItem);
        if (this.history.length > 10) this.history.pop();
        this.updateHistoryList();
        this.updateBalanceDisplay();
    
        // Clean up animation class after animation ends
        const handleAnimationEnd = () => {
          coin.classList.remove('flipping');
          // Explicitly set the final visual orientation
          if (isHeads) { // Win: Show heads
            coin.style.transform = 'perspective(1000px) rotateY(0deg)'; // Final state for heads
          } else { // Loss: Show tails
            coin.style.transform = 'perspective(1000px) rotateY(180deg)'; // Final state for tails
          }
          coin.style.pointerEvents = 'auto'; // Re-enable coin click
          coin.removeEventListener('animationend', handleAnimationEnd);
        };
        coin.addEventListener('animationend', handleAnimationEnd);
      }
    
      saveBalance() {
        localStorage.setItem('coinFlipBalance', this.balance.toString());
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
      }}

customElements.define('coin-flip-game', CoinFlipGame);
