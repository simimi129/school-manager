import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsComponent } from './subjects.page';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
