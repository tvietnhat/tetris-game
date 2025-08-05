import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game';
import { GameBoardComponent } from '../game-board/game-board';

@Component({
  selector: 'app-game',
  imports: [CommonModule, GameBoardComponent],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private gameLoop: number | null = null;
  
  public gameState = this.gameService.state;

  ngOnInit(): void {
    this.gameService.startGame();
    this.startGameLoop();
  }

  ngOnDestroy(): void {
    this.stopGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const state = this.gameState();
    if (state.isGameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.gameService.movePiece('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.gameService.movePiece('right');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.gameService.movePiece('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.gameService.rotatePiece();
        break;
      case ' ':
        event.preventDefault();
        this.gameService.dropPiece();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        this.gameService.pauseGame();
        break;
    }
  }

  public startNewGame(): void {
    this.gameService.startGame();
    this.startGameLoop();
  }

  public pauseGame(): void {
    this.gameService.pauseGame();
  }

  private startGameLoop(): void {
    this.stopGameLoop();
    const tick = () => {
      const state = this.gameState();
      if (!state.isPaused && !state.isGameOver) {
        this.gameService.movePiece('down');
      }
      this.gameLoop = setTimeout(tick, this.gameService.getDropInterval());
    };
    this.gameLoop = setTimeout(tick, this.gameService.getDropInterval());
  }

  private stopGameLoop(): void {
    if (this.gameLoop) {
      clearTimeout(this.gameLoop);
      this.gameLoop = null;
    }
  }
}
