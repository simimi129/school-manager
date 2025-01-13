import { Component } from '@angular/core';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';

@Component({
  selector: 'app-subjects',
  imports: [SubjectCardComponent],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent {}
