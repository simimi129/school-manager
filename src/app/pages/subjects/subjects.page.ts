import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { CacheService } from '../../core/services/cache/cache.service';
import { SubjectCardComponent } from './components/subject-card/subject-card.component';

@Component({
  selector: 'app-subjects',
  imports: [
    SubjectCardComponent,
    AsyncPipe,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    NgClass,
  ],
  templateUrl: './subjects.page.html',
  styleUrl: './subjects.page.scss',
})
export class SubjectsComponent implements OnInit {
  private readonly subjectsHttpService = inject(SubjectsHttpService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cache = inject(CacheService);
  subjectsForDragAndDrop = new BehaviorSubject([] as SubjectModel[]);
  subjects$ = this.subjectsForDragAndDrop.asObservable();
  isDragging = false;

  ngOnInit(): void {
    this.subjectsHttpService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((subjects: SubjectModel[]) => {
        const subjectsOrder =
          this.cache.getItem<SubjectModel[]>('subjectsOrder');
        const subjectsOrderFromCache = subjectsOrder ?? ([] as SubjectModel[]);
        if (this.areArraysEqual(subjectsOrderFromCache, subjects)) {
          this.subjectsForDragAndDrop.next(subjectsOrderFromCache);
        } else {
          this.subjectsForDragAndDrop.next(subjects);
        }
      });
  }

  drop(event: CdkDragDrop<SubjectModel[] | null>) {
    const items = this.subjectsForDragAndDrop.getValue();
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.subjectsForDragAndDrop.next(items);
    this.cache.setItem('subjectsOrder', items);
  }

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  // TODO: move to utils
  areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return (
      arr1.every((obj1) =>
        arr2.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2))
      ) &&
      arr2.every((obj2) =>
        arr1.some((obj1) => JSON.stringify(obj2) === JSON.stringify(obj1))
      )
    );
  }
}
