import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTrackingComponent } from './asset-tracking.component';

describe('AssetTrackingComponent', () => {
  let component: AssetTrackingComponent;
  let fixture: ComponentFixture<AssetTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
