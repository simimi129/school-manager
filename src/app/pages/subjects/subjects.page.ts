import { Component } from '@angular/core';
import { SubjectCardComponent } from '../../shared/components/subject-card/subject-card.component';

@Component({
  selector: 'app-subjects',
  imports: [SubjectCardComponent],
  templateUrl: './subjects.page.html',
  styleUrl: './subjects.page.scss',
})
export class SubjectsComponent {
  subjects = [
    { id: 1, title: 'Math', code: 'MATH101', gpa: 3.5, color: '#CF7B7B' },
    { id: 2, title: 'Science', code: 'SCI101', gpa: 3.0, color: 'green' },
    { id: 3, title: 'History', code: 'HIST101', gpa: 2.5, color: 'blue' },
    { id: 4, title: 'English', code: 'ENG101', gpa: 4.0, color: 'purple' },
    { id: 5, title: 'Art', code: 'ART101', gpa: 3.5, color: 'orange' },
    { id: 6, title: 'Music', code: 'MUS101', gpa: 3.0, color: 'yellow' },
    { id: 7, title: 'Fitness', code: 'PED101', gpa: 2.5, color: 'red' },
  ];
}
