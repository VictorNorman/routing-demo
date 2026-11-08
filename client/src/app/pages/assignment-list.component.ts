import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

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
  private readonly route = inject(ActivatedRoute);
  private readonly courseData = inject(CourseDataService);

  // Option B: a child route reads :courseId from its parent route.
  readonly assignments = toSignal(
    this.route.parent!.paramMap.pipe(
      map((params) => params.get('courseId') ?? ''),
      switchMap((courseId) => this.courseData.getAssignments(courseId)),
    ),
    { initialValue: [] },
  );

  readonly createdAt = new Date().toLocaleTimeString();
}
