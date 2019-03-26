import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetS4Component } from './fixedasset-s4.component';

describe('FixedassetS4Component', () => {
  let component: FixedassetS4Component;
  let fixture: ComponentFixture<FixedassetS4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetS4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetS4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
