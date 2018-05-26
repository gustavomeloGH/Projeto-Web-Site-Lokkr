import { TestBed, inject } from '@angular/core/testing';

import { FipeCarService } from './fipe-car.service';

describe('FipeCarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FipeCarService]
    });
  });

  it('should ...', inject([FipeCarService], (service: FipeCarService) => {
    expect(service).toBeTruthy();
  }));
});
