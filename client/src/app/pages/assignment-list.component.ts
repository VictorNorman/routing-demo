import { Component, inject, input } from '@angular/core';

import { CourseDataService } from '../data/course-data.service';

// A child route: renders inside CourseShellComponent's <router-outlet>.
@Component({
  selector: 'app-assignment-list',
  template: `
    <p class="component-label">AssignmentListComponent · created at {{ createdAt }}</p>
    <h3>Assignments</h3>
    <table>
      <tr>
        <th>Assignment</th>
        <th>Due</th>
      </tr>
      @for (assignment of assignments(); track assignment.id) {
        <tr>
          <td>{{ assignment.title }}</td>
          <td>{{ assignment.due }}</td>
        </tr>
      } @empty {
        <tr>
          <td colspan="2">No assignments.</td>
        </tr>
      }
    </table>
  `,
})
export class AssignmentListComponent {
  private readonly courseData = inject(CourseDataService);

  // The router sets this from the parent's :courseId (see paramsInheritanceStrategy).
  readonly courseId = input.required<string>();

  readonly assignments = this.courseData.getAssignments(this.courseId).value;

  readonly createdAt = new Date().toLocaleTimeString();
}
