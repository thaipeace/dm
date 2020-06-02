import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachRulesComponent } from './attach-rules.component';

describe('AttachRulesComponent', () => {
  let component: AttachRulesComponent;
  let fixture: ComponentFixture<AttachRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
