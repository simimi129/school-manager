import { Component, DestroyRef, inject } from '@angular/core';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';
import { SubjectsHttpService } from './data-access/http/subjects-http.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-subjects',
  imports: [SubjectCardComponent, AsyncPipe],
  templateUrl: './subjects.page.html',
  styleUrl: './subjects.page.scss',
})
export class SubjectsComponent {
  private subjectsHttpService = inject(SubjectsHttpService);
  private destroyRef = inject(DestroyRef);
  subjects = this.subjectsHttpService
    .get()
    .pipe(takeUntilDestroyed(this.destroyRef));
}
