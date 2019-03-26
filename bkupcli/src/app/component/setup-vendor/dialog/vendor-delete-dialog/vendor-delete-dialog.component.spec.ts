import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDeleteDialogComponent } from './vendor-delete-dialog.component';

describe('VendorDeleteDialogComponent', () => {
  let component: VendorDeleteDialogComponent;
  let fixture: ComponentFixture<VendorDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
