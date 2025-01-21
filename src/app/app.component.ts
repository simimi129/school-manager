import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PageContainerWithTitleComponent } from './core/components/page-container-with-title/page-container-with-title.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    PageContainerWithTitleComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isNavigationVisible$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.route.firstChild?.snapshot.url.toString() !== 'login')
  );

  title$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.route.firstChild?.snapshot.title)
  );
}
