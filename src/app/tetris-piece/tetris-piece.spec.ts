import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisPiece } from './tetris-piece';

describe('TetrisPiece', () => {
  let component: TetrisPiece;
  let fixture: ComponentFixture<TetrisPiece>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetrisPiece]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetrisPiece);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
