<!-- TO DO -->
Adding a shopping cart. When someone clicks on add book to cart, I want the shopping cart to have a number 1 next to it, and 2 if they click twice... This is the aim at least.

<!-- TIPS -->
Tailwind correct class order:
Layout > Flexbox & Grid > Positioning > Spacing > Sizing > Typography > Backgrounds > Borders > Effects > Transforms > Interactivity.

Check for ESLint errors in the terminal
npm run lint

How to delete sql entries
DELETE FROM cart WHERE userid = '5ab97ebe-ea22-4dd0-be77-5300ed1d2164';
DELETE FROM cart (deletes the entire table content, but keeps the column headers and format).