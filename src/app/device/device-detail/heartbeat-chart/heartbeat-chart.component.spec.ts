import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartbeatChartComponent } from './heartbeat-chart.component';

describe('HeartbeatChartComponent', () => {
  let component: HeartbeatChartComponent;
  let fixture: ComponentFixture<HeartbeatChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeartbeatChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeartbeatChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
