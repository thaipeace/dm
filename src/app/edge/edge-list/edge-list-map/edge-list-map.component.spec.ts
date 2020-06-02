import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeListMapComponent } from './edge-list-map.component';

describe('EdgeListMapComponent', () => {
  let component: EdgeListMapComponent;
  let fixture: ComponentFixture<EdgeListMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeListMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeListMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
