import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VizTrackComponent } from './viz-track.component';

describe('VizTrackComponent', () => {
  let component: VizTrackComponent;
  let fixture: ComponentFixture<VizTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VizTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VizTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
