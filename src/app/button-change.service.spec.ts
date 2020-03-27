import { TestBed } from '@angular/core/testing';

import { ButtonChangeService } from './button-change.service';

describe('ButtonChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ButtonChangeService = TestBed.get(ButtonChangeService);
    expect(service).toBeTruthy();
  });

  it('should start as nothing', () => {
    const service: ButtonChangeService = TestBed.get(ButtonChangeService);
    expect(service.getText()).toEqual('Nothing');
  });

  it('change text correctly', () => {
    const service: ButtonChangeService = TestBed.get(ButtonChangeService);
    service.executeCommand('test');
    expect(service.getText()).toEqual('test');
  });

});
