import View from "./View";
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
   _parentEl = document.querySelector('.upload');

   _window = document.querySelector('.add-recipe-window');
   _overlay = document.querySelector('.overlay');
   _btnOpen = document.querySelector('.nav__btn--add-recipe');
   _btnClose = document.querySelector('.btn--close-modal');
   _message = 'Recipe successfully uploaded and added to your bookmark! ;)'

   constructor() {
      super();
      this._addHandlerShowModal();
      this._addHandlerCloseModal();
   }

  toggleWindow() {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
   }

   _addHandlerShowModal() {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
   }

   _addHandlerCloseModal() {
      this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
      this._overlay.addEventListener('click', this.toggleWindow.bind(this))
   }

   addHandlerUpload(handler) {
      this._parentEl.addEventListener('submit', function(e) {
         e.preventDefault();
         const dataArr = [...new FormData(this)];
         const data = Object.fromEntries(dataArr) //converts an array or entries into an object

         handler(data);
      })
   }
}

export default new AddRecipeView();