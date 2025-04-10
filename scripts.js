const repoOwner = 'yataktyni';
const repoName = 'main';

document.addEventListener('DOMContentLoaded', () => {
    initMode();
    fetchScripts();
});

function initMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    const savedMode = localStorage.getItem('mode') || 'dark';
    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.textContent = 'Light 🌞 mode';
    } else {
        modeToggle.textContent = 'Dark 🌙 mode';
    }
}

function toggleMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    body.classList.toggle('dark-mode');
    const newMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('mode', newMode);
    modeToggle.textContent = newMode === 'dark' ? 'Light 🌞 mode' : 'Dark 🌙 mode';
}

async function fetchScripts() {
    const scriptsContainer = document.getElementById('scripts-container');
    const filterContainer = document.getElementById('filter-container');

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/`);
    const files = await response.json();

    const scriptGroups = {};

    for (const file of files) {
        if (file.name.endsWith('.bat')) {
            const prefix = file.name.includes('_') ? file.name.split('_')[0].toUpperCase() : 'MISC';
            if (!scriptGroups[prefix]) {
                scriptGroups[prefix] = [];
            }

            const description = await getDescription(file.name);

            scriptGroups[prefix].push({
                name: file.name,
                description,
                path: file.path,
                downloadUrl: file.download_url
            });
        }
    }

    const allTags = Object.keys(scriptGroups).sort();

    // Create filter buttons
    const allBtn = createFilterButton('ALL', true);
    filterContainer.appendChild(allBtn);

    allTags.forEach(tag => {
        const btn = createFilterButton(tag);
        filterContainer.appendChild(btn);
    });

    // Display scripts grouped
    allTags.forEach(tag => {
        const groupWrapper = document.createElement('div');
        groupWrapper.className = 'script-group';
        groupWrapper.dataset.group = tag;

        const groupTitle = document.createElement('h3');
        groupTitle.className = 'group-title';
        groupTitle.textContent = tag;
        groupWrapper.appendChild(groupTitle);

        scriptGroups[tag].forEach(script => {
            const scriptItem = document.createElement('div');
            scriptItem.classList.add('script-item');
            scriptItem.innerHTML = `
                <h4>${script.name}</h4>
                <p>${script.description}</p>
                <a href="${script.downloadUrl}" class="download-btn" download>⬇ Download</a>
            `;
            groupWrapper.appendChild(scriptItem);
        });

        scriptsContainer.appendChild(groupWrapper);
    });

    // Filtering logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn =>
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const groups = document.querySelectorAll('.script-group');
            groups.forEach(group => {
                if (tag === 'ALL' || group.dataset.group === tag) {
                    group.classList.remove('hidden');
                    group.classList.add('fade-in');
                } else {
                    group.classList.add('hidden');
                    group.classList.remove('fade-in');
                }
            });
        })
    );
}

function createFilterButton(tag, isActive = false) {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    if (isActive) btn.classList.add('active');
    btn.textContent = tag;
    btn.dataset.tag = tag;
    return btn;
}

async function getDescription(filePath) {
    const rawFile = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`);
    const content = await rawFile.text();
    const descriptionMatch = content.match(/^::\s*Description:\s*(.+)$/mi);
    return descriptionMatch ? descriptionMatch[1].trim() : "No description found.";
}
