import { TestBed } from '@angular/core/testing';

import { IncomingDatasSimulatorService } from './incoming-datas-simulator.service';

describe('IncomingDatasSimulatorService', () => {
  let service: IncomingDatasSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomingDatasSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
