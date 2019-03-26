import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaNewComponent } from './fa-new.component';

describe('FaNewComponent', () => {
  let component: FaNewComponent;
  let fixture: ComponentFixture<FaNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
