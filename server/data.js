// In-memory data for the demo. Restarting the server resets everything.

export const courses = [
  { id: 'cs336', name: 'Web Frameworks', term: 'Fall 2026' },
  { id: 'cs262', name: 'Software Engineering', term: 'Fall 2026' },
  { id: 'cs300', name: 'Software Design', term: 'Fall 2026' },
];

export const assignmentsByCourse = {
  cs336: [
    { id: 1, title: 'Lab 1: Components and templates', due: 'Sep 12' },
    { id: 2, title: 'Lab 2: Services and HTTP', due: 'Sep 26' },
    { id: 3, title: 'Lab 3: Client-side routing', due: 'Nov 13' },
  ],
  cs262: [
    { id: 1, title: 'Project proposal', due: 'Sep 19' },
    { id: 2, title: 'Requirements document', due: 'Oct 10' },
    { id: 3, title: 'Sprint 1 demo', due: 'Nov 7' },
  ],
  cs300: [
    { id: 1, title: 'SOLID principles worksheet', due: 'Sep 15' },
    { id: 2, title: 'Deep modules case study', due: 'Oct 13' },
    { id: 3, title: 'Refactoring exercise', due: 'Nov 17' },
  ],
};

export const studentsByCourse = {
  cs336: ['Ava Bakker', 'Noah De Vries', 'Mia Jansen', 'Liam Visser'],
  cs262: ['Emma Smit', 'Lucas Mulder', 'Sofia Meijer'],
  cs300: ['Daan Bos', 'Julia Vos', 'Sem Peters', 'Tess Hendriks', 'Finn Dekker'],
};

export const grades = [
  { student: 'Ava Bakker', course: 'cs336', grade: 'A-' },
  { student: 'Noah De Vries', course: 'cs336', grade: 'B+' },
  { student: 'Emma Smit', course: 'cs262', grade: 'A' },
  { student: 'Daan Bos', course: 'cs300', grade: 'B' },
];
