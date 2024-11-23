/**
 * Represents the state of a single game. Make a new one for every instance of a game
 */
class Engine {
  static boardWidth = 5;
  static maxAllocation = 10;
  static highValueValue = 3;
  validateMoves(moves) {
    return Array.isArray(moves) &&
      moves.length === Engine.boardWidth &&
      moves.every(item => typeof item === 'number') &&
      moves.reduce((sum, num) => sum + num, 0) <= Engine.maxAllocation;
  }

  p1Info = { highValuePos: 0 }
  p2Info = { highValuePos: 0 }
  constructor() {
    var hv1 = Math.floor(Math.random() * (Engine.boardWidth + 1))
    var hv2 = Math.floor(Math.random() * (Engine.boardWidth))
    if (hv2 >= hv1) {
      hv2 += 1;
    }

    this.p1Info.highValuePos = hv1
    this.p2Info.highValuePos = hv2
  }

  p1Points = 0
  p2Points = 0

  /**
   * Processes a single turn, and outputs a dictionary containing what should be logged
   */
  processTurn(p1moves, p2moves) {
    var boardWinLoss = Array(Engine.boardWidth);
    var score1 = 0
    var score2 = 0
    for (let i = 0; i < Engine.boardWidth; i++) {
      if (p1moves[i] > p2moves[i]) {
        if (this.p1Info.highValuePos == i || this.p2Info.highValuePos == i) {
          score1 += Engine.highValueValue;
        } else {
          score1 += 1
        }
        boardWinLoss[i] = 1
      }
      else if (p1moves[i] < p2moves[i]) {
        if (this.p1Info.highValuePos == i || this.p2Info.highValuePos == i) {
          score2 += Engine.highValueValue;
        } else {
          score2 += 1
        }
        boardWinLoss[i] = 2
      } else {
        boardWinLoss[i] = 0
      }
    }

    if (score1 > score2) {
      this.p1Points += 1
    }
    else if (score1 < score2) {
      this.p2Points += 1
    }

    return {
      points: {
        p1: this.p1Points,
        p2: this.p2Points
      },
      boardWinLoss: boardWinLoss
    }
  }

  /**
   * @returns [p1, p2] are win loss points for this game. p1 + p2 = 1
   */
  getResults() {
    if (this.p1Points > this.p2Points) {
      return [1, 0]
    }
    if (this.p1Points < this.p2Points) {
      return [0, 1]
    }
    return [.5, .5]
  }
}