import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchBindingComponent } from './branch-binding.component';

describe('BranchBindingComponent', () => {
  let component: BranchBindingComponent;
  let fixture: ComponentFixture<BranchBindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchBindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
