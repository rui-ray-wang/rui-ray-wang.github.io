document.addEventListener('DOMContentLoaded', function() {
    const searchLink = document.querySelector('.search a');
    const searchForm = document.getElementById('search');
    const searchInput = searchForm.querySelector('input[name="query"]');
    const searchResultsPane = document.getElementById('search-results-pane');
    const searchResultsContent = document.getElementById('search-results-content');
    
    // Toggle search form visibility
    searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
        if (searchForm.style.display === 'block') {
            searchInput.focus();
        } else {
            searchResultsContent.innerHTML = ''; // Clear results when hiding
            searchResultsPane.classList.remove('active');
            removeHighlights();
        }
    });

    // Perform search on form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.trim() === '') {
            searchResultsContent.innerHTML = 'Please enter a search term.';
            return;
        }

        removeHighlights(); // Clear previous highlights

        const content = document.body.innerText.toLowerCase();
        const paragraphs = document.body.getElementsByTagName('p');
        const matchedSnippets = [];

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraphText = paragraphs[i].innerText.toLowerCase();
            if (paragraphText.includes(searchTerm)) {
                const startIndex = Math.max(0, paragraphText.indexOf(searchTerm) - 50);
                const endIndex = Math.min(paragraphText.length, paragraphText.indexOf(searchTerm) + searchTerm.length + 50);
                const snippet = paragraphs[i].innerText.substring(startIndex, endIndex);
                matchedSnippets.push(snippet);

                // Highlight matches in the main content
                highlightInElement(paragraphs[i], searchTerm);
            }
        }

        // Update search results
        searchResultsContent.innerHTML = `
            <p>Found ${matchedSnippets.length} match${matchedSnippets.length !== 1 ? 'es' : ''} for "${searchTerm}"</p>
            ${matchedSnippets.map(snippet => `
                <div class="search-result-item">
                    <p>${highlightSearchTerm(snippet, searchTerm)}</p>
                </div>
            `).join('')}
            <button id="clear-search">Clear Search</button>
        `;

        // Add clear search functionality
        document.getElementById('clear-search').addEventListener('click', clearSearch);

        // Show the search results pane
        searchResultsPane.classList.add('active');

        // Keep the search form visible
        searchForm.style.display = 'block';
    }

    function highlightSearchTerm(text, searchTerm) {
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function highlightInElement(element, searchTerm) {
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, '<mark>$1</mark>');
    }

    function removeHighlights() {
        const marks = document.getElementsByTagName('mark');
        while (marks.length > 0) {
            const parent = marks[0].parentNode;
            parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0]);
            parent.normalize();
        }
    }

    function clearSearch() {
        searchInput.value = '';
        searchResultsContent.innerHTML = '';
        searchResultsPane.classList.remove('active');
        removeHighlights();
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});
