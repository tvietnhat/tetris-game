import { Injectable, signal } from '@angular/core';
import { 
  GameState, 
  Tetromino, 
  TetrominoType, 
  Position, 
  TETROMINO_SHAPES, 
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} from './types';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState = signal<GameState>({
    board: this.createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: false
  });

  public readonly state = this.gameState.asReadonly();

  private createEmptyBoard(): number[][] {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  }

  private getRandomTetromino(): Tetromino {
    const types = Object.values(TetrominoType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const shape = TETROMINO_SHAPES[randomType];
    
    return {
      type: randomType,
      shape: shape.shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      color: shape.color
    };
  }

  public startGame(): void {
    const currentPiece = this.getRandomTetromino();
    const nextPiece = this.getRandomTetromino();
    
    this.gameState.update(state => ({
      ...state,
      board: this.createEmptyBoard(),
      currentPiece,
      nextPiece,
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    }));
  }

  public pauseGame(): void {
    this.gameState.update(state => ({
      ...state,
      isPaused: !state.isPaused
    }));
  }

  public movePiece(direction: 'left' | 'right' | 'down'): boolean {
    const state = this.gameState();
    if (!state.currentPiece || state.isGameOver || state.isPaused) return false;

    const newPosition = { ...state.currentPiece.position };
    
    switch (direction) {
      case 'left':
        newPosition.x--;
        break;
      case 'right':
        newPosition.x++;
        break;
      case 'down':
        newPosition.y++;
        break;
    }

    if (this.isValidPosition(state.currentPiece.shape, newPosition, state.board)) {
      this.gameState.update(gameState => ({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece!,
          position: newPosition
        }
      }));
      return true;
    }

    // If moving down and can't move, place the piece
    if (direction === 'down') {
      this.placePiece();
    }

    return false;
  }

  public rotatePiece(): boolean {
    const state = this.gameState();
    if (!state.currentPiece || state.isGameOver || state.isPaused) return false;

    const rotatedShape = this.rotateMatrix(state.currentPiece.shape);
    
    if (this.isValidPosition(rotatedShape, state.currentPiece.position, state.board)) {
      this.gameState.update(gameState => ({
        ...gameState,
        currentPiece: {
          ...gameState.currentPiece!,
          shape: rotatedShape
        }
      }));
      return true;
    }

    return false;
  }

  public dropPiece(): void {
    const state = this.gameState();
    if (!state.currentPiece || state.isGameOver || state.isPaused) return;

    while (this.movePiece('down')) {
      // Keep moving down until we can't
    }
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    const N = matrix.length;
    const rotated = Array(N).fill(null).map(() => Array(N).fill(0));
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = matrix[i][j];
      }
    }
    
    return rotated;
  }

  private isValidPosition(shape: number[][], position: Position, board: number[][]): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          // Check bounds
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          // Check collision with existing pieces (skip checking above the board)
          if (newY >= 0 && board[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private placePiece(): void {
    const state = this.gameState();
    if (!state.currentPiece) return;

    const newBoard = state.board.map(row => [...row]);
    
    // Place the piece on the board
    for (let y = 0; y < state.currentPiece.shape.length; y++) {
      for (let x = 0; x < state.currentPiece.shape[y].length; x++) {
        if (state.currentPiece.shape[y][x] !== 0) {
          const boardX = state.currentPiece.position.x + x;
          const boardY = state.currentPiece.position.y + y;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1; // Mark as filled
          }
        }
      }
    }

    // Check for completed lines
    const { clearedBoard, linesCleared } = this.clearLines(newBoard);
    
    // Calculate score
    const lineScore = this.calculateLineScore(linesCleared, state.level);
    const newLines = state.lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;
    
    // Check game over
    const nextPiece = this.getRandomTetromino();
    const isGameOver = !this.isValidPosition(nextPiece.shape, nextPiece.position, clearedBoard);

    this.gameState.update(gameState => ({
      ...gameState,
      board: clearedBoard,
      currentPiece: isGameOver ? null : state.nextPiece,
      nextPiece: isGameOver ? null : nextPiece,
      score: gameState.score + lineScore,
      level: newLevel,
      lines: newLines,
      isGameOver
    }));
  }

  private clearLines(board: number[][]): { clearedBoard: number[][], linesCleared: number } {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    // Add empty rows at the top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { clearedBoard: newBoard, linesCleared };
  }

  private calculateLineScore(lines: number, level: number): number {
    const baseScores = [0, 40, 100, 300, 1200];
    return (baseScores[lines] || 0) * level;
  }

  public getDropInterval(): number {
    const state = this.gameState();
    return Math.max(50, 1000 - (state.level - 1) * 100);
  }
}
