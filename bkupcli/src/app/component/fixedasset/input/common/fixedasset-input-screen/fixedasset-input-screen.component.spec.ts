import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetInputScreenComponent } from './fixedasset-input-screen.component';

describe('FixedassetInputScreenComponent', () => {
  let component: FixedassetInputScreenComponent;
  let fixture: ComponentFixture<FixedassetInputScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetInputScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetInputScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
