import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-container-with-title',
  imports: [],
  templateUrl: './page-container-with-title.component.html',
  styleUrl: './page-container-with-title.component.scss',
})
export class PageContainerWithTitleComponent {
  @Input() title?: string | null;
}
