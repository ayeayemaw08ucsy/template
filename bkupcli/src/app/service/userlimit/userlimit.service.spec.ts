import { TestBed } from '@angular/core/testing';

import { UserlimitService } from './userlimit.service';

describe('UserlimitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserlimitService = TestBed.get(UserlimitService);
    expect(service).toBeTruthy();
  });
});
