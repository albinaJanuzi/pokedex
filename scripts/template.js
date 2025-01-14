function pokemonCardHTML(pokemon) {
    let typesHTML = '';

    if (pokemon.types && pokemon.types.length > 0) {
        for (let i = 0; i < pokemon.types.length; i++) {
            typesHTML += `<span class="type ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</span>`;
        }
    } else {
        typesHTML = '<span class="type unknown">No Types</span>';
    }

    // Display URL below types
    return `
      <div class="pokemon-card" onclick="showDetails(${pokemon.id})">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="name">${pokemon.name}</div>
        <div class="types">${typesHTML}</div>
      </div>
    `;
}
