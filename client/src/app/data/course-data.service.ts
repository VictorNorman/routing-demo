import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';

export interface Course {
  id: string;
  name: string;
  term: string;
}

export interface Assignment {
  id: number;
  title: string;
  due: string;
}

export interface GradeRecord {
  student: string;
  course: string;
  grade: string;
}

// After startup, the app only fetches JSON like this, never new HTML pages.
// Each method returns an httpResource: its value(), error(), and isLoading() are signals.
// Resources re-fetch automatically when a signal read inside the request function changes.
// Call these methods from an injection context (a field initializer or constructor).
@Injectable({ providedIn: 'root' })
export class CourseDataService {
  getCourses() {
    return httpResource<Course[]>(() => '/api/courses', {
      defaultValue: [],
    });
  }

  getCourse(courseId: Signal<string>) {
    return httpResource<Course>(() => `/api/courses/${courseId()}`);
  }

  getAssignments(courseId: Signal<string>) {
    return httpResource<Assignment[]>(() => `/api/courses/${courseId()}/assignments`, {
      defaultValue: [],
    });
  }

  getStudents(courseId: Signal<string>) {
    return httpResource<string[]>(() => `/api/courses/${courseId()}/students`, {
      defaultValue: [],
    });
  }

  getAllGrades() {
    return httpResource<GradeRecord[]>(() => '/api/admin/grades', {
      defaultValue: [],
    });
  }
}
