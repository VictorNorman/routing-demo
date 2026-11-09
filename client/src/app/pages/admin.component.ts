import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';

import { CourseDataService } from '../data/course-data.service';

// Protected twice: adminGuard (in the browser, for user experience)
// and requireAdmin middleware (on the server, for security).
@Component({
  selector: 'app-admin',
  template: `
    <h2>Admin: all grades</h2>
    <p class="hint">The route guard let you in. Now the server decides whether you see the data.</p>

    @if (errorMessage(); as message) {
      <p class="error">Server said: {{ message }}</p>
    } @else {
      <table>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Grade</th>
        </tr>
        @for (record of gradesResource.value(); track record.student) {
          <tr>
            <td>{{ record.student }}</td>
            <td>{{ record.course }}</td>
            <td>{{ record.grade }}</td>
          </tr>
        }
      </table>
    }
  `,
})
export class AdminComponent {
  private readonly courseData = inject(CourseDataService);

  private readonly gradesResource = this.courseData.getAllGrades();

  readonly grades = this.gradesResource.value;
  readonly errorMessage = computed(() => {
    const error = this.gradesResource.error() as HttpErrorResponse | undefined;
    return error ? `${error.status} ${error.error?.error ?? error.statusText}` : null;
  });
}
