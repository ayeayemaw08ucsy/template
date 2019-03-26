import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlimitAddDialogComponent } from './userlimit-add-dialog.component';

describe('UserlimitAddDialogComponent', () => {
  let component: UserlimitAddDialogComponent;
  let fixture: ComponentFixture<UserlimitAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlimitAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlimitAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
