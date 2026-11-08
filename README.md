# Routing demo: CS Courses

A classroom demo for the Routing deck. It's the deck's running example, a
course app with a course list and Assignments/Roster tabs for each course,
built with Angular 22 and an Express 5 server.

## Run it

Needs Node 22.22 or newer (Angular 22 requires it). Check with `node --version`.

```bash
npm run setup      # installs server and client packages (once)
npm run demo       # builds the Angular app, then starts the server
```

Open http://localhost:3000. Keep the terminal visible: the server logs every
request and labels it `PAGE`, `data` or `file`.

| Command | What it does |
|---|---|
| `npm start` | Start the server **with** the index.html fallback |
| `npm run start:no-fallback` | Start it **without** the fallback (refresh on a deep link gives a 404) |
| `npm run build` | Rebuild the Angular app after editing it |
| `npm run dev --prefix client` | `ng serve` on port 4200 with live reload; run `npm start` too, for the API |

## Try it in the browser (StackBlitz)

No install needed: open
https://stackblitz.com/github/VictorNorman/routing-demo

StackBlitz installs the packages, builds the Angular app and starts the server
(`npm run stackblitz`). The first build takes a minute or two; wait for the
preview pane to show the app. Use "Open in New Tab" for the best experience.
The `--no-fallback` demo needs a local run (`npm run start:no-fallback`).

## What's on screen

- **Page loaded at …**: changes only on a full page load. Clicking around the
  Angular app leaves it alone; Refresh changes it.
- **Dashed boxes**: gray is AppComponent's `<router-outlet>`, blue is
  CourseShellComponent (the parent route), orange is its `<router-outlet>`,
  where AssignmentList or Roster appears. Each shows the time it was created.
- **Router events**: the last few NavigationStart/End/Cancel events, including
  the trigger (`imperative` for a click, `popstate` for Back/Forward).

## Demo script, slide by slide

**How browsers route: "What happens when you click a plain link?"**
1. Open *Static file server* (link at the bottom). Click through. Each URL is a
   file on disk; `cs262` has no file, so it's a 404.
2. Open *Server-rendered pages*. The "generated at" time changes on every
   click: the server builds each page.

**"Two ways a server maps a path to a response"**
- Static: `server/public/static-site/`. Express: the `/server-rendered` routes in
  `server/server.js`.

**"A tiny router in plain JavaScript"**
1. Open *Tiny vanilla router*. Click `cs336`, `cs262`: the view changes, the
   page-loaded time doesn't. The log shows `pushState` but no `popstate`.
2. Press Back: the log shows `popstate fired`.
3. Click *Courses, without data-link*: a full page reload (the log restarts).
   That's why `a[data-link]` matters.
4. Code: `server/public/vanilla/router.js`, the slide's code plus a route table.

**"Press Refresh. What happens?" and the fallback**
1. Stop the server, run `npm run start:no-fallback`.
2. Go to http://localhost:3000, sign in, open a course's Roster. It works,
   because you started at `/`.
3. Press Refresh: **404**. The terminal shows `[PAGE] GET /courses/cs336/roster -> 404`.
4. Restart with `npm start`, Refresh again: it works. The fallback is the last
   few lines of `server/server.js`.

**"After startup, the app fetches only JSON…"**
- Click around the Angular app and watch the terminal: only `data` lines.
  Press Refresh: one `PAGE` line, then `file` lines for the scripts.

**Route table, nested routes and outlets**
- `client/src/app/app.routes.ts` is the slide's route table, plus `/login` and `/admin`.
- Switch between Assignments and Roster: the blue box's "created at" time
  stays the same (the shell is not rebuilt); the orange box's changes.
- `/courses/cs336` redirects to `/courses/cs336/assignments`.
- `/nope` shows the `'**'` Not Found page.

**"Reading the :courseId parameter"**
- Option A (input binding): `pages/course-shell.component.ts`.
- Option B (`route.parent.paramMap`): `pages/assignment-list.component.ts` and `roster.component.ts`.
- Inside a course, use the "Jump to another course" links: the URL and data
  change, but the shell's "created at" time doesn't. Angular reused the
  component, which is why the parameter has to be read reactively.
- `/courses/cs999`: the parameter matches, but the server has no such course.

**Route guards**
1. Sign out, then click a course: the guard redirects to
   `/login?returnUrl=…`. The router log shows `NavigationCancel`.
2. Sign in: you land where you were headed.
3. Code: `client/src/app/auth/auth.guards.ts`.

**"Is the admin data safe now?" (guards vs. middleware)**
1. Sign in as a **student**, click *Admin*: the guard sends you to login.
2. In DevTools > Application > Session Storage, edit `routing-demo-user` and
   change `"role": "student"` to `"role": "admin"`.
3. Click *Admin* again: the guard lets you in, but the page says
   **Server said: 403 Admins only**. The terminal shows the 403.
4. The server's checkpoint is `requireAuth` and `requireAdmin` in `server/server.js`.

## Files worth showing

```
server/server.js                    Express: logger, API, middleware, fallback
server/public/vanilla/router.js     The tiny vanilla router
server/public/static-site/          Files on disk = URLs
client/src/app/app.routes.ts        The Angular route table
client/src/app/app.config.ts        provideRouter, withComponentInputBinding
client/src/app/auth/auth.guards.ts  authGuard, adminGuard
client/src/app/pages/               One component per route
```

Data is in memory (`server/data.js`) and resets when the server restarts.
