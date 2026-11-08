import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
@Injectable({ providedIn: 'root' })
export class CourseDataService {
  private readonly http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses');
  }

  getCourse(courseId: string): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`);
  }

  getAssignments(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`/api/courses/${courseId}/assignments`);
  }

  getStudents(courseId: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/courses/${courseId}/students`);
  }

  getAllGrades(): Observable<GradeRecord[]> {
    return this.http.get<GradeRecord[]>('/api/admin/grades');
  }
}
