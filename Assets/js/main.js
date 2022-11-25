const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonId = document.getElementById("pokemonId");

const maxRecords = 151;
const limit = 10;
let offset = 0;
const pokecCache = [];

const selectPokemon = async (id) => {
  console.log("cache", pokecCache);
  if (!pokecCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    pokecCache[id] = pokemon;
  } else {
    for (i = 0; i <= pokecCache.length; i++) {
      if (i == pokecCache.length) {
        if (pokecCache.length > 1) {
          console.log("maior que 3");
          const newPokecCache = pokecCache.pop(i);
          console.log("remove", newPokecCache);
          displayPopup(newPokecCache);
        } else {
          const newPokecCache = pokecCache[i - 1];
          console.log("new", newPokecCache);
        }
      }
    }
  }
};

const closePopup = () => {
  const popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
  console.log("close", popup);
};

const displayPopup = (pokemon) => {
  const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  const paddedIndex = ("00" + pokemon.id).slice(-3);
  const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIndex}.png`;
  const shiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
  const htmlString = `
  <div class="pokeId popup">
    <div class="pokeBody  ${type}" background:url('Assets/pokeballType/${type}.svg')>
      <div class="infos" style="height:100%; width:100%; background:url('Assets/pokeballType/${type}.svg') no-repeat; background-size:70% 70%; background-position:center">
        <div style="margin-top:5%; height:80%; width:30%; justify-content:center">
          <div class="imageCard">
            <img class="itemImage" src="${image}"/>
          </div>  
          <div class="shiny">
            <img class="imageShiny" src="${shiny}">
          </div>
		    </div>
          <div style="width:60%">
          <button id="closeBtn" onclick="closePopup()">Close</button>
          <h2>#${pokemon.id}. ${pokemon.name}</h2>
          <p><small>Height: </small>${pokemon.height} inches
     |       <small>Weight: </small>${pokemon.weight} lbs
     |       <small>Type: </small>${type}</p>
        </div>
      </div>
    </div>
  </div>`;
  pokemonId.innerHTML = htmlString + pokemonId.innerHTML;
  // console.log(htmlString);
};

function convertPokemonToLi(pokemon) {
  return `
        <li onclick="selectPokemon(${
          pokemon.number
        })" class="pokemon" style="background:url('Assets/pokeballType/${
    pokemon.type
  }.svg') no-repeat; background-size:contain; background-position:center" >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img class="image" src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}
function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi, (result, index) => {
      return {
        ...result,
        id: index + 1,
      };
    });
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
