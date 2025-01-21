import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContainerWithTitleComponent } from './page-container-with-title.component';

describe('PageContainerWithTitleComponent', () => {
  let component: PageContainerWithTitleComponent;
  let fixture: ComponentFixture<PageContainerWithTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContainerWithTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageContainerWithTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
