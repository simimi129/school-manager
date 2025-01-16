import { TestBed } from '@angular/core/testing';

import { SubjectsHttpService } from './subjects-http.service';

describe('SubjectsHttpService', () => {
  let service: SubjectsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
