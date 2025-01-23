import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserHttpService } from '../../services/user/data-access/http/user-http.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-navigation',
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    AsyncPipe,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private authService = inject(AuthService);
  private userHttpService = inject(UserHttpService);
  private snackbarService = inject(SnackbarService);

  user$ = this.authService.authStatus$.pipe(
    switchMap(({ userId }) => this.userHttpService.getById(userId))
  );

  isOpen = false;

  logout() {
    this.authService.logout();
  }
}
