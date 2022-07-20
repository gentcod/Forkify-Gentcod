import View from "./View";
import icons from 'url:../../img/icons.svg';

class PaginNationView extends View {
    _parentEl = document.querySelector('.pagination')
    _pageNum;

    _generateMarkUp() {
        const curPage = this._data.page
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages)

        //Page 1, other pages
        if (curPage === 1 && numPages > 1) {
            return `
            <button data-goto ="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }

        
        //Last page
        if (curPage === numPages && numPages > 1) {
            return `
            <button data-goto ="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `
        }
        
        //Other page
        if (curPage !== 1 && curPage < numPages) {
            return `
            <button data-goto ="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            <button data-goto ="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }

        //Page 1 and No other pages
        return
    }

    addHandlerToggle(handler) {
        this._parentEl.addEventListener('click', function (e) {
            e.preventDefault();
            
            const btn = e.target.closest('.btn--inline')
            if (!btn) return;
            
            const goTo = +btn.dataset.goto
            handler(goTo)
        })
    }
}

export default new PaginNationView();

