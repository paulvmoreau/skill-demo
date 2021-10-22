import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTraceComponent } from './network-trace.component';

describe('NetworkTraceComponent', () => {
  let component: NetworkTraceComponent;
  let fixture: ComponentFixture<NetworkTraceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkTraceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkTraceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
