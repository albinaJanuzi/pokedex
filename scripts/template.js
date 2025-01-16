function getPokemonTypesHTML(pokemon, typeImages) {
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


function pokemonCardHTML(pokemon) {
  const typeImages = {
    grass: './images/grass-logo.png',
    fire: './images/fire-logo.png',
    flying: './images/flying-logo.png',
    poison: './images/poison-logo.png',
    water: './images/water-logo.png',
    fairy: './images/fairy.png',
    electric: './images/electric-logo.png',
    normal: './images/normal-logo.webp',
    ground: './images/ground-logo.png',
    bug: './images/bug-logo.png',
    fighting: './images/fighting-logo.jpg',
    psychic: './images/psychic-logo.png',
  };
  const typesHTML = getPokemonTypesHTML(pokemon, typeImages);
  const mainTypeClass = (pokemon.types && pokemon.types.length > 0) ? pokemon.types[0].type.name : 'unknown';

  return `
    <div class="pokemon-card ${mainTypeClass}" onclick="showDetails(${pokemon.id})">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="name">${pokemon.name}</div>
      <div class="types">${typesHTML}</div>
    </div>
  `;
}


function generateTypesHTML(types) {
  let typesHTML = '';
  for (let i = 0; i < types.length; i++) {
    typesHTML += `<span class="pokemon-card type ${types[i].type.name}">${types[i].type.name}</span>`;
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


function generatePokemonDetailsHTML(pokemon) {
  const typesHTML = generateTypesHTML(pokemon.types);
  const abilitiesHTML = generateAbilitiesHTML(pokemon.abilities);

  const heightInMeter = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  return `
    <h2>${pokemon.name}</h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    <p>Height: ${heightInMeter} m</p>
    <p>Weight: ${weightInKg} kg</p>
    <p>Base Experience: ${pokemon.base_experience}</p>
    <div class="abilities">Abilities: ${abilitiesHTML}</div>  
    <div class="types">${typesHTML}</div>
  `;
}


async function showDetails(pokemonId) {
  const pokemon = await fetchPokemonDetails(`${POKEAPI_URL}${pokemonId}`);
  const overlay = document.getElementById('overlay');
  const details = document.getElementById('pokemonDetails');

  details.innerHTML = generatePokemonDetailsHTML(pokemon);

  overlay.dataset.currentPokemonId = pokemonId;
  overlay.classList.remove('hidden');
  document.body.classList.add('no-scroll'); 
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