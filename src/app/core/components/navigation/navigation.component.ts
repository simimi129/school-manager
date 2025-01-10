import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../shared/components/link/link.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navigation',
  imports: [ButtonComponent, LinkComponent, MatTooltipModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {}
