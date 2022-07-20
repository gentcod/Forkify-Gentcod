import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  constructor() {

  }

  /**
   * Renders the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g Recipe)
   * @returns {string} A markup string is returned
   * @this {Object} Instance of View
   * @author Oyefule Oluwatayo
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkUp();

    // if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _clear () {
    this._parentEl.innerHTML = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkUp();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const curElements = Array.from(this._parentEl.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]

      //Updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        //Only changes the textContent once
        curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if(!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes))
        //Change the current attributes of the current element to the attributes of the new element
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
      }
    })

  }
  
  renderMessage (message = this._message) {
    const markup = `
    <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
    `
    this._clear(this._parentEl);
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }
  
  renderSpinner () {
      const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
      `
      this._clear();
      this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

  renderError (errMsg = this._errorMessage) {
    const markup = `
    <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${errMsg}</p>
        </div>
    `
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup)
  }

}