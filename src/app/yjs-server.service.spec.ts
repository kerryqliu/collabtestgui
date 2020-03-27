import { TestBed } from '@angular/core/testing';

import { YjsServerService } from './yjs-server.service';

describe('YjsServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YjsServerService = TestBed.get(YjsServerService);
    expect(service).toBeTruthy();
  });
});
