import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterCardComponent } from './starter-card.component';

describe('StarterCardComponent', () => {
  let component: StarterCardComponent;
  let fixture: ComponentFixture<StarterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
