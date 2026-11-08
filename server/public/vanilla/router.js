// The tiny router from the slides, plus a route table and an on-screen log.

const viewElement = document.getElementById('view');
const logElement = document.getElementById('log');

document.getElementById('loaded-at').textContent = new Date().toLocaleTimeString();

function log(message) {
  const time = new Date().toLocaleTimeString();
  logElement.textContent = `${time}  ${message}\n` + logElement.textContent;
}

// Route table: path pattern -> function that returns the view's HTML.
const routes = [
  {
    pattern: /^\/vanilla\/?$/,
    view: () => '<h3>Home</h3><p>Pick a link above.</p>',
  },
  {
    pattern: /^\/vanilla\/courses$/,
    view: () => '<h3>All courses</h3><p>cs336, cs262, cs300</p>',
  },
  {
    pattern: /^\/vanilla\/courses\/([^/]+)$/,
    view: (courseId) => `<h3>Course ${courseId}</h3><p>The course ID came from the URL.</p>`,
  },
];

function render(pathname) {
  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match) {
      viewElement.innerHTML = route.view(...match.slice(1));
      log(`render(${pathname})`);
      return;
    }
  }
  viewElement.innerHTML = '<h3>Not found</h3><p>No route matches this path.</p>';
  log(`render(${pathname}) -> not found`);
}

// 1. Intercept clicks on in-app links
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-link]');
  if (!link) return;
  event.preventDefault();
  history.pushState({}, '', link.href);   // 2. change URL
  log(`pushState(${link.pathname}) -- note: no popstate event`);
  render(location.pathname);               // 3. draw the view
});

// 4. Back and Forward fire popstate
window.addEventListener('popstate', () => {
  log(`popstate fired, location.pathname is now ${location.pathname}`);
  render(location.pathname);
});

// On startup (first load, refresh or deep link): render whatever the URL says.
const [navigationEntry] = performance.getEntriesByType('navigation');
log(`page loaded (navigation type: ${navigationEntry?.type ?? 'unknown'})`);
render(location.pathname);
