import { TestBed } from '@angular/core/testing';

import { AutomergeServerService } from './automerge-server.service';

describe('AutomergeServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutomergeServerService = TestBed.get(AutomergeServerService);
    expect(service).toBeTruthy();
  });
});
