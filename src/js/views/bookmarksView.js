import PreviewView from "./PreviewView";

class BookmarkView extends PreviewView {
   _parentEl = document.querySelector('.bookmarks__list');
   _message = ``;
   _errorMessage = `No bookmark yet. Find a nice recipe and add to bookmark ;)😋`;

   addHandlerBookmarks(handler) {
      window.addEventListener('load', handler())
   }
}

export default new BookmarkView();