import { TestBed } from '@angular/core/testing';

import { VendorTnxService } from './vendor-tnx.service';

describe('VendorTnxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorTnxService = TestBed.get(VendorTnxService);
    expect(service).toBeTruthy();
  });
});
