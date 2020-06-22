import { TestBed } from '@angular/core/testing';

import { ShopitFormService } from './shopit-form.service';

describe('ShopitFormService', () => {
  let service: ShopitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopitFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
