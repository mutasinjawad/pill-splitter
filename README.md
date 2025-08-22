# 💊 Pill Splitter UI

This project is a small interactive UI challenge built with React (without Canvas or SVG). The goal is to let users draw, split, and move “pills” (rounded rectangular divs) directly on the page.

## 🚀 Features

- #### Draw Pills:
  Click and drag anywhere on an empty area to create a pill.
  - Pills are at least 40px × 40px in size.
  - Each pill gets a random background color.
  - Pills have rounded corners (20px border radius) and a visible border for clarity.
- #### Split Pills:
  - As you move your cursor, you’ll see a vertical and horizontal split line that follows it.
  - Single click anywhere to split all pills that intersect the current split line.
  - Pills keep their original corner radius even after splitting.
  - Each resulting part keeps the same color as the original pill.
- #### Further Splitting:
  - You can split pill parts again as long as they’re large enough.
  - Minimum part size is 20px × 20px.
  - If a part is too small to split, it simply shifts to one side of the line.
- #### Drag & Move:
  - Any pill (or pill part) can be dragged around freely.
  - Movement does not affect their ability to be split again later.

## 🎮 How to Play

- **Draw a Pill** → Click and drag on empty space.  
- **Position Split Lines** → Move your mouse; vertical & horizontal guides follow your cursor.  
- **Split Pills** → Single click anywhere to split any pill the line touches.  
- **Move Pills** → Drag and drop pills or pill parts around.  
- **Repeat** → Keep splitting and moving parts as you like!  

## 🛠️ Tech Notes

- Built with React and plain HTML/CSS (or Tailwind).
- No external libraries (other than what comes with the starter).
- No Canvas or SVG – everything is rendered using regular DOM elements.
