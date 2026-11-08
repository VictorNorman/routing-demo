import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

import { CourseDataService, GradeRecord } from '../data/course-data.service';

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
        @for (record of grades(); track record.student) {
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

  readonly grades = signal<GradeRecord[]>([]);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.courseData.getAllGrades().subscribe({
      next: (records) => this.grades.set(records),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(`${error.status} ${error.error?.error ?? error.statusText}`);
      },
    });
  }
}
