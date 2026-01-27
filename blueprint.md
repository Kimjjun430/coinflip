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

### Current Version (Firebase Integration for Global Earnings & Coin Flip Animation)

*   **`index.html`**:
    *   **Firebase SDK Integration**: Added CDN links for Firebase App and Firestore SDKs.
    *   **Global Earnings Display**: Introduced new `div` elements within the `<header>` (`.earnings-display`, `.up-earnings`, `.down-earnings`) to show real-time accumulated "Up Earnings" and "Down Earnings".
*   **`main.js`**:
    *   **Firebase Imports**: Added imports for `initializeApp`, `getFirestore`, `doc`, `onSnapshot`, `updateDoc`, `increment`, `setDoc`, `getAuth`, `signInAnonymously`, `onAuthStateChanged`.
    *   **Firebase Configuration**: Included a `firebaseConfig` object (with placeholder values that need to be updated by the user).
    *   **Firebase Initialization**: Initialized the Firebase app, Auth, and Firestore database. Anonymous sign-in is implemented to provide a user for Firestore operations.
    *   **Global Earnings Reference**: Created a reference to a specific Firestore document (`earnings/global_earnings`) to store shared earnings data.
    *   **Real-time Earnings Listener (`setupRealtimeEarningsListener`)**:
        *   Uses `onSnapshot` to listen for real-time changes to the `global_earnings` document in Firestore.
        *   Updates the `up-earnings-amount` and `down-earnings-amount` display elements in `index.html` whenever the Firestore data changes.
        *   If the `global_earnings` document does not exist, it's created with initial values of 0 for both "up" and "down" earnings (requires authenticated user).
    *   **Global Earnings Update Function (`updateGlobalEarnings`)**:
        *   An `async` function that takes the `type` of trade ('up' or 'down'), `amount` of change, and `isWin` boolean.
        *   Uses `updateDoc` and `increment` to atomically update the `up_earnings` or `down_earnings` field in the Firestore document, ensuring data consistency across users. It now deducts losses from the respective earnings.
        *   Ensures user is authenticated before updating.
    *   **Coin Flip Animation Implementation**:
        *   **HTML Structure**: Replaced "Up" and "Down" buttons with a `<div id="coin">` structure containing `.face front` ("UP") and `.face back` ("DOWN") elements for visual flipping.
        *   **CSS Styling (within shadow DOM)**: Added comprehensive CSS for `.coin-container`, `.coin`, `.face` elements, including 3D transformations, perspectives, and `@keyframes spin-flip` for the animation.
        *   **JavaScript Logic**:
            *   `constructor`: Gets a reference to the `#coin` element.
            *   `connectedCallback`: Attaches an event listener to the `#coin` element to trigger the `startCoinFlip` method.
            *   `startCoinFlip()`: Orchestrates the coin flip animation.
                *   Validates bet amount and leverage.
                *   Disables coin clicks during animation.
                *   Adds a `flipping` CSS class to initiate the animation.
                *   Listens for `animationend` to determine the random `outcome` ('up' or 'down') once the animation finishes.
                *   Applies `heads` or `tails` CSS class to show the final state.
                *   Calls `processFlipResult()` to handle game logic.
                *   Re-enables coin clicks.
            *   `processFlipResult(outcome, betAmount, leverage)`: Handles the game outcome after the coin flip.
                *   Determines if the flip `outcome` ('up' = win, 'down' = loss).
                *   Updates user's balance, displays result text and color.
                *   Updates game history and user's stats.
                *   Calls `updateGlobalEarnings` with the determined `outcome`, `changeAmount`, and `isWin`.
*   **`style.css`**:
    *   **Earnings Display Styling**: Added CSS rules to style the new global earnings display elements in the header, using flexbox for layout and applying distinct success/error colors (`--success-color`, `--error-color`) for the earnings amounts to match the theme.

## Plan and Steps for Current Request

All requested changes have been implemented.

1.  **Updated `main.js`**:
    *   Refactored JavaScript to implement the coin flip animation, replacing the old "Up"/"Down" buttons.
    *   Updated the `constructor`, `connectedCallback`, and introduced new `startCoinFlip` and `processFlipResult` methods.
    *   Added Firebase Authentication imports and anonymous sign-in logic to ensure users are authenticated for Firestore operations.
2.  **Updated `blueprint.md`**: Reflected all recent changes.

**Next Steps for the User**:

1.  **Verify Firebase Configuration**: Ensure `firebaseConfig` in `main.js` is correct and Cloud Firestore is enabled.
2.  **Refresh Application**: Refresh your deployed application to see the new coin flip animation and its integration with global earnings.
3.  **Test Functionality**: Interact with the coin to confirm the animation, game logic, and real-time global earnings updates are working as expected.