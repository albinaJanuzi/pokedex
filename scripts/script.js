const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';
let offset = 0;
const limit = 20;

//RENDER && FETCH
async function fetchPokemons() {
  try {
    const response = await fetch(`${POKEAPI_URL}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    renderPokemons(data.results);
    offset += limit;
  } catch (error) {
    console.error('Error by Fetching', error);
  }
}


async function renderPokemons(pokemons) {
  const pokedexRef = document.getElementById('pokedex');
  let cardsHTML = '';

  for (let i = 0; i < pokemons.length; i++) {
    const response = await fetch(pokemons[i].url);
    const pokemonData = await response.json();
    console.log(pokemonData);
    cardsHTML += pokemonCardHTML(pokemonData);  
  }

  pokedexRef.innerHTML = cardsHTML;  
}

fetchPokemons();


//POKEMON DETAILS
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}


function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');  
}



