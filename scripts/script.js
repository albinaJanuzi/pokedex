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



fetchPokemons();
