import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterAlertComponent } from './cluster-alert.component';

describe('ClusterAlertComponent', () => {
  let component: ClusterAlertComponent;
  let fixture: ComponentFixture<ClusterAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
