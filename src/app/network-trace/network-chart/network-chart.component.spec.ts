import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkChartComponent } from './network-chart.component';

describe('NetworkChartComponent', () => {
  let component: NetworkChartComponent;
  let fixture: ComponentFixture<NetworkChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
