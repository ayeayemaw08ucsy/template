import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetS3Component } from './fixedasset-s3.component';

describe('FixedassetS3Component', () => {
  let component: FixedassetS3Component;
  let fixture: ComponentFixture<FixedassetS3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetS3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
