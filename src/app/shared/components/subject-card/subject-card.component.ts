import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import { SubjectModel } from '../../../pages/subjects/data-access/models/subjects.interfaces';

@Component({
  selector: 'app-subject-card',
  imports: [NgStyle],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.scss',
})
export class SubjectCardComponent {
  subject = input({} as SubjectModel);
}
