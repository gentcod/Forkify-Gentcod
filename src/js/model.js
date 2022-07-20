import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE as resNum, API_KEY } from './config.js';
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";


export const state = {
    recipe: {

    },

    search: {
        page: 1,
        query: '',
        results: [],
        resultsPerPage: resNum,
    },

    bookmarks: [],
    
}

const createRecipeObject = function(data) {
    const {recipe} = data.data
    // console.log(recipe)

    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (err) {
        // console.error(`${err}`)
        throw err;
    }
}

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        const {recipes} = data.data;
        // console.log(recipes)

        state.search.results = recipes.map(recipe => {
            return  {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key}),

            }
        });

        //Reset search page to first page when new query is requested
        state.search.page = 1;

        // console.log(state.search.results)

    } catch (err) {
        throw err;
    }
}

export const getSearchResultPage = function(page = 1) {
    state.search.page = page;

    const start = (page -1) * state.search.resultsPerPage; //0
    const end = page * state.search.resultsPerPage; //9

    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings) {
    // console.log(state.recipe.ingredients)
    state.recipe.ingredients.forEach(ing => ing.quantity = (ing.quantity * newServings) / state.recipe.servings);
    state.recipe.servings = newServings;
}

const persistBookmark = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
    //Add bookmark
    state.bookmarks.push(recipe)

    //Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmark();
}

export const removeBookmark = function(id) {
    const recipe = state.bookmarks.findIndex(el => el.id === id)
    //Remove bookmark
    state.bookmarks.splice(recipe, 1)
    
    //Mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmark()
}

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    const data = JSON.parse(storage);
    if (storage) state.bookmarks = data;
}
init()

const clearBookmark = function() {
    localStorage.clear('bookmarks');
}
// clearBookmark();

export const uploadRecipe = async function(newRecipe) {
    try{
        // console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            // const ingArr = ing[1].replaceAll(' ', '').split(',');
            if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use corrent format ;)');

            const [quantity, unit, description] = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description}
        })

        const recipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe)
        state.recipe = createRecipeObject(data)

        addBookmark(state.recipe)

    } catch (err) {
        throw err;
    }
}