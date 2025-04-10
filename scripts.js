const repoAPI = 'https://api.github.com/repos/yataktyni/AI-Scripts/contents';
const rawURL = 'https://raw.githubusercontent.com/yataktyni/AI-Scripts/main/';

const categoryIcons = {
    WSL: '🐧',
    DEV: '💻',
    NET: '🌐',
    WIN: '🪟',
    GAMING: '🎮',
    SYS: '🖥️',
    MISC: '📁'
};

document.addEventListener('DOMContentLoaded', () => {
    initMode();
    fetchScripts();
    setupSearch();
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

    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const newMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('mode', newMode);
        modeToggle.textContent = newMode === 'dark' ? 'Light 🌞 mode' : 'Dark 🌙 mode';
    });
}

async function fetchScripts() {
    const response = await fetch(repoAPI);
    const data = await response.json();

    const scriptsContainer = document.getElementById('scripts-container');
    const filterContainer = document.getElementById('filter-container');
    const categorizedScripts = categorizeScripts(data);

    createCategoryFilters(filterContainer, categorizedScripts);
    displayScripts(scriptsContainer, categorizedScripts);
}

function categorizeScripts(files) {
    const categorized = {
        WSL: [],
        DEV: [],
        NET: [],
        WIN: [],
        GAMING: [],
        SYS: [],
        MISC: []
    };

    files.forEach(file => {
        if (file.name.match(/\.(bat|ps1|sh)$/)) {
            const category = getCategory(file.name);
            categorized[category].push(file);
        }
    });

    return categorized;
}

function getCategory(fileName) {
    if (fileName.includes('wsl')) return 'WSL';
    if (fileName.includes('dev')) return 'DEV';
    if (fileName.includes('net')) return 'NET';
    if (fileName.includes('win')) return 'WIN';
    if (fileName.includes('gaming')) return 'GAMING';
    if (fileName.includes('sys')) return 'SYS';
    return 'MISC';
}

function createCategoryFilters(filterContainer, categorizedScripts) {
    const categories = Object.keys(categorizedScripts);

    categories.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = `${categoryIcons[category]} ${category}`;
        filterButton.classList.add('filter-btn');
        filterButton.addEventListener('click', () => filterScripts(category));
        filterContainer.appendChild(filterButton);
    });
}

function displayScripts(container, categorizedScripts) {
    container.innerHTML = '';

    const scripts = Object.values(categorizedScripts).flat();
    scripts.forEach(file => {
        const scriptItem = document.createElement('div');
        scriptItem.classList.add('script-item');
        scriptItem.innerHTML = `
            <h3>${file.name}</h3>
            <p>${getDescription(file.path)}</p>
            <button onclick="downloadScript('${file.download_url}')">Download</button>
        `;
        container.appendChild(scriptItem);
    });
}

function filterScripts(category) {
    const categorizedScripts = document.getElementById('scripts-container').children;
    for (let script of categorizedScripts) {
        const scriptCategory = script.querySelector('h3').textContent.split('_')[0]; // Assuming first part is the category
        script.style.display = scriptCategory === category || category === 'All' ? 'block' : 'none';
    }
}

function downloadScript(url) {
    window.open(url, '_blank');
}

async function getDescription(filePath) {
    const rawFile = await fetch(`${rawURL}${filePath}`);
    const content = await rawFile.text();
    const descriptionMatch = content.match(/^::\s*Description:\s*(.+)$/mi);
    return descriptionMatch ? descriptionMatch[1].trim() : "No description found.";
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const allScripts = document.querySelectorAll('.script-item');
        allScripts.forEach(script => {
            const scriptText = script.textContent.toLowerCase();
            script.style.display = scriptText.includes(filter) ? 'block' : 'none';
        });
    });
}
