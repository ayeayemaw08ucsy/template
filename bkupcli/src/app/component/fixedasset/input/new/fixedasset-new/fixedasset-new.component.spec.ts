import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetNewComponent } from './fixedasset-new.component';

describe('FixedassetNewComponent', () => {
  let component: FixedassetNewComponent;
  let fixture: ComponentFixture<FixedassetNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
