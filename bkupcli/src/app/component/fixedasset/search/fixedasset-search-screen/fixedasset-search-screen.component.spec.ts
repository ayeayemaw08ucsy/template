import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetSearchScreenComponent } from './fixedasset-search-screen.component';

describe('FixedassetSearchScreenComponent', () => {
  let component: FixedassetSearchScreenComponent;
  let fixture: ComponentFixture<FixedassetSearchScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetSearchScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetSearchScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
