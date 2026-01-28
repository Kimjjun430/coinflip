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

## Current Task: None
### Plan
All current tasks are complete.
