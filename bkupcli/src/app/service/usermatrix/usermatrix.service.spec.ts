import { TestBed } from '@angular/core/testing';

import { UsermatrixService } from './usermatrix.service';

describe('UsermatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsermatrixService = TestBed.get(UsermatrixService);
    expect(service).toBeTruthy();
  });
});
