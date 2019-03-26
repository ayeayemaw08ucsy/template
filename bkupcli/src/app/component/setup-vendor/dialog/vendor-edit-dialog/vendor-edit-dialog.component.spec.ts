import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEditDialogComponent } from './vendor-edit-dialog.component';

describe('VendorEditDialogComponent', () => {
  let component: VendorEditDialogComponent;
  let fixture: ComponentFixture<VendorEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
