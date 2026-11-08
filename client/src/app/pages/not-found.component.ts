import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Matched by the '**' wildcard route, which comes last in the route table.
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <h2>Not found</h2>
    <p>No route matches <code>{{ requestedUrl }}</code>.</p>
    <p><a routerLink="/courses">Back to all courses</a></p>
  `,
})
export class NotFoundComponent {
  readonly requestedUrl = inject(Router).url;
}
