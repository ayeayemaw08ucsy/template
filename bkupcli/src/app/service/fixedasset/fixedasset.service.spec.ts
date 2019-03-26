import { TestBed } from '@angular/core/testing';

import { FixedassetService } from './fixedasset.service';

describe('FixedassetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixedassetService = TestBed.get(FixedassetService);
    expect(service).toBeTruthy();
  });
});
