const fs = require('fs');
const path = require('path');

const srcPath = 'frontend/src/pages/AdminDashboard.jsx';
const outDir = 'frontend/src/components/admin';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split('\n');

// Grab imports (first 26 lines, index 0 to 25)
const imports = lines.slice(0, 26).join('\n');

const panels = [
  { name: 'OverviewPanel', start: 27, end: 206 },
  { name: 'StudentsPanel', start: 207, end: 601 },
  { name: 'TeachersPanel', start: 602, end: 951 },
  { name: 'ClassroomsPanel', start: 952, end: 1292 },
  { name: 'AllocatePanel', start: 1293, end: 1587 },
  { name: 'ViewAllocationsPanel', start: 1588, end: 1966 }
];

panels.forEach(panel => {
  const panelCode = lines.slice(panel.start, panel.end + 1).join('\n');
  const fileContent = imports + '\n\n' + panelCode + '\n\nexport default ' + panel.name + ';\n';
  fs.writeFileSync(path.join(outDir, panel.name + '.jsx'), fileContent);
});

const adminCode = lines.slice(1967).join('\n');
const newAdminImports = [
  "import React, { useEffect, useState } from 'react';",
  "import axios from 'axios';",
  "import { useSearchParams } from 'react-router-dom';",
  "",
  "import OverviewPanel from '../components/admin/OverviewPanel';",
  "import StudentsPanel from '../components/admin/StudentsPanel';",
  "import TeachersPanel from '../components/admin/TeachersPanel';",
  "import ClassroomsPanel from '../components/admin/ClassroomsPanel';",
  "import AllocatePanel from '../components/admin/AllocatePanel';",
  "import ViewAllocationsPanel from '../components/admin/ViewAllocationsPanel';"
].join('\n');

const newAdminCode = newAdminImports + '\n\n' + adminCode;
fs.writeFileSync(srcPath, newAdminCode);
console.log('Split completed successfully.');
