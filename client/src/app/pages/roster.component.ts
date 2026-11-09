import { Component, inject, input } from '@angular/core';

import { CourseDataService } from '../data/course-data.service';

// A child route: renders inside CourseShellComponent's <router-outlet>.
@Component({
  selector: 'app-roster',
  template: `
    <p class="component-label">RosterComponent · created at {{ createdAt }}</p>
    <h3>Roster</h3>
    <ul class="roster">
      @for (student of students(); track student) {
        <li>{{ student }}</li>
      } @empty {
        <li>No students.</li>
      }
    </ul>
  `,
})
export class RosterComponent {
  private readonly courseData = inject(CourseDataService);

  // The router sets this from the parent's :courseId (see paramsInheritanceStrategy).
  readonly courseId = input.required<string>();

  // The students endpoint is protected by requireAuth middleware on the server.
  readonly students = this.courseData.getStudents(this.courseId).value;

  readonly createdAt = new Date().toLocaleTimeString();
}
