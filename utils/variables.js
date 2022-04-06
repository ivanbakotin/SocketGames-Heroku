const gameList = {
  tictactoe: {
    maxplayers: [2],
    display: "Tic Tac Toe",
    name: "tictactoe",
    description:
      "A game where you try to guess what color corresponds to the displayed RGB value.",
    instructions:
      "R-Red, G-Green, B-Blue. Higher the number stronger the corresponding color.",
  },
  rgb: {
    maxplayers: [1, 2, 3, 4],
    display: "RGB Game",
    name: "rgb",
    description:
      "A game where you try to guess what color corresponds to the displayed RGB value.",
    instructions:
      "R-Red, G-Green, B-Blue. Higher the number stronger the corresponding color.",
  },
};

module.exports = { gameList: gameList };
