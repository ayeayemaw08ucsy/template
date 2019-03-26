import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApproveComponent } from './vendor-approve.component';

describe('VendorApproveComponent', () => {
  let component: VendorApproveComponent;
  let fixture: ComponentFixture<VendorApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
