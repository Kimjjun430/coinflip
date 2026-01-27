# Coin Flip Game Blueprint

## Overview

A simple, interactive web application that simulates coin flip betting. Users can set a bet amount and leverage, then bet on whether the outcome will be "Up" or "Down". The goal is to create a visually engaging and intuitive experience using modern web technologies.

## Core Features

-   **Balance:** Users start with an initial balance.
-   **Betting:** Users can input a bet amount.
-   **Leverage:** Users can select a leverage multiplier (e.g., 1x to 100x).
-   **Betting Actions:** "Up" and "Down" buttons to place a bet.
-   **Outcome:** The application displays the result of the flip (Win/Loss) and updates the user's balance accordingly.
-   **History:** A log of recent bets and their outcomes.
-   **Visuals:** Clean, modern design with clear visual feedback for game events.

## Design and Style

-   **Layout:** A centered, single-column layout for the main game interface.
-   **Colors:** A modern color palette. Green for wins, red for losses.
-   **Typography:** Clear, legible fonts.
-   **Components:**
    -   Header displaying the title and current balance.
    -   Control panel for bet amount and leverage inputs.
    -   Action panel with "Up" and "Down" buttons.
    -   Result display area.
    -   History log.

## Technical Implementation

-   **HTML:** A single `index.html` file for the structure.
-   **CSS:** A `style.css` file for styling, using modern features like Flexbox/Grid and CSS Variables.
-   **JavaScript:** A `main.js` file containing the game logic.
    -   No external frameworks.
    -   ES Modules for code organization.
    -   Web Components will be used to encapsulate the main game UI (`<coin-flip-game>`).

## Current Plan

1.  **DONE:** Create the `blueprint.md` file to establish the project plan.
2.  **DONE:** Update `index.html` to include the basic structure and link the CSS and JavaScript files.
3.  **DONE:** Implement the initial game UI and layout in `style.css`.
4.  **DONE:** Develop the core game logic in `main.js`.
5.  **DONE:** Connect the UI elements to the game logic.
6.  **DONE:** Refine styling and add visual feedback for user actions.
