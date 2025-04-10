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

let allScripts = [];
let currentFilter = null;
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchScripts();

    document.getElementById('search-input').addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderScripts();
    });

    document.getElementById('mode-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const btn = document.getElementById('mode-toggle');
        btn.textContent = document.body.classList.contains('dark-mode') ? 'Light ☀️ mode' : 'Dark 🌙 mode';
    });
});

async function fetchScripts() {
    try {
        const response = await fetch(repoAPI);
        const data = await response.json();

        const scripts = data.filter(item => item.name.endsWith('.bat') || item.name.endsWith('.ps1') || item.name.endsWith('.sh'));
        allScripts = await Promise.all(scripts.map(async script => {
            const name = script.name.replace(/\.(bat|ps1|sh)$/, '');
            // Extract category based on the part before the first underscore (_)
            const category = name.split('_')[0].toUpperCase(); 
            const description = await extractDescription(script);
            return {
                name: name,
                file: script.name,
                category: category, // Set the category to the part before the underscore
                description: description
            };
        }));

        renderFilterButtons();
        renderScripts();
    } catch (error) {
        console.error('Error fetching scripts:', error);
    }
}

async function extractDescription(script) {
    const fileUrl = `${rawURL}${script.name}`;
    try {
        const res = await fetch(fileUrl);
        const data = await res.text();
        const match = data.match(/:: Description:\s*(.*)/);
        return match ? match[1] : 'No description available';
    } catch (error) {
        console.error('Error fetching description:', error);
        return 'No description available';
    }
}

function renderFilterButtons() {
    const container = document.getElementById('filter-container');
    const categories = [...new Set(allScripts.map(s => s.category))];

    const allBtn = document.createElement('button');
    allBtn.textContent = 'Show All';
    allBtn.className = 'filter-btn';
    allBtn.classList.add('active');
    allBtn.addEventListener('click', () => {
        currentFilter = null;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        allBtn.classList.add('active');
        renderScripts();
    });
    container.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = `${categoryIcons[cat] || ''} ${cat}`;
        btn.className = 'filter-btn';
        btn.addEventListener('click', () => {
            currentFilter = cat;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
            renderScripts();
        });
        container.appendChild(btn);
    });
}

function renderScripts() {
    const container = document.getElementById('scripts-container');
    container.innerHTML = '';

    const filtered = allScripts.filter(script => {
        const matchesCategory = currentFilter ? script.category === currentFilter : true;
        const matchesSearch = script.name.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p>No results found</p>';
        return;
    }

    filtered.forEach(script => {
        const scriptDiv = document.createElement('div');
        scriptDiv.className = 'script-item';

        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = `${rawURL}${script.file}`;
        titleLink.target = '_blank';
        titleLink.textContent = `${categoryIcons[script.category] || ''} ${script.name}`;
        title.appendChild(titleLink);
        scriptDiv.appendChild(title);

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = `${rawURL}${script.file}`;
        downloadLink.download = script.file;  // This ensures the file is downloaded instead of opened in the browser
        downloadLink.textContent = 'Download Script';
        downloadLink.className = 'download-btn';
        scriptDiv.appendChild(downloadLink);

        const description = document.createElement('p');
        description.textContent = script.description;
        scriptDiv.appendChild(description);

        container.appendChild(scriptDiv);
    });
}
