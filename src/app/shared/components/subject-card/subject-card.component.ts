import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-subject-card',
  imports: [NgStyle],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.scss',
})
export class SubjectCardComponent {
  title = input('');
  code = input('');
  gpa = input();
  color = input('');
}
