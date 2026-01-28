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
- **Update Branding, Visual Accuracy, and Coin Art:**
    - **Website Name Changed to "Coin Soar"**: Updated `<title>` and `<h1>` tags in `index.html` to "코인 소어".
    - **Accurate Coin Face Display Ensured**: Verified that the existing CSS and JavaScript logic correctly displays the landed coin face (heads or tails) according to the outcome.
    - **Meme Coin Image for Heads Implemented**: Replaced the previous heads coin image with a Dogecoin logo (`https://upload.wikimedia.org/wikipedia/fr/d/d0/Dogecoin-logo.png`) in both `style.css` and `main.js`'s embedded styles.
- **Implement Win/Loss Visual Distinction and AI Coin Art:**
    - **Win/Loss Visual Distinction**: Modified `main.js`'s `flipCoin` method to ensure the coin visually lands on the heads side (`앞면`) if the player wins, and on the tails side (`뒷면`) if the player loses. This overrides the random `isHeads` determination based on the bet outcome.
    - **AI Coin Art (Heads)**: The heads side now uses the Dogecoin logo as a "meme coin" image (`https://upload.wikimedia.org/wikipedia/fr/d/d0/Dogecoin-logo.png`).
    - **AI Coin Art (Tails)**: The tails side continues to use the generic coin back image (`https://upload.wikimedia.org/wikipedia/commons/3/30/Coin-back.png`). Given the limitations of generating AI images directly and finding stable, free-to-use URLs for two distinct AI coin faces, this approach provides a "meme coin" feel for heads and clear distinction for tails.
- **Fix Coin Face Display Bug:**
    - **Refined `main.js` (`flipCoin` method)**: Removed the `tails-up` class application logic. Instead, directly set `coin.style.transform` within the `animationend` listener to explicitly control the final rotation: `rotateY(0deg)` for heads (win) and `rotateY(180deg)` for tails (loss).
    - **Removed `.coin.tails-up` CSS**: This CSS class was removed from `style.css` (and verified it was not present in embedded `main.js` styles) as it is no longer needed.
- **Fix and Revise Free Payout Mechanism (No Daily Limit):**
    - **Removed Daily Claim Logic**: Deleted `dailyClaimsUsed` and `lastClaimDate` from the constructor, and removed helper methods (`getTodayDateString`, `loadFreeClaims`, `saveFreeClaims`) related to daily limits. Also removed corresponding calls from `connectedCallback` and `flipCoin`.
    - **Simplified `claimFreeBalance` Method**: The method now simply checks if `this.balance < MIN_BALANCE_FOR_CLAIM` and resets `this.balance` to `this.initialBalance` upon claim, without any daily limit checks.
    - **Simplified `updateClaimButton` Method**: The button's enablement logic and text now reflect the absence of daily limits, clearly stating it's available when balance is below $1000 and explaining the reset to $10000.
- **Site Optimization and Code Cleanup:**
    - **Optimized `main.js`**: Ensured removal of unused properties (`this.dailyClaimsUsed`, `this.lastClaimDate`) and methods (`getTodayDateString`, `loadFreeClaims`, `saveFreeClaims`). Reviewed existing logic for redundancy and maintained consistent formatting.
    - **Optimized `style.css` and Embedded Styles**: Removed the now-unused `.coin.tails-up` CSS rule from `style.css`. Verified no other redundant or unused styles in `style.css` and the embedded styles within `main.js`. Ensured consistent formatting.
    - **Reviewed `index.html`**: Confirmed `index.html` remains minimal and clean.
- **Implement Cyberpunk UI with Tailwind (Design Overhaul):**
    - **Tailwind CSS Integrated (CDN)**: Tailwind CSS CDN link and custom config (for colors and fonts) added to `index.html`.
    - **HTML Structure Overhauled**: `index.html` restructured into Hero, Features (game component), CTA, and Footer sections with initial global Tailwind dark mode and text color classes.
    - **`style.css` Redesigned**: Overhauled global styles to embrace the cyberpunk dark UI and neon aesthetic, including custom scrollbar, updated color palette variables, stronger text shadows, and subtle animation keyframes (`neon-glow-blue`, `neon-glow-green`, `subtle-flicker`).
    - **Embedded Styles Redesigned in `main.js`**: Updated the `<style>` block within `shadowRoot.innerHTML` to align with the new design language, ensuring internal components maintain the cyberpunk aesthetic and responsiveness, including consistent `coin` transitions and `flipping` animations.

## Current Task: None
### Plan
All current tasks are complete.