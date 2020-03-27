import { TestBed } from '@angular/core/testing';

import { ButtonAutomergeService } from './button-automerge.service';

describe('ButtonAutomergeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButtonAutomergeService = TestBed.get(ButtonAutomergeService);
    expect(service).toBeTruthy();
  });
});
