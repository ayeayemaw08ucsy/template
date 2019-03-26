import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeSelectvaluebindingComponent } from './asset-type-selectvaluebinding.component';

describe('AssetTypeSelectvaluebindingComponent', () => {
  let component: AssetTypeSelectvaluebindingComponent;
  let fixture: ComponentFixture<AssetTypeSelectvaluebindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTypeSelectvaluebindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTypeSelectvaluebindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
