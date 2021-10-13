import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RainerCompComponent } from './rainer-comp.component';

describe('RainerCompComponent', () => {
  let component: RainerCompComponent;
  let fixture: ComponentFixture<RainerCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RainerCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainerCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
