const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/'; //Pokemon daten von der PokeAPI abrufen
let offset = 0; // startindex - ab welchen pokemon die Daten laden
const limit = 24; // anzahl der pokemon

//FETCH ALL POKEMONS
async function fetchPokemons() {
  showLoading(); 
  try {
    const response = await fetch(`${POKEAPI_URL}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    await renderPokemons(data.results); 
    offset += limit;
    hideLoading(); 
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    hideLoading(); 
  }
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
  document.body.classList.remove('no-scroll');
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

  const totalPokemons = offset; //Next Pokemon ID kalkulieren, wie viel pokemon geloaded sind
  let nextPokemonId = currentPokemonId + direction;

  if (nextPokemonId < 1) {
    nextPokemonId = totalPokemons; // letze pokemon
  } else if (nextPokemonId > totalPokemons) {
    nextPokemonId = 1; // erste pokemon
  }
  showDetails(nextPokemonId);
}


//SEARCH POKEMON
let isSearching = false; 
function searchPokemons(input) {
  const searchQuery = input.value.trim().toLowerCase();
  const loadMoreButton = document.getElementById('loadMore');
  const pokedex = document.getElementById('pokedex');

  if (searchQuery === '') {
    isSearching = false;
    pokedex.innerHTML = ''; 
    offset = 0; 
    fetchPokemons(); 
    loadMoreButton.disabled = false; 
    return;
  }

  if (searchQuery.length >= 3) {
    isSearching = true;
    loadMoreButton.disabled = true; 
    searchForPokemons(searchQuery);
    return;
  }
}


async function fetchAndFilterPokemons(query) {
  try {
    const allPokemonResponse = await fetch(`${POKEAPI_URL}?limit=1000`); 
    const allPokemonData = await allPokemonResponse.json();
    return allPokemonData.results.filter(pokemon => 
      pokemon.name.toLowerCase() === query || pokemon.name.toLowerCase().startsWith(query)
    );
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return [];
  }
}


async function searchForPokemons(query) {
  showLoading();
  const filteredPokemons = await fetchAndFilterPokemons(query);
  const pokedex = document.getElementById('pokedex');
  
  if (filteredPokemons.length === 0) {
    displayNoResultsMessage();
  } else {
    const limitedPokemons = filteredPokemons.slice(0, 10);
    pokedex.innerHTML = ''; 
    await renderPokemons(limitedPokemons);
  }
  
  document.getElementById('loadMore').disabled = true;
  hideLoading();
  isSearching = false; 
}


async function showDetails(pokemonId) {// html für type, height, weight, abilities
  const pokemon = await fetchPokemonDetails(`${POKEAPI_URL}${pokemonId}`);
  const overlay = document.getElementById('overlay');
  const details = document.getElementById('pokemonDetails');

  details.innerHTML = generatePokemonDetailsHTML(pokemon);

  overlay.dataset.currentPokemonId = pokemonId;
  overlay.classList.remove('hidden');
  document.body.classList.add('no-scroll'); 
}


function generateTypesHTML(types) {
  let typesHTML = '';
  for (let i = 0; i < types.length; i++) {
    typesHTML += `<span class="pokemon-card type ${types[i].type.name}">${types[i].type.name}</span>`;
  }
  return typesHTML;
}


function getPokemonTypesHTML(pokemon, typeImages) {//Html für die Typen eines Pokemons
  let typesHTML = '';
  if (pokemon.types && pokemon.types.length > 0) {
    for (let i = 0; i < pokemon.types.length; i++) {
      const typeName = pokemon.types[i].type.name;
      if (typeImages[typeName]) {
        typesHTML += `<span class="type ${typeName}" style="background-image: url('${typeImages[typeName]}');"></span>`;
      } else {
        typesHTML += `<span class="type ${typeName}">${typeName}</span>`;
      }
    }
  } else {
    typesHTML = '<span class="type unknown">No Types</span>';
  }
  return typesHTML;
}


function generateAbilitiesHTML(abilities) {
  let abilitiesHTML = '';
  if (abilities && abilities.length > 0) {
    for (let i = 0; i < abilities.length; i++) {
      abilitiesHTML += `<span class="ability">${abilities[i].ability.name}</span>`;
      if (i < abilities.length - 1) {
        abilitiesHTML += ', ';
      }
    }
  } else {
    abilitiesHTML = '<span class="ability unknown">No Abilities</span>';
  }
  return abilitiesHTML;
}


function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.body.classList.remove('no-scroll');  
  }
  

  //NO RESULT FOUND DIV
function displayNoResultsMessage() {
  const pokedex = document.getElementById('pokedex');
  pokedex.innerHTML = '<div class="no-results">No Resulsts!</div>';
}

fetchPokemons();
