import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodMagicHealingCalculatorComponent } from './blood-magic-healing-calculator.component';

describe('BloodMagicHealingCalculatorComponent', () => {
  let component: BloodMagicHealingCalculatorComponent;
  let fixture: ComponentFixture<BloodMagicHealingCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloodMagicHealingCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodMagicHealingCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
