// Routing demo server.
//
//   npm start                  -> with the index.html fallback (refresh and deep links work)
//   npm run start:no-fallback  -> without it (refresh on /courses/cs336 gives a 404)
//
// Watch this terminal while you click around: it logs every request the
// browser makes, so you can see that client-side navigation sends only
// data requests, while a refresh sends a request for a whole page.

import express from 'express';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { courses, assignmentsByCourse, studentsByCourse, grades } from './data.js';

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const angularDist = path.join(serverDir, '..', 'client', 'dist', 'client', 'browser');
const publicDir = path.join(serverDir, 'public');

const port = Number(process.env.PORT ?? 3000);
const fallbackEnabled = !process.argv.includes('--no-fallback');

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// Request logger: shows what kind of request each one is.
// ---------------------------------------------------------------------------
function describeRequest(req) {
  const requestPath = req.originalUrl.split('?')[0];
  if (requestPath.startsWith('/api/')) {
    return 'data';
  }
  if (path.extname(requestPath) !== '' && !requestPath.endsWith('.html')) {
    return 'file';
  }
  return 'PAGE';
}

app.use((req, res, next) => {
  res.on('finish', () => {
    const kind = describeRequest(req).padEnd(4);
    console.log(`[${kind}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

// ---------------------------------------------------------------------------
// A very small sign-in system. Tokens live in memory.
// ---------------------------------------------------------------------------
const usersByToken = new Map();

app.post('/api/login', (req, res) => {
  const role = req.body?.role === 'admin' ? 'admin' : 'student';
  const name = role === 'admin' ? 'Prof. Admin' : 'Sam Student';
  const token = randomUUID();
  usersByToken.set(token, { name, role });
  res.json({ name, role, token });
});

// Middleware: the server's checkpoint. Runs before the route handler.
function requireAuth(req, res, next) {
  const header = req.get('Authorization') ?? '';
  const token = header.replace('Bearer ', '');
  const user = usersByToken.get(token);

  if (!user) {
    return res.status(401).json({ error: 'Not signed in' });
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}

// ---------------------------------------------------------------------------
// The API the Angular app calls (JSON only).
// ---------------------------------------------------------------------------
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/courses/:courseId', (req, res) => {
  const course = courses.find((candidate) => candidate.id === req.params.courseId);
  if (!course) {
    return res.status(404).json({ error: `No course called ${req.params.courseId}` });
  }
  res.json(course);
});

app.get('/api/courses/:courseId/assignments', (req, res) => {
  res.json(assignmentsByCourse[req.params.courseId] ?? []);
});

app.get('/api/courses/:courseId/students', requireAuth, (req, res) => {
  res.json(studentsByCourse[req.params.courseId] ?? []);
});

app.get('/api/admin/grades', requireAuth, requireAdmin, (req, res) => {
  res.json(grades);
});

// Unknown API paths get a real 404 (never the index.html fallback).
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'No such API endpoint' });
});

// ---------------------------------------------------------------------------
// Demo: an application server that builds every page on the server
// (slide "Two ways a server maps a path to a response").
// ---------------------------------------------------------------------------
function serverPage(title, body) {
  const generatedAt = new Date().toLocaleTimeString();
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/demo-pages.css">
  </head>
  <body>
    <p class="banner">Server-rendered page · generated at ${generatedAt} · every click is a full page load</p>
    <h1>${title}</h1>
    ${body}
    <p><a href="/">← Back to the Angular app</a></p>
  </body>
</html>`;
}

app.get('/server-rendered/courses', (req, res) => {
  const items = courses
    .map((course) => `<li><a href="/server-rendered/courses/${course.id}">${course.id} · ${course.name}</a></li>`)
    .join('');
  res.send(serverPage('All courses', `<ul>${items}</ul>`));
});

app.get('/server-rendered/courses/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const course = courses.find((candidate) => candidate.id === courseId);
  if (!course) {
    return res.status(404).send(serverPage('Not found', `<p>No course called ${courseId}.</p>`));
  }
  const items = (assignmentsByCourse[courseId] ?? [])
    .map((assignment) => `<li>${assignment.title} (due ${assignment.due})</li>`)
    .join('');
  const body = `<p>${course.name} · ${course.term}</p>
    <h2>Assignments</h2>
    <ul>${items}</ul>
    <p><a href="/server-rendered/courses">← All courses</a></p>`;
  res.send(serverPage(`Course ${courseId}`, body));
});

// ---------------------------------------------------------------------------
// Static files: the static-site demo, the vanilla router demo, and the
// built Angular app. Real files always win over the fallback.
// ---------------------------------------------------------------------------
app.use(express.static(publicDir));

if (existsSync(angularDist)) {
  app.use(express.static(angularDist));
} else {
  console.warn('Angular build not found. Run "npm run build" first.');
}

// The static-site demo has no fallback: a missing file is a real 404.
app.use('/static-site', (req, res) => {
  res.status(404).send('404 Not Found: there is no file for this path.');
});

// ---------------------------------------------------------------------------
// The fallback: no file matched, so send the app shell and let the
// client-side router read the URL.
// ---------------------------------------------------------------------------
if (fallbackEnabled) {
  app.use('/vanilla', (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    res.sendFile(path.join(publicDir, 'vanilla', 'index.html'));
  });

  app.use((req, res, next) => {
    if (req.method !== 'GET' || !existsSync(angularDist)) {
      return next();
    }
    res.sendFile(path.join(angularDist, 'index.html'));
  });
}

app.listen(port, () => {
  console.log('');
  console.log(`Routing demo running at http://localhost:${port}`);
  console.log(`index.html fallback: ${fallbackEnabled ? 'ON' : 'OFF (refresh on a deep link gives a 404)'}`);
  console.log('');
  console.log('Demos:');
  console.log(`  Angular app           http://localhost:${port}/courses`);
  console.log(`  Tiny vanilla router   http://localhost:${port}/vanilla/`);
  console.log(`  Static file server    http://localhost:${port}/static-site/`);
  console.log(`  Server-rendered pages http://localhost:${port}/server-rendered/courses`);
  console.log('');
});
