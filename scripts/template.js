function pokemonCardHTML(pokemon) {
    let typesHTML = '';

    if (pokemon.types && pokemon.types.length > 0) {
        for (let i = 0; i < pokemon.types.length; i++) {
            typesHTML += `<span class="type ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</span>`;
        }
    } else {
        typesHTML = '<span class="type unknown">No Types</span>';
    }
    return `
      <div class="pokemon-card" onclick="showDetails(${pokemon.id})">
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
      typesHTML += `<span class="type ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</span>`;
    }
  
    details.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Base Experience: ${pokemon.base_experience}</p>
      <div class="types">${typesHTML}</div>
    `;

    overlay.dataset.currentPokemonId = pokemonId;
    overlay.classList.remove('hidden');
  }

 