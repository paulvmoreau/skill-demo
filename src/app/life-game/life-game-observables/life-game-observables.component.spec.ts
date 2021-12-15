import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeGameObservablesComponent } from './life-game-observables.component';

describe('LifeGameObservablesComponent', () => {
  let component: LifeGameObservablesComponent;
  let fixture: ComponentFixture<LifeGameObservablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeGameObservablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeGameObservablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
