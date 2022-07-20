import PreviewView from "./PreviewView";

class ResultView extends PreviewView {
  _parentEl = document.querySelector('.results')
  _message = `Start by searching for a recipe or an ingredient. Have fun!`;
  _errorMessage = `No recipes found for your query! Please try again ;)`;

}

export default new ResultView();