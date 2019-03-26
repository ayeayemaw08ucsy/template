import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSelectvaluebindingComponent } from './code-selectvaluebinding.component';

describe('CodeSelectvaluebindingComponent', () => {
  let component: CodeSelectvaluebindingComponent;
  let fixture: ComponentFixture<CodeSelectvaluebindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSelectvaluebindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSelectvaluebindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
