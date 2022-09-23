const pokemonCardTemplate = document.querySelector("[data-pokemon-card]")
const pokemonModalTemplate = document.querySelector("[data-pokemon-modal]")
const pokemonCardContainer = document.querySelector("[data-pokemon-card-container]")
const pokemonModalContainer = document.querySelector("[data-pokemon-modal-container]")
const searchInput = document.querySelector("[data-search]")

const number_gen2_start = 722
const number_gen2_end = 809
let pokemon_objects = []

/* Picture API:https://cdn.traction.one/pokedex/pokemon/${pokemon.id}.png
    https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png
   PokeAPI: https://pokeapi.co/api/v2/pokemon/${id}
*/

// Creates Object for color keys
const colors = {
    fire: '#FFDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#D6BAFD',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}

// Retrieves data for 151 pokemon
const fetchPokemons = async () => {
    // Call getPokemon pokemons_number of times
    for(let i = number_gen2_start; i <= number_gen2_end; i++) {
        await getPokemon(i)
    }
}

// Function fetches pokemon data from PokeAPI
const getPokemon = async id => {
    // id number appended to url when getPokemon is called
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const url2 = `https://pokeapi.co/api/v2/pokemon-species/${id}/`

    // fetch the first URL 
    const response = await fetch(url)
    const pokemon = await response.json()

    // fetch the second url
    const response2 = await fetch(url2)
    const pokemon_species = await response2.json()

    createPokemonCard(pokemon)
    createPokemonModal(pokemon, pokemon_species)

    listenForClicks()
}



/* *************************************** MAIN EXECUTION *************************************** */
fetchPokemons()

// Dynamic Search Input
searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    pokemon_objects.forEach(pokemon => {
        console.log(pokemon.number)
        const isVisible = pokemon.name.toString().includes(value) || pokemon.type.toString().includes(value) 
            || pokemon.number.toString().includes(value)
        pokemon.element.classList.toggle("hide", !isVisible)
    })
})



// Create Pokemon Cards
function createPokemonCard(pokemon) {
    // Get Template
    const card = pokemonCardTemplate.content.cloneNode(true).children[0]

    // Get divs from inside the template
    const image = card.querySelector("[data-pokemon-image]")
    const number = card.querySelector("[data-pokemon-number]")
    const name = card.querySelector("[data-pokemon-name]")
    const type = card.querySelector("[data-pokemon-type]")

    // Store API Data into their respective divs
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`
    name.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1).split('-')[0]

    const pokemon_types = getTypeColors(pokemon)
    type.textContent = pokemon_types[0]
    changeCardColor(card, pokemon_types[0])

    card.setAttribute('data-id', `#modal${pokemon.id}`);
    
    // Add Pokemon Card to HTML DOC
    pokemonCardContainer.append(card)

    const pokemon_object = { name: name.textContent.toLowerCase(), number: number.textContent.toLowerCase(), 
            type: type.textContent.toLowerCase(), element: card}

    pokemon_objects.push(pokemon_object)
}

// Create Pokemon Modals
function createPokemonModal(pokemon, pokemon_species) {
    const modal = pokemonModalTemplate.content.cloneNode(true).children[0]

    const image = modal.querySelector("[data-modal-image]")
    const number = modal.querySelector("[data-modal-number]")
    const name = modal.querySelector("[data-modal-name]")
    const weight = modal.querySelector("[data-modal-weight]")
    const height = modal.querySelector("[data-modal-height]")
    const type_1 = modal.querySelector("[data-modal-type-one]")
    const type_2 = modal.querySelector("[data-modal-type-two]")
    const description = modal.querySelector("[data-modal-description]")

    // Store API data into their respective divs
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`
    name.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1).split('-')[0]

    weight.textContent = (pokemon.weight * 0.1).toFixed(1) + ' kg';
    height.textContent = (pokemon.height * 0.1).toFixed(1) + ' m';
    description.textContent = getDescription(pokemon_species)

    const pokemon_types = getTypeColors(pokemon)
    type_1.textContent = pokemon_types[0]
    if (pokemon_types[1] != 'none') {
        type_2.textContent = pokemon_types[1]
    }
    changeCardColor(modal, pokemon_types[0])

    modal.setAttribute('id', `modal${pokemon.id}`)
    modal.setAttribute('data-target', `#modal${pokemon.id}`)

    // Add Modal to HTML DOC
    pokemonModalContainer.append(modal)
}

// Get Types of Pokemon
function getTypeColors(pokemon) {
    const main_type = pokemon.types[0].type.name[0].toUpperCase() 
        + pokemon.types[0].type.name.slice(1)
    let second_type = "none"

    // If pokemon has more than 1 type, save the type
    if (pokemon.types.length > 1) {
        second_type = pokemon.types[1].type.name[0].toUpperCase()
        + pokemon.types[1].type.name.slice(1)
    }

    const pokemon_types = [main_type, second_type]
    return pokemon_types 
}

// Change color of Pokemon Cards to their type color
function changeCardColor(card, type) {
    const color_keys = Object.keys(colors)
    type = type.toLowerCase()
    const color = colors[type]
    card.style.backgroundColor = color;
}

// Get Pokemon Description
function getDescription(pokemon_species) {
    const description = pokemon_species.flavor_text_entries[7].flavor_text//.replace(/(\r\n|\n|\r)/gm, "")
    return description
}

// Listen for button clicks on Cards, Modal Buttons, and the Overlay
function listenForClicks() {
    const pokemon_btn = document.querySelectorAll('.pokemon-card')
    const modal_btn = document.querySelectorAll(".modal-btn")
    const overlay = document.querySelector("#overlay")
    const modals = document.querySelectorAll('.modal')
    
    // Whenever you click a pokemon card
    pokemon_btn.forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelector(btn.dataset.id).classList.add('active')
            console.log(btn)
            overlay.classList.add('active')
        })
    })
    
    // Whenever you close the modal with the button
    modal_btn.forEach((btn) => {
        btn.addEventListener('click', () => {
            
            modals.forEach(modal => modal.classList.remove('active'))
            overlay.classList.remove('active')
        })
    })

    // Whenever you click on the overlay
    window.onclick = (e) => {
        if(e.target == overlay) {
            modals.forEach(modal => modal.classList.remove('active'))
            pokemon_btn.forEach(btn => btn.classList.remove('active'))
            overlay.classList.remove("active")
        }
    }
}