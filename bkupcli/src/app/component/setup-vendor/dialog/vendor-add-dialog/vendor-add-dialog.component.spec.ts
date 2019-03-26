import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAddDialogComponent } from './vendor-add-dialog.component';

describe('VendorAddDialogComponent', () => {
  let component: VendorAddDialogComponent;
  let fixture: ComponentFixture<VendorAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
