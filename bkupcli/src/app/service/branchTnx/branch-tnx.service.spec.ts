import { TestBed } from '@angular/core/testing';

import { BranchTnxService } from './branch-tnx.service';

describe('BranchTnxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchTnxService = TestBed.get(BranchTnxService);
    expect(service).toBeTruthy();
  });
});
