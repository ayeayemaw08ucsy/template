import { TestBed } from '@angular/core/testing';

import { DepreciationpolicysetupService } from './depreciationpolicysetup.service';

describe('DepreciationpolicysetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepreciationpolicysetupService = TestBed.get(DepreciationpolicysetupService);
    expect(service).toBeTruthy();
  });
});
