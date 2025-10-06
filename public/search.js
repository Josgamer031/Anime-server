document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchQuery = document.getElementById('search-query');

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchQuery.value;
    if (query) {
      window.location.href = `catalog.html?search=${query}`;
    }
  });
});