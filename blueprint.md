# Blueprint

## Purpose and Capabilities

This project implements a Coin Flip Simulator web application. The application allows users to bet on "up" or "down" outcomes with adjustable bet amounts and leverage. It tracks individual game statistics, history, and, crucially, aggregates global "up" and "down" earnings across all users in real-time using Firebase Firestore. This provides a shared, live view of accumulated profits from up and down trades.

## Project Outline: Implemented Features

### Initial Version

*   **HTML Structure (`index.html`)**:
    *   Basic HTML5 document structure.
    *   Linked `style.css` for styling and `main.js` for functionality.
    *   Header with a title "Coin Flip Simulator" and a balance display (`#balance-amount`).
    *   Main section containing a custom Web Component `<coin-flip-game>`.
*   **CSS Styling (`style.css`)**:
    *   Basic global styles for `body`, `header`, `main`.
    *   Themed with CSS variables (`--background-color`, `--primary-color`, etc.).
    *   Responsive design considerations.
    *   Subtle noise texture background.
    *   Styling for balance display and a `result-pop` animation.
*   **JavaScript Functionality (`main.js`)**:
    *   Defined a `CoinFlipGame` Web Component (`<coin-flip-game>`).
    *   **Game Logic**:
        *   `constructor`: Initializes balance, history, and loads/saves stats from `localStorage`. Sets up the shadow DOM with game controls (bet amount, leverage), action buttons ("Up", "Down"), result display, personal stats, and game history.
        *   `connectedCallback`: Attaches event listeners for "Up" and "Down" buttons.
        *   `updateBalanceDisplay`: Updates the displayed user balance.
        *   `handleFlip`: Core game logic.
            *   Reads bet amount and leverage.
            *   Checks for valid bet and sufficient balance.
            *   Determines random "up" or "down" outcome.
            *   Calculates win/loss and updates user balance.
            *   Displays game result and applies a "pop" animation.
            *   Updates game history and personal stats.
        *   `resetGame`: Resets user balance, history, and personal stats.
        *   `loadStats`/`saveStats`: Manages personal game statistics in `localStorage`.
        *   `updateStatsDisplay`: Updates the displayed personal win rates for "Up" and "Down" trades.
        *   `updateHistoryList`: Renders the list of recent game outcomes.

### Current Version (Firebase Integration for Global Earnings)

*   **`index.html`**:
    *   **Firebase SDK Integration**: Added CDN links for Firebase App and Firestore SDKs.
    *   **Global Earnings Display**: Introduced new `div` elements within the `<header>` (`.earnings-display`, `.up-earnings`, `.down-earnings`) to show real-time accumulated "Up Earnings" and "Down Earnings".
*   **`main.js`**:
    *   **Firebase Imports**: Added imports for `initializeApp`, `getFirestore`, `doc`, `onSnapshot`, `updateDoc`, `increment`, `setDoc`.
    *   **Firebase Configuration**: Included a `firebaseConfig` object (with placeholder values that need to be updated by the user).
    *   **Firebase Initialization**: Initialized the Firebase app and Firestore database.
    *   **Global Earnings Reference**: Created a reference to a specific Firestore document (`earnings/global_earnings`) to store shared earnings data.
    *   **Real-time Earnings Listener (`setupRealtimeEarningsListener`)**:
        *   Uses `onSnapshot` to listen for real-time changes to the `global_earnings` document in Firestore.
        *   Updates the `up-earnings-amount` and `down-earnings-amount` display elements in `index.html` whenever the Firestore data changes.
        *   If the `global_earnings` document does not exist, it's created with initial values of 0 for both "up" and "down" earnings.
    *   **Global Earnings Update Function (`updateGlobalEarnings`)**:
        *   An `async` function that takes the `type` of trade ('up' or 'down') and the `amount` of change.
        *   Uses `updateDoc` and `increment` to atomically update the `up_earnings` or `down_earnings` field in the Firestore document, ensuring data consistency across users.
    *   **Integration with Game Logic**: Modified `handleFlip` to call `this.updateGlobalEarnings(choice, changeAmount)` after each trade, ensuring global earnings are updated with every bet.
    *   **Constructor Update**: Added references to the new `upEarningsElement` and `downEarningsElement` from the main document.
    *   **`connectedCallback` Update**: Called `this.setupRealtimeEarningsListener()` to activate real-time updates when the component connects.
*   **`style.css`**:
    *   **Earnings Display Styling**: Added CSS rules to style the new global earnings display elements in the header, using flexbox for layout and applying distinct success/error colors (`--success-color`, `--error-color`) for the earnings amounts to match the theme.

## Plan and Steps for Current Request

All requested changes have been implemented and pushed to the remote repository. The steps involved were:

1.  **Checked `mcp.json`**: Confirmed Firebase configuration was already present.
2.  **Modified `index.html`**: Added Firebase SDK scripts and new display elements for "Up Earnings" and "Down Earnings".
3.  **Modified `main.js`**: Integrated Firebase initialization, Firestore setup, real-time listener, and an earnings update function. This function was then integrated into the existing `handleFlip` game logic.
4.  **Modified `style.css`**: Added basic styling for the new earnings display elements in the header.
5.  **Managed Git**:
    *   Discovered `firebase-debug.log` and added it to a newly created `.gitignore`.
    *   Staged and committed all relevant file changes.
    *   Confirmed the remote repository (`origin`) was already configured.
    *   Pushed the committed changes to the `main` branch of the `https://github.com/Kimjjun430/coinflip` repository.

**Next Steps for the User**:

1.  **Update Firebase Configuration in `main.js`**: Replace the placeholder `firebaseConfig` values with your actual Firebase project credentials.
2.  **Enable Cloud Firestore**: Ensure Firestore is enabled in your Firebase project in the Firebase console.

Once these user-side configurations are complete, the application will fully leverage Firebase Firestore for real-time, shared accumulation of "up" and "down" earnings.