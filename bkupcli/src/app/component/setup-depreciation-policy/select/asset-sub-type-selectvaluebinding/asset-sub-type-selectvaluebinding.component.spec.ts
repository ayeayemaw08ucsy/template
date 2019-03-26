import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSubTypeSelectvaluebindingComponent } from './asset-sub-type-selectvaluebinding.component';

describe('AssetSubTypeSelectvaluebindingComponent', () => {
  let component: AssetSubTypeSelectvaluebindingComponent;
  let fixture: ComponentFixture<AssetSubTypeSelectvaluebindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetSubTypeSelectvaluebindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSubTypeSelectvaluebindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
