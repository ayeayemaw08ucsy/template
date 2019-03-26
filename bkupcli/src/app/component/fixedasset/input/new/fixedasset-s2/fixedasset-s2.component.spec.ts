import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetS2Component } from './fixedasset-s2.component';

describe('FixedassetS2Component', () => {
  let component: FixedassetS2Component;
  let fixture: ComponentFixture<FixedassetS2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetS2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetS2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
