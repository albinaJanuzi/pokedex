function pokemonCardHTML(pokemon) {//bild, name, type mit passendes symbol
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


function generatePokemonDetailsHTML(pokemon) {
  const typesHTML = generateTypesHTML(pokemon.types);
  const abilitiesHTML = generateAbilitiesHTML(pokemon.abilities);

  const heightInMeter = (pokemon.height / 10).toFixed(1); // height in meter
  const weightInKg = (pokemon.weight / 10).toFixed(1); //weight in kg

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

