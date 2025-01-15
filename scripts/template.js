function pokemonCardHTML(pokemon) {
  let typesHTML = '';
  let mainTypeClass = '';
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

  if (pokemon.types && pokemon.types.length > 0) {
    for (let i = 0; i < pokemon.types.length; i++) {
      const typeName = pokemon.types[i].type.name;

      // Check if the type has an associated image
      if (typeImages[typeName]) {
        typesHTML += `<span class="type ${typeName}" style="background-image: url('${typeImages[typeName]}');"></span>`;
      } else {
        typesHTML += `<span class="type ${typeName}">${typeName}</span>`;
      }
    }
    mainTypeClass = pokemon.types[0].type.name; // Main type
  } else {
    typesHTML = '<span class="type unknown">No Types</span>';
    mainTypeClass = 'unknown'; // Default fallback
  }

  return `
    <div class="pokemon-card ${mainTypeClass}" onclick="showDetails(${pokemon.id})">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="name">${pokemon.name}</div>
      <div class="types">${typesHTML}</div>
    </div>
  `;
}

async function showDetails(pokemonId) {
    const pokemon = await fetchPokemonDetails(`${POKEAPI_URL}${pokemonId}`);
    const overlay = document.getElementById('overlay');
    const details = document.getElementById('pokemon-details');
  
    let typesHTML = '';
    for (let i = 0; i < pokemon.types.length; i++) {
      typesHTML += `<span class="pokemon-card type  ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</span>`;
    }

    let abilitiesHTML = '';
    if (pokemon.abilities && pokemon.abilities.length > 0) {
        for (let i = 0; i < pokemon.abilities.length; i++) {
            abilitiesHTML += `<span class="ability">${pokemon.abilities[i].ability.name}</span>`;
            if (i < pokemon.abilities.length - 1) {
                abilitiesHTML += ', ';
            }
        }
    } else {
        abilitiesHTML = '<span class="ability unknown">No Abilities</span>';
    }
    
    const heightInMeter = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);

    details.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      <p>Height: ${heightInMeter} m</p>
      <p>Weight: ${weightInKg} kg</p>
      <p>Base Experience: ${pokemon.base_experience}</p>
      <div class="abilities">Abilities: ${abilitiesHTML}</div>  
      <div class="types">${typesHTML}</div>
      
    `;

    overlay.dataset.currentPokemonId = pokemonId;
    overlay.classList.remove('hidden');
  }

 