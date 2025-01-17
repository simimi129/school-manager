import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';
import { SubjectsHttpService } from './data-access/http/subjects-http.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { SubjectModel } from './data-access/models/subjects.interfaces';
import { BehaviorSubject, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-subjects',
  imports: [
    SubjectCardComponent,
    AsyncPipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './subjects.page.html',
  styleUrl: './subjects.page.scss',
})
export class SubjectsComponent implements OnInit {
  private subjectsHttpService = inject(SubjectsHttpService);
  private destroyRef = inject(DestroyRef);
  subjectsForDragAndDrop = new BehaviorSubject([] as SubjectModel[]);
  subjects$ = this.subjectsForDragAndDrop.asObservable();

  ngOnInit(): void {
    this.subjects$ = this.subjectsHttpService.get().pipe(
      tap((subjects: SubjectModel[]) =>
        this.subjectsForDragAndDrop.next(subjects)
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  drop(event: CdkDragDrop<SubjectModel[] | null>) {
    const items = this.subjectsForDragAndDrop.getValue();
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.subjectsForDragAndDrop.next(items);
  }
}
