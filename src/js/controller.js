import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import pagingnationView from './views/pagingnationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////
//Initialize website functionalities
const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    
    //Load spinner to await data fetch
    if (!id) return;
    recipeView.renderSpinner();

    //1. Update search recipe
    resultView.update(model.getSearchResultPage());
    
    //2.. Update bookmark
    bookmarksView.update(model.state.bookmarks);

    //3. Loading recipe
    await model.loadRecipe(id);
    
    
    //4. Rendring recipe
    recipeView.render(model.state.recipe);
    
    
  } catch (err) {
    recipeView.renderError();
  }

  // controlServings();
}

//Initialize search functionalities
const controlSearchRecipes = async function() {
  try{
    //1. Get search query
    const query = searchView.getQuery();
    if(!query) return;

    resultView.renderSpinner();
    
    //2. Get query data
    await model.loadSearchResult(query);

    //3. Render search result
    resultView.render(model.getSearchResultPage());

    //4. Render padingnation
    pagingnationView.render(model.state.search);
  } catch (err) {
    console.log(err)
  }
}

//Initialize Pagination
const controlPagination = function (goToPage) {

  //3. Render NEW search result
  resultView.render(model.getSearchResultPage(goToPage));

  //4. Render NEW padingnation
  pagingnationView.render(model.state.search);
}

const controlServings = function (newServings) {
  //Update recipe newServings (in state)
  model.updateServings(newServings);

  //Update the view or UI
  recipeView.update(model.state.recipe);
}

const controlBookmark = function() {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  else {
    model.removeBookmark(model.state.recipe.id);
  }

  // 2.Update bookmarks
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

//Initialize bookmarks: alternative is to render bookmark in controlRecipe function
const controlLoadBookmarks = function() {
  //Load bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
 try{
    // console.log(newRecipe)
    addRecipeView.renderSpinner();

    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render success message
    addRecipeView.renderMessage();

    //Render new recipe data
    recipeView.render(model.state.recipe);

    //Render bookmark
    bookmarksView.render(model.state.bookmarks);

    //Change form URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`) //takes in 3 parameters state, title and url hash

    //Close modal
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

//Initialize handler functions
const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.adddHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  pagingnationView.addHandlerToggle(controlPagination);
  bookmarksView.addHandlerBookmarks(controlLoadBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();