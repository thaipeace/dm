import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeSummaryComponent } from './edge-summary.component';

describe('EdgeSummaryComponent', () => {
  let component: EdgeSummaryComponent;
  let fixture: ComponentFixture<EdgeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
