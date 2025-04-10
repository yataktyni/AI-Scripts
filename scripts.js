// Toggle dark/light mode
const toggleBtn = document.getElementById('mode-toggle');
const body = document.getElementById('body');

function updateToggleLabel() {
  toggleBtn.textContent = body.classList.contains('dark-mode') ? 'Light ☀️ mode' : 'Dark 🌙 mode';
}

function toggleMode() {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateToggleLabel();
}

toggleBtn.addEventListener('click', toggleMode);

// Load preferred theme
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}
updateToggleLabel();

// Define scripts array
const scriptFiles = [
  'wsl_clean.bat',
  'wsl_start.bat',
  'wsl_stop.bat',
  'gaming_cache_clear.bat',
  'gaming_optimize.bat',
  'workstation_focus.bat',
  'workstation_power.bat',
];

const scriptGroups = {};

function getGroupName(fileName) {
  const name = fileName.split('_')[0].toUpperCase();
  return name;
}

function getTag(name) {
  if (name.includes('gaming')) return 'GAMING';
  if (name.includes('workstation')) return 'WORKSTATION';
  if (name.includes('wsl')) return 'WSL';
  return 'OTHER';
}

function renderScripts(filter = 'all') {
  const container = document.getElementById('scripts-container');
  container.innerHTML = '<h2>Available Scripts:</h2>';

  Object.entries(scriptGroups).forEach(([group, files]) => {
    if (filter !== 'all' && filter !== group) return;

    const groupTitle = document.createElement('h3');
    groupTitle.textContent = group;
    groupTitle.style.marginTop = '1.5rem';
    container.appendChild(groupTitle);

    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'script-item';

      const fileName = document.createElement('strong');
      fileName.textContent = file;

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = getTag(file);

      const download = document.createElement('a');
      download.href = file;
      download.download = file;
      download.textContent = 'Download';
      download.className = 'download-btn';

      div.appendChild(fileName);
      div.appendChild(document.createElement('br'));
      div.appendChild(tag);
      div.appendChild(document.createElement('br'));
      div.appendChild(download);
      container.appendChild(div);
    });
  });
}

// Group scripts by prefix
scriptFiles.forEach(file => {
  const group = getGroupName(file);
  if (!scriptGroups[group]) scriptGroups[group] = [];
  scriptGroups[group].push(file);
});

// Populate dropdown
const select = document.getElementById('group-select');
Object.keys(scriptGroups).forEach(group => {
  const opt = document.createElement('option');
  opt.value = group;
  opt.textContent = group;
  select.appendChild(opt);
});

select.addEventListener('change', (e) => {
  renderScripts(e.target.value);
});

renderScripts();
