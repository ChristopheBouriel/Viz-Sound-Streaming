import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VizBarsComponent } from './viz-bars.component';

describe('VizBarsComponent', () => {
  let component: VizBarsComponent;
  let fixture: ComponentFixture<VizBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VizBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
