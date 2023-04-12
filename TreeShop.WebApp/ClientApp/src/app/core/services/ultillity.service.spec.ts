import { TestBed } from '@angular/core/testing';

import { UltillityService } from './ultillity.service';

describe('UltillityService', () => {
  let service: UltillityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltillityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
