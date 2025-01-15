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
  document.getElementById('overlay').classList.add('hidden');  
}

//LOAD MORE POKEMONS BUTTON
function loadMorePokemons() {
  if (isSearching) {
    // If a search is active, do not allow loading more
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


let isSearching = false; // Zustand der Suche

function searchPokemons(input) {
  const searchQuery = input.value.trim().toLowerCase();

  const loadMoreButton = document.getElementById('load-more');
  if (searchQuery.length < 3) {
    isSearching = false; // Suche deaktivieren
    document.getElementById('pokedex').innerHTML = '';
    fetchPokemons(); // Initiale Liste erneut laden
    loadMoreButton.disabled = false; // "Load More"-Button aktivieren
    return;
  }

  isSearching = true; // Suche aktivieren
  loadMoreButton.disabled = true; // "Load More"-Button deaktivieren
  searchForPokemons(searchQuery);
}

async function searchForPokemons(query) {
  showLoading();
  try {
    const allPokemonResponse = await fetch(`${POKEAPI_URL}?limit=1000`); // Fetch all Pokémon
    const allPokemonData = await allPokemonResponse.json();
    const filteredPokemons = [];

    for (let i = 0; i < allPokemonData.results.length; i++) {
      const pokemon = allPokemonData.results[i];
      if (pokemon.name.includes(query)) {
        filteredPokemons.push(pokemon);
      }
    }

    // Limit the displayed Pokémon to 10
    const limitedPokemons = filteredPokemons.slice(0, 10);

    // Clear the Pokedex and render the limited results
    document.getElementById('pokedex').innerHTML = '';
    await renderPokemons(limitedPokemons);

    // Disable the Load More button when search results are displayed
    document.getElementById('load-more').disabled = true;
  } catch (error) {
    console.error('Error searching Pokémon:', error);
  }
  hideLoading(); // Hide the loading spinner
}


fetchPokemons();
