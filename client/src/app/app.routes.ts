import { Routes } from '@angular/router';

import { adminGuard, authGuard } from './auth/auth.guards';
import { AdminComponent } from './pages/admin.component';
import { AssignmentListComponent } from './pages/assignment-list.component';
import { CourseListComponent } from './pages/course-list.component';
import { CourseShellComponent } from './pages/course-shell.component';
import { LoginComponent } from './pages/login.component';
import { NotFoundComponent } from './pages/not-found.component';
import { RosterComponent } from './pages/roster.component';

// The route table from the slides, plus /login and /admin for the guard demos.
export const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'courses', component: CourseListComponent },
  {
    path: 'courses/:courseId',
    component: CourseShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'assignments', pathMatch: 'full' },
      { path: 'assignments', component: AssignmentListComponent },
      { path: 'roster', component: RosterComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', component: NotFoundComponent },
];
