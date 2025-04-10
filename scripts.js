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

        const scripts = data.filter(item => item.name.endsWith('.bat') || item.name.endsWith('.ps1'));
        allScripts = scripts.map(script => {
            const name = script.name.replace(/\.(bat|ps1)$/, '');
            const categoryMatch = name.match(/^\[(.*?)\]/);
            const category = categoryMatch ? categoryMatch[1] : 'MISC';
            return {
                name: name,
                file: script.name,
                category: category.toUpperCase()
            };
        });

        renderFilterButtons();
        renderScripts();
    } catch (error) {
        console.error('Error fetching scripts:', error);
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
    const noResults = document.getElementById('no-results');
    container.innerHTML = '';

    const filtered = allScripts.filter(script => {
        const matchesCategory = currentFilter ? script.category === currentFilter : true;
        const matchesSearch = script.name.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    filtered.forEach(script => {
        const scriptDiv = document.createElement('div');
        scriptDiv.className = 'script-item';

        const title = document.createElement('h3');
        title.textContent = `${categoryIcons[script.category] || ''} ${script.name}`;
        scriptDiv.appendChild(title);

        const viewBtn = document.createElement('a');
        viewBtn.href = `${rawURL}${script.file}`;
        viewBtn.textContent = '🔗 View Script';
        viewBtn.target = '_blank';
        viewBtn.style.display = 'inline-block';
        viewBtn.style.marginTop = '10px';
        scriptDiv.appendChild(viewBtn);

        container.appendChild(scriptDiv);
    });
}
