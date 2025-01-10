import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButtonComponent } from '../../../shared/components/icon-button/icon-button.component';
import { LinkComponent } from '../../../shared/components/link/link.component';

@Component({
  selector: 'app-navigation',
  imports: [IconButtonComponent, LinkComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {}
