import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterAlarmComponent } from './cluster-alarm.component';

describe('ClusterAlarmComponent', () => {
  let component: ClusterAlarmComponent;
  let fixture: ComponentFixture<ClusterAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
