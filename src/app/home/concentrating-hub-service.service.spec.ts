import { TestBed } from '@angular/core/testing';

import { ConcentratingHubServiceService } from './concentrating-hub-service.service';

describe('ConcentratingHubServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConcentratingHubServiceService = TestBed.get(ConcentratingHubServiceService);
    expect(service).toBeTruthy();
  });
});
