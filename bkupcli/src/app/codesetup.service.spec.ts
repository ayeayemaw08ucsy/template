import { TestBed } from '@angular/core/testing';

import { CodesetupService } from './codesetup.service';

describe('CodesetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodesetupService = TestBed.get(CodesetupService);
    expect(service).toBeTruthy();
  });
});
