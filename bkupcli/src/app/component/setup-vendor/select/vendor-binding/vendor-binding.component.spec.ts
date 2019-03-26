import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBindingComponent } from './vendor-binding.component';

describe('VendorBindingComponent', () => {
  let component: VendorBindingComponent;
  let fixture: ComponentFixture<VendorBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
