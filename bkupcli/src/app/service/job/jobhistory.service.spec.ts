import { TestBed } from '@angular/core/testing';

import { JobhistoryService } from './jobhistory.service';

describe('JobhistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobhistoryService = TestBed.get(JobhistoryService);
    expect(service).toBeTruthy();
  });
});
