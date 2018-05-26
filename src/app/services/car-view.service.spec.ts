import { TestBed, inject } from '@angular/core/testing';

import { CarViewService } from './car-view.service';

describe('CarViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarViewService]
    });
  });

  it('should ...', inject([CarViewService], (service: CarViewService) => {
    expect(service).toBeTruthy();
  }));
});
