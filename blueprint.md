# Project Blueprint

## Overview
This document outlines the design and features of the web application.

## Implemented Features
- Initial setup for a framework-less web project.
- **Coin Flip Feature:** Transformed the previous betting mechanism into an interactive coin flip game.
    - Replaced "Up/Down" buttons with a clickable 3D animated coin.
    - Implemented client-side coin flip logic with random outcome (Heads/Tails).
    - Integrated CSS for coin styling, 3D flip animation, and result display.
    - Updated balance tracking and history based on coin flip results.
- **Enhanced Coin Flip Animation and Images:**
    - Sourced widely available coin images for heads and tails (Wikimedia Commons).
    - Modified `style.css` to use these images and updated the `@keyframes coin-flip` for a more dynamic animation, including increased rotations, vertical movement, and scaling during the flip.
    - Adjusted `main.js`'s `setTimeout` duration to synchronize with the new animation.
- **flipsimu.com-like Animation, Distinct Colors & Sound Integration:**
    - Modified `style.css` to further enhance the `@keyframes coin-flip` for a more complex and realistic 3D animation, inspired by `flipsimu.com`, introducing `rotateX` and `rotateZ` for tumbling effects, more keyframe steps, and adjusted `cubic-bezier` timing functions.
    - Confirmed distinct background colors (`#ffcc00` for heads, `#cccccc` for tails) are applied in `style.css`.
    - Integrated an open-source coin flip sound effect into `main.js`, which plays when the coin is flipped.
    - Adjusted `setTimeout` duration in `main.js` to `1800ms` to match the new 1.8s CSS animation.
- **Sound Playback Fix:** Resolved `NotSupportedError` for sound playback by replacing the unreliable online sound source with a local `pickupCoin.wav` file, to be provided and placed by the user.
- **Refined Animation (Toss Upwards) and Immediate Result Display:**
    - Reworked `@keyframes coin-flip` in `style.css` to create a new "toss upwards" animation, emphasizing `translateY` for realistic vertical motion and simplifying rotations to focus on `rotateY` for clear spinning. Animation duration set to 1.5s.
    - Modified `main.js` to eliminate the `setTimeout` for result display; coin flip logic (outcome, balance, history) now executes immediately after animation trigger.
    - Ensured visual alignment by adding a `.tails-up` class in `style.css` and applying it via `main.js` after the animation, if the outcome is tails.
- **Immediate Coin Clickability:**
    - Modified `main.js` to enable immediate re-clickability of the coin after a flip. `coin.style.pointerEvents = 'auto';` and the `tails-up` class application logic are now executed immediately after the result display.
    - Replaced the `setTimeout` for animation cleanup with an `animationend` event listener on the coin element, ensuring the `flipping` class is removed without delaying user interaction.
- **Persist User Balance Across Sessions:**
    - Implemented logic in the `CoinFlipGame` constructor to load the user's balance from `localStorage` using the key `'coinFlipBalance'`, falling back to the `initialBalance` if no saved data is found.
    - Added a `saveBalance()` method that stores the current `this.balance` in `localStorage` and integrated calls to this method whenever the balance is updated (after a win, loss, or liquidation).
- **Game Economy Features:**
    - Set the `initialBalance` to `10000`.
    - Updated the maximum leverage to `100x` in the UI.
    - Implemented a daily free payout system, allowing users to claim 1000 balance up to 3 times a day if their balance is 0. This includes a UI button, `localStorage` tracking for claims and date, and automatic daily resets.
- **Max Leverage Validation and Restart Game Feature:**
    - Added JavaScript validation in the `flipCoin` method to cap leverage at 100 if a higher value is entered, updating the input field and displaying an error message.
    - Implemented a "Restart Game" button in the UI with appropriate styling.
    - Created a `restartGame` method that resets `this.balance` to `this.initialBalance`, clears `'coinFlipBalance'` from `localStorage`, clears game history, resets free claims-related `localStorage` keys, updates the display, and saves the initial balance.
- **Revised Free Payout Mechanism:**
    - The free payout is now available when the balance drops below $1000 (previously only when balance was 0).
    - Upon claiming, the balance is reset to the initial $10000.
    - The "Claim Free Balance" button's text and enablement conditions have been updated to clearly explain these new rules.
- **Refine UI, Localize, and Adjust Game Features:**
    - **Removed "Restart Game" Feature**: Deleted the restart button HTML, event listener, `restartGame()` method, and associated CSS.
    - **Beautified Website**: Extensively modified `style.css` and embedded styles in `main.js` to create a more polished, monetization-ready aesthetic, including refined color palette, typography, shadows, gradients, and responsive layout.
    - **Localized All Text to Korean**: Translated all user-facing text in `index.html` and `main.js` to Korean.

## Current Task: None
### Plan
All current tasks are complete.
