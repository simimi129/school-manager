import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '../../../shared/components/link/link.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  imports: [ButtonComponent, LinkComponent, MatTooltipModule, MatButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {}
