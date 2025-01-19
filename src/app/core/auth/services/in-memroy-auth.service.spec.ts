import { TestBed } from '@angular/core/testing';

import { InMemroyAuthService } from './in-memroy-auth.service';

describe('InMemroyAuthService', () => {
  let service: InMemroyAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemroyAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
