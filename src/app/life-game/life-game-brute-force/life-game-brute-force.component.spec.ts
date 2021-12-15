import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeGameBruteForceComponent } from './life-game-brute-force.component';

describe('LifeGameBruteForceComponent', () => {
  let component: LifeGameBruteForceComponent;
  let fixture: ComponentFixture<LifeGameBruteForceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeGameBruteForceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeGameBruteForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
