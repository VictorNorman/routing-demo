import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CourseDataService } from '../data/course-data.service';

// The parent route for /courses/:courseId. Its template holds the
// second <router-outlet>, where Assignments or Roster appears.
@Component({
  selector: 'app-course-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="shell">
      <p class="component-label">CourseShellComponent · created at {{ createdAt }}</p>

      @if (course(); as currentCourse) {
        <h2>Course {{ currentCourse.id }}</h2>
        <p class="subtitle">{{ currentCourse.name }} · {{ currentCourse.term }}</p>
      } @else if (course() === null) {
        <h2>Course {{ courseId() }}</h2>
        <p class="subtitle">The server has no course called "{{ courseId() }}".</p>
      }

      <p class="hint">
        Jump to another course (same route, new :courseId):
        @for (otherCourseId of courseIds; track otherCourseId) {
          <a [routerLink]="['/courses', otherCourseId]">{{ otherCourseId }}</a>&nbsp;
        }
      </p>

      <nav class="tabs">
        <a routerLink="assignments" routerLinkActive="active">Assignments</a>
        <a routerLink="roster" routerLinkActive="active">Roster</a>
      </nav>

      <div class="outlet">
        <router-outlet />
      </div>
    </section>
  `,
})
export class CourseShellComponent {
  private readonly courseData = inject(CourseDataService);

  // Option A: the router sets this input from the :courseId route parameter.
  readonly courseId = input.required<string>();

  // undefined = loading, null = no such course.
  private readonly courseResource = this.courseData.getCourse(this.courseId);

  readonly course = computed(() => {
    if (this.courseResource.error()) {
      return null;
    }
    return this.courseResource.hasValue() ? this.courseResource.value() : undefined;
  });

  readonly courseIds = ['cs336', 'cs262', 'cs300'];

  // Switch tabs, or jump to another course, and watch: this time stays the same,
  // because Angular reuses the shell. That's why courseId must be read reactively.
  readonly createdAt = new Date().toLocaleTimeString();

  constructor() {
    console.log('CourseShellComponent created');
  }
}
