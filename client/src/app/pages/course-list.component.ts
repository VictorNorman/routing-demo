import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CourseDataService } from '../data/course-data.service';

@Component({
  selector: 'app-course-list',
  imports: [RouterLink],
  template: `
    <h2>All courses</h2>
    <ul class="course-list">
      @for (course of courses(); track course.id) {
        <li>
          <a [routerLink]="['/courses', course.id]">
            <b>{{ course.id }}</b> · {{ course.name }}
          </a>
        </li>
      }
    </ul>
    <p class="hint">
      Also try a course that doesn't exist:
      <a routerLink="/courses/cs999">/courses/cs999</a>
    </p>
  `,
})
export class CourseListComponent {
  private readonly courseData = inject(CourseDataService);

  readonly courses = this.courseData.getCourses().value;
}
