const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';
let offset = 0;
const limit = 22;

//FETCH POKEMONS
async function fetchPokemons() {
  try {
   
    const response = await fetch(`${POKEAPI_URL}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    renderPokemons(data.results);
    offset += limit;
  } catch (error) {
    console.error('Error by Fetching', error);
    
  }
  hideLoading();
}
//RENDER POKEMONS
async function renderPokemons(pokemons) {
  const pokedexRef = document.getElementById('pokedex');
  let cardsHTML = '';

  for (let i = 0; i < pokemons.length; i++) {
    const response = await fetch(pokemons[i].url);
    const pokemonData = await response.json();
    cardsHTML += pokemonCardHTML(pokemonData);  
  }
  pokedexRef.innerHTML += cardsHTML;  
}

// POKEMON DETAILS
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.classList.add('hidden'); 
}


function handleOverlayClick(event) {
  const overlay = document.getElementById('overlay');
  

  if (event.target === overlay) {
    closeOverlay();
  }
}

//LOAD MORE POKEMONS BUTTON
function loadMorePokemons() {
  if (isSearching) {
    return;
  }

  showLoading(); 
  setTimeout(() => {
    fetchPokemons(); 
  }, 300);
}

//LOADING SCREEN SHOW
function showLoading() {
  const showLoadingRef = document.getElementById('loading');
  showLoadingRef.classList.remove('hidden');
  document.getElementById('load-more').disabled = true;
 
}

//LOADING SCREEN HIDE
function hideLoading() {
  const hideLoadingRef = document.getElementById('loading');
  hideLoadingRef.classList.add('hidden');
  document.getElementById('load-more').disabled = false;
 
}

async function navigatePokemon(direction) {
  const overlay = document.getElementById('overlay');
  let currentPokemonId = parseInt(overlay.dataset.currentPokemonId);
  const nextPokemonId = currentPokemonId + direction;
  if (nextPokemonId < 1) return; 
  showDetails(nextPokemonId);
}


let isSearching = false; 

function searchPokemons(input) {
  const searchQuery = input.value.trim().toLowerCase();

  if (searchQuery.length < 3) {
    return;
  }

  const loadMoreButton = document.getElementById('load-more');
  isSearching = true;
  loadMoreButton.disabled = true;
  searchForPokemons(searchQuery);
}

async function searchForPokemons(query) {
  showLoading();
  try {
    const allPokemonResponse = await fetch(`${POKEAPI_URL}?limit=1000`);
    const allPokemonData = await allPokemonResponse.json();
    const filteredPokemons = [];

    for (let i = 0; i < allPokemonData.results.length; i++) {
      const pokemon = allPokemonData.results[i];
      if (pokemon.name.includes(query)) {
        filteredPokemons.push(pokemon);
      }
    }


    if (filteredPokemons.length === 0) {
      displayNoResultsMessage(); 
    } else {
     
      const limitedPokemons = filteredPokemons.slice(0, 10);
      document.getElementById('pokedex').innerHTML = ''; 
      await renderPokemons(limitedPokemons);
    }


    document.getElementById('load-more').disabled = true;
  } catch (error) {
    console.error('Error searching Pokémon:', error);
  }
  hideLoading(); 
}

function displayNoResultsMessage() {
  const pokedex = document.getElementById('pokedex');
  pokedex.innerHTML = '<div class="no-results">No Resulsts!</div>';
}
fetchPokemons();
