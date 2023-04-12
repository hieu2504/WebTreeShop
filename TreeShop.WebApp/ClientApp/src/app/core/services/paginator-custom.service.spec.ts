import { TestBed } from '@angular/core/testing';

import { PaginatorCustomService } from './paginator-custom.service';

describe('PaginatorCustomService', () => {
  let service: PaginatorCustomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorCustomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
