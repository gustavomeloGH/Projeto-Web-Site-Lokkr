import { TestBed, inject } from '@angular/core/testing';

import { DaoService } from './dao.service';

describe('DaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DaoService]
    });
  });

  it('should ...', inject([DaoService], (service: DaoService) => {
    expect(service).toBeTruthy();
  }));
});
