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
import { LoaderService } from './core/services/loader/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UpcomingEventsComponent } from './core/components/upcoming-events/upcoming-events.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    PageContainerWithTitleComponent,
    AsyncPipe,
    MatProgressSpinnerModule,
    UpcomingEventsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loaderService = inject(LoaderService);

  isLoading$ = this.loaderService.isLoading$;

  title$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => this.route.firstChild?.snapshot.title)
  );

  isNavigationVisible$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map(() => {
      return (
        this.route.firstChild?.snapshot.url.toString() !== 'login' &&
        this.route.firstChild?.routeConfig?.path !== '**'
      );
    })
  );
}
