import { useState } from 'react'
import './App.css'

function App() {

  const [fade, setFade] = useState(false);
  const [pokemonName, setPokemonName] = useState('');

  async function getPokemonName(){

    const info = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    const response = await info.json();
    const img = document.getElementById('mainSprite');
    img.src = response.sprites.versions['generation-v']['black-white'].animated.front_default;

    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`)
    const speciesData = await species.json();


    const audio = new Audio();
    audio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${response.id}.ogg`
    audio.play();

    showDexEntry(response, speciesData);
    showStats(response.stats);
    // evolutionStats(speciesData);
  }

  async function showDexEntry(response, speciesData){
    const dexContainer = document.getElementById('left');
    dexContainer.innerHTML = '';

    const dexEntryNum = speciesData.pokedex_numbers[0].entry_number;
    const dexEntryType = speciesData.pokedex_numbers[0].pokedex.name;
    const dexNumberEntry = document.createElement('p');
    dexNumberEntry.textContent = dexEntryType + " dex:" + " " + dexEntryNum;
    dexContainer.appendChild(dexNumberEntry);

    const abilityBox = [];
    const abilityExplainBox = [];
    const pokeAbilities = response.abilities;

    await addAbilities(abilityBox, abilityExplainBox, pokeAbilities);

    async function addAbilities(abilityBox, abilityExplainBox, pokeAbilities){
      for(const ability in pokeAbilities){
        abilityBox.push(pokeAbilities[ability].ability.name);
        const abilitySearch = await fetch(pokeAbilities[ability].ability.url);
        const abilitySearchFind = await abilitySearch.json();
        abilityExplainBox.push(abilitySearchFind.effect_entries[1].short_effect);
        if(!Array.isArray(abilitySearchFind.effect_changes)){
          abilityExplainBox.push(abilitySearchFind.effect_changes[0].effect_entries[1].effect);
        }
      }
    }

    printAbilities(abilityBox, abilityExplainBox);

    function printAbilities(abilityBox, abilityExplainBox){
      for(const namePoke in abilityBox){
        if(namePoke === '1'){
          const name = document.createElement('p');
          name.textContent = 'hidden ability';
          dexContainer.appendChild(name);
        }
        const abilityName = document.createElement('p');
        abilityName.textContent = abilityBox[namePoke];
        dexContainer.appendChild(abilityName);
        const abilityNameExp = document.createElement('p');
        abilityNameExp.textContent = abilityExplainBox[namePoke];
        dexContainer.appendChild(abilityNameExp);
      }
    }

    const englishEntries = speciesData.flavor_text_entries
    .filter(entry => entry.language.name === 'en' && entry.version.name === 'y')

    if(englishEntries.length > 0){
      const pokeDexDetails = document.createElement('p');
      pokeDexDetails.textContent = 'pokedex entry'
      dexContainer.appendChild(pokeDexDetails);
      const firstElement = document.createElement('p')
      firstElement.textContent = englishEntries[0].flavor_text;
      dexContainer.appendChild(firstElement);
    } else {
      const noEntry = document.createElement('p')
      noEntry.textContent = "No Pokedex entry available";
      dexContainer.appendChild(noEntry);
    }
  }

  async function evolutionStats(speciesData){
    const dexContainer = document.getElementById('');
    dexContainer.innerHTML = '';

    let speciesEvol = await fetch(speciesData.evolution_chain['url']);
    let speciesEvolDetails = await speciesEvol.json();
    let baseName = speciesEvolDetails.chain.species.name;

    const evolType = [];

    let o = speciesEvolDetails.chain.evolves_to;

    addEvolTypes(evolType, speciesEvolDetails.chain.evolves_to);

    function addEvolTypes(evolType, speciesEvolDetails){
      let v = 0;
      for(const details in speciesEvolDetails){
        if(!!speciesEvolDetails[0].evolves_to){
          const pokeD = speciesEvolDetails[details].evolution_details[details];
          for(const i in pokeD){
            if(!!pokeD[i]){
              if(i !== 'trigger'){
                evolType.push(i);
              }
              if(typeof pokeD[i] === 'object'){
                evolType.push(pokeD[i].name);
              } else {
                evolType.push(pokeD[i].toString());
              }
            }
          }
        }
        addEvolTypes(evolType, speciesEvolDetails[details].evolves_to)
      }
    }

    const evolCollection = [];
    evolCollection.push(baseName);

    addNames(evolCollection, speciesEvolDetails.chain.evolves_to);

    function addNames(evolCollection, speciesEvolDetails){
      for(const details in speciesEvolDetails){
        if(!!details && speciesEvolDetails.length > 0){
          evolCollection.push(speciesEvolDetails[details].evolves_to);
          addNames(evolCollection, speciesEvolDetails[details].evolves_to)
        } else {
          evolCollection.push(speciesEvolDetails[prop].species.name);
          break;
        }
      }
    }

    printImages(evolCollection);

    async function printImages(evolCollection) {
      let arrayLength = evolCollection.length;
      if(evolCollection[0] === 'eevee'){
        arrayLength--;
      }
      for(let i = 0; i < arrayLength; i++){
        const img = document.createElement('img');
        let name = evolCollection[i];
        let baseUrl = await fetch (`https://pokeapi.co/api/v2/pokemon/${name}`);
        let baseStageDetails = await baseUrl.json();
        let pokeAnmSprite = baseStageDetails.sprites.versions['generation-v']['black-white'].animated.front_default;
        img.src = pokeAnmSprite;
        dexContainer.appendChild(img);
      }
      
    }
    }

  
  function showStats(stats){
    const statsContainer = document.getElementById('right');
    statsContainer.innerHTML = '';

    for(let i = 0; i < stats.length; i++){
      let statsItems = stats[i];
      let statElement = document.createElement('p');
      statElement.textContent = `${statsItems.stat.name}: ${statsItems.base_stat}`
      statsContainer.appendChild(statElement);
    }
  }


  const triggerAnimation = () => {
    setFade(!fade);
    getPokemonName();

    setTimeout(() => {
      setFade(fade);
    }, 1500);
  }

  return (
    <>
    {/* Main homescreen */}
    <div className='bg-gradient-to-r from-neutral-300 via-zinc-900 to-red-700
    w-screen h-screen flex justify-center relative'>
      {/* Entry Box */}
      <div className={`${fade ? "delay-150 duration-300 animate-pulse" : "delay-150 duration-300 animate-none"}  border-2 border-solid border-indigo-500 w-2xl h-1/3 absolute top-35
      flex justify-center relative`}>
        <p className='absolute top-10 font-bold text-2xl hover:text-stone-50 cursor-pointer'>PokeDex Search</p>
        <img src="pokeball.gif" alt="" className='absolute h-1/2 right-2
        aspect-square rounded-full' />
        <p className='absolute top-25 font-medium hover:text-stone-50 cursor-pointer'>
          Pokemon Name
        </p>
        <input type="text" placeholder='Enter name' value={pokemonName} onChange={e => setPokemonName(e.target.value)}
        className='absolute top-35 border-solid border-2 rounded-lg w-xs bg-white'  />
        <button type='button' onClick={triggerAnimation} className='absolute top-45 bg-neutral-900 hover:bg-red-500 text-white font-normal py-2 px-4 rounded
        cursor-pointer'>
          Click me</button>
          {/* Selection Buttons */}
          <div className='absolute top-60 w-full border-2 border-solid
          h-2/7 flex justify-center place-content-center'>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Normal</button>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Shiny Front</button>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Shiny Rear</button>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Default</button>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Clear</button>
            <button className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Audio</button>
          </div>
          <div className='absolute border-2 border-solid border-red-500 size-[85%]
          top-85 flex justify-center items-center'>
            <img src='' alt="pokemon sprite" id='mainSprite'
            className='w-30'/>
          </div>
          {/* Right Box */}
          <div id='right' className='absolute border-2 border-solid border-red-500
          w-96 h-120 top-35 left-212 bg-fuchsia-100 rounded-md
          [&>p]: font-bold [&>p]:text-center [&>p]:outline-solid [&>p]:bg-zinc-200 [&>p]:box-content [&>p]:my-5 [&>p]:mx-0 [&>p]:rounded-md [&>p]:hover:bg-zinc-300 [&>p]:cursor-default'>
          </div>
          {/* Left Box */}
          <div id='left' className='absolute border-2 border-solid border-red-500
          w-96 h-120 top-35 right-212 bg-cyan-50 rounded-md overflow-x-visible
          [&>p]: font-bold [&>p]:text-center [&>p]:outline-solid [&>p]:bg-zinc-200 [&>p]:box-content [&>p]:my-5 [&>p]:mx-0 [&>p]:rounded-md [&>p]:hover:bg-zinc-300 [&>p]:cursor-default'>
          </div>
      </div>

    </div>
    </>
  )
}

export default App
