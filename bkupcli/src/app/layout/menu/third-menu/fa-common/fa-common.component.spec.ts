import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCommonComponent } from './fa-common.component';

describe('FaCommonComponent', () => {
  let component: FaCommonComponent;
  let fixture: ComponentFixture<FaCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
