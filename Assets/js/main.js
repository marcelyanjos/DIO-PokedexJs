const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonId = document.getElementById("pokemonId");

const maxRecords = 300;
const limit = 1000;
let offset = 0;
const pokecCache = [];

// get selected pokemon
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

// close info
const closePopup = () => {
  const popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
  console.log("close", popup);
};

// show selected pokemon info
const displayPopup = (pokemon) => {
  const hp= pokemon.stats[0].base_stat;
  const attack= pokemon.stats[1].base_stat;
  const defense= pokemon.stats[2].base_stat;
  const spAttack= pokemon.stats[3].base_stat;
  const spDefense= pokemon.stats[4].base_stat;
  const speed= pokemon.stats[5].base_stat;
  const abilities= pokemon.abilities.map((abilities)=> abilities.ability.name).join(", ");
  const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  console.log("type", type);
  console.log("types", types);
  const paddedIndex = ("00" + pokemon.id).slice(-3);
  const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIndex}.png`;
  const shiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
  const htmlString = `
  <div class="pokeId popup">
    <div class="pokeBody  ${type}" background:url('Assets/pokeballType/${type}.svg')>
      <div class="infos" style="height:100%; width:100%; background:url('Assets/pokeballType/${type}.svg') no-repeat; background-size:70% 70%; background-position:center">
        <div class="content">
          <div class="imageCard">
            <img class="itemImage" alt="${pokemon.name}" src="${image}"/>
          </div>  
          <div class="shiny">
            <img class="imageShiny" alt="${pokemon.name} shine" src="${shiny}">
          </div>
		    </div>
          <div class="root">
            <div class="header">
              <h1>Info</h1>
              <button id="closeBtn" onclick="closePopup()">Close</button>
            </div>
            <div class="nameInfo">
              <h2 class="numberInfo">No #${pokemon.id}</h2>
              <div class="headerInfo"> 
                <h2 style="width:70%; text-indent:15px; text-transform: capitalize">${
                  pokemon.name
                }</h2>
                <ol style="list-style: none; display: flex; height: 30px;width:20%">
                  ${types
                    .map(
                      (type) =>
                        `<li><img class="icons" src="Assets/TypesIcon/${type}Icon.png" /></li>`
                    )
                    .join("")}
                </ol>
              </div>
              </div>
          <div class="resume">
            <div class="titles">
              <p>Height</p>
              <p>Weight</p>
              <p>Hp</p>
              <p>Attack</p>
              <p>Defense</p>
              <p>Speed</p>
              <p>Sp. Attack</p>
              <p>Sp. Defense</p>
            </div>
            <div class="attributes">
              <p>${pokemon.height} inches</p>
              <p>${pokemon.weight} lbs</p>
              <p>${hp}</p>
              <p>${attack}</p>
              <p>${defense}</p>
              <p>${speed}</p>
              <p>${spAttack}</p>
              <p>${spDefense}</p>
            </div>
            </div>
            <div class="resume">
              <div class="titles">
              <p>Abilities:</p>
              </div>
              <div class="attributes">
              <p>${abilities}</p>
              </div>
            </div>
      </div>
    </div>
  </div>`;
  pokemonId.innerHTML = htmlString + pokemonId.innerHTML;
  // console.log(htmlString);
};

// list all pokemons
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
