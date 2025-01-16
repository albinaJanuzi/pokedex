const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/'; //Pokemon daten von der PokeAPI abrufen
let offset = 0; // startindex - ab welchen pokemon die Daten laden
const limit = 24; // anzahl der pokemon

//FETCH ALL POKEMONS
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


//RENDER ALL POKEMONS
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


// POKEMON DETAILS - OVERLAY
async function fetchPokemonDetails(url) { // Details einzelnen für pokemon
  const response = await fetch(url);
  return response.json();
}


function closeOverlay() {// klasse hidden in overlay hinzufügen
  const overlayRef = document.getElementById('overlay');
  overlayRef.classList.add('hidden'); 
}


//LOAD MORE POKEMONS BUTTON
function loadMorePokemons() {
  if (isSearching) {//läuft gerade eine suche?
    return;
  }
  showLoading(); //wenn nicht dann showLoading
  setTimeout(() => {
    fetchPokemons(); 
  }, 300);
}

//LOADING SCREEN SHOW
function showLoading() {
  const showLoadingRef = document.getElementById('loading');
  showLoadingRef.classList.remove('hidden');
  document.getElementById('loadMore').disabled = true;//Load more button nicht clickbar wenn showLoading
}

//LOADING SCREEN HIDE
function hideLoading() {
  const hideLoadingRef = document.getElementById('loading');
  hideLoadingRef.classList.add('hidden');
  document.getElementById('loadMore').disabled = false;
}

//PREV-NEXT BUTTON
async function navigatePokemon(direction) {
  const overlay = document.getElementById('overlay');
  let currentPokemonId = parseInt(overlay.dataset.currentPokemonId);
  const nextPokemonId = currentPokemonId + direction;
  if (nextPokemonId < 1) return; 
  showDetails(nextPokemonId);
}

//SEARCH POKEMON
let isSearching = false; 
function searchPokemons(input) {
  const searchQuery = input.value.trim().toLowerCase();
  if (searchQuery.length < 3) {
    return;
  }
  const loadMoreButton = document.getElementById('loadMore');
  isSearching = true;
  loadMoreButton.disabled = true;
  searchForPokemons(searchQuery);
}


async function fetchAndFilterPokemons(query) {
  try {
    const allPokemonResponse = await fetch(`${POKEAPI_URL}?limit=1000`);//all
    const allPokemonData = await allPokemonResponse.json();
    return allPokemonData.results.filter(pokemon => pokemon.name.includes(query));
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    return []; 
  }
}


async function searchForPokemons(query) {//alle pokemons search und filter mit name, nur 10 ergebnisse zeigen
  showLoading();
  const filteredPokemons = await fetchAndFilterPokemons(query);
  if (filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    const limitedPokemons = filteredPokemons.slice(0, 10);
    document.getElementById('pokedex').innerHTML = ''; 
    await renderPokemons(limitedPokemons);
  }
  document.getElementById('loadMore').disabled = true;
  hideLoading();
}

fetchPokemons();
