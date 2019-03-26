import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetListScreenComponent } from './fixedasset-list-screen.component';

describe('FixedassetListScreenComponent', () => {
  let component: FixedassetListScreenComponent;
  let fixture: ComponentFixture<FixedassetListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
