import icons from 'url:../../img/icons.svg';

class SearchView {
    _parentEl = document.querySelector('.search')
    _searchEl = document.querySelector('.search-results')

    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._parentEl.querySelector('.search__field').value = '';

        return query;
    }

    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        })
    }
}

export default new SearchView;