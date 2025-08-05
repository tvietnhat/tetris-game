import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState, BOARD_WIDTH, BOARD_HEIGHT } from '../types';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule],
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoardComponent {
  @Input({ required: true }) gameState!: GameState;

  public getBoardWithCurrentPiece(): (number | string)[][] {
    // Create a copy of the board
    const displayBoard: (number | string)[][] = this.gameState.board.map(row => [...row]);
    
    // Add current piece to the display board
    if (this.gameState.currentPiece) {
      const piece = this.gameState.currentPiece;
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== 0) {
            const boardX = piece.position.x + x;
            const boardY = piece.position.y + y;
            
            if (boardX >= 0 && boardX < BOARD_WIDTH && 
                boardY >= 0 && boardY < BOARD_HEIGHT) {
              displayBoard[boardY][boardX] = piece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  }

  public getCellClass(cellValue: number | string): string {
    if (cellValue === 0) {
      return 'cell empty';
    } else if (typeof cellValue === 'string') {
      return 'cell filled current-piece';
    } else {
      return 'cell filled placed-piece';
    }
  }

  public getCellStyle(cellValue: number | string): any {
    if (typeof cellValue === 'string') {
      return { 'background-color': cellValue };
    } else if (cellValue !== 0) {
      return { 'background-color': '#888' };
    }
    return {};
  }
}
