import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsInternal } from './widgets-internal';

describe('WidgetsInternal', () => {
  let component: WidgetsInternal;
  let fixture: ComponentFixture<WidgetsInternal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsInternal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsInternal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
