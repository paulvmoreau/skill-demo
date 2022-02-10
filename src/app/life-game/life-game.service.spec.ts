import { TestBed } from '@angular/core/testing';

import { LifeGameService } from './life-game.service';

describe('LifeGameService', () => {
  let service: LifeGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifeGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
