import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  link = input('');
}
