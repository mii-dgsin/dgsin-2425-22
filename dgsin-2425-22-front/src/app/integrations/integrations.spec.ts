import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Widgets } from './integrations';

describe('Widgets', () => {
  let component: Widgets;
  let fixture: ComponentFixture<Widgets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Widgets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Widgets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
