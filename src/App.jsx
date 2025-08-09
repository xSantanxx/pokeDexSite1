import { useState } from 'react'
import './App.css'

function App() {

  const [fade, setFade] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pokemonName, setPokemonName] = useState('');
  const [api, setApi] = useState('');

  async function getPokemonName(){

    const info = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
    const response = await info.json();
    setApi(response);
    const img = document.getElementById('mainSprite');

    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`)
    const speciesData = await species.json();


    const audio = new Audio();
    audio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${response.id}.ogg`

    setTimeout(() => {
      img.src = response.sprites.versions['generation-v']['black-white'].animated.front_default;
      audio.play();
      showDexEntry(response, speciesData);
      showStats(response.stats);
      evolutionStats(speciesData);
    }, 1500)
    
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
    const dexContainer = document.getElementById('evol');
    dexContainer.innerHTML = '';

    let speciesEvol = await fetch(speciesData.evolution_chain['url']);
    let speciesEvolDetails = await speciesEvol.json();
    let baseName = speciesEvolDetails.chain.species.name;

    const evolType = [];

    let o = speciesEvolDetails.chain.evolves_to;

    addEvolTypes(evolType, speciesEvolDetails.chain.evolves_to);

    function addEvolTypes(evolType, speciesEvolDetails){
      for(const prop in speciesEvolDetails){
          if(!!speciesEvolDetails[0].evolves_to){
              const pokeD = speciesEvolDetails[prop].evolution_details[prop];
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
            addEvolTypes(evolType, speciesEvolDetails[prop].evolves_to);
          }
      }
    }
    const evolCollection = [];
    evolCollection.push(baseName);

    addNames(evolCollection, speciesEvolDetails.chain.evolves_to);

    function addNames(evolCollection,speciesEvolDetails){
        for (const prop in speciesEvolDetails){
            if(!!prop && speciesEvolDetails.length > 0){
                evolCollection.push(speciesEvolDetails[prop].species.name);
                addNames(evolCollection,speciesEvolDetails[prop].evolves_to);
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
        img.style.width = '30vw';
        img.style.height = '20vh';
        img.style.objectFit = 'contain';
        let name = evolCollection[i];
        let baseUrl = await fetch (`https://pokeapi.co/api/v2/pokemon/${name}`);
        let baseStageDetails = await baseUrl.json();
        let pokeAnmSprite = baseStageDetails.sprites.versions['generation-v']['black-white'].animated.front_default;
        img.src = pokeAnmSprite;
        dexContainer.appendChild(img);
      }
    }

  printNames(evolCollection, evolType);

  function printNames(evolCollection, evolType){
    let arrayLength = evolCollection.length;
    if(evolCollection[0] === 'eevee'){
        arrayLength--;
    }
    const textBox = document.getElementById('evolNames');
    textBox.innerHTML = '';
    for(let i = 0; i < arrayLength; i++){
        const nameBox = document.createElement("p");
        nameBox.textContent = evolCollection[i];
        textBox.appendChild(nameBox);
    }
    printEvolNames(evolType);
    } 
}

  
  function showStats(stats){
    const statsContainer = document.getElementById('right');
    statsContainer.innerHTML = '';
    let starting = document.createElement('p');
    starting.textContent = pokemonName + ' base stats';
    statsContainer.appendChild(starting);

    for(let i = 0; i < stats.length; i++){
      let statsItems = stats[i];
      let statElement = document.createElement('p');
      statElement.textContent = `${statsItems.stat.name}: ${statsItems.base_stat}`
      statsContainer.appendChild(statElement);
    }
  }

  const frontShiny = () => {
    const img = document.getElementById('mainSprite');
    const pokeAnmSprite = api.sprites.versions['generation-v']['black-white'].animated.front_shiny;
    img.src = pokeAnmSprite;
  }

  const backShiny = () => {
    const img = document.getElementById('mainSprite');
    const pokeAnmSprite = api.sprites.versions['generation-v']['black-white'].animated.back_shiny;
    img.src = pokeAnmSprite;
  }

  const backDefault = () => {
    const img = document.getElementById('mainSprite');
    const pokeAnmSprite = api.sprites.versions['generation-v']['black-white'].animated.back_default;
    img.src = pokeAnmSprite;
  }

  const froDefault = () => {
    const img = document.getElementById('mainSprite');
    const pokeAnmSprite = api.sprites.versions['generation-v']['black-white'].animated.front_default;
    img.src = pokeAnmSprite;
  }

  const clearEvr = () => {
    setApi('');
    setPokemonName('');
    document.getElementById('mainSprite').src = '';
    document.getElementById('left').innerHTML = '';
    document.getElementById('right').innerHTML = '';
    document.getElementById('evol').innerHTML = '';
    document.getElementById('evolNames').innerHTML = '';
  }



  const triggerAnimation = () => {
    setFade(!fade);
    setVisible(!visible);
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
      flex justify-center relative animate-none`}>
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
            <button onClick={backDefault} className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Normal Rear</button>
            <button onClick={frontShiny} className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Shiny Front</button>
            <button onClick={backShiny} className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Shiny Rear</button>
            <button onClick={froDefault} className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
              Default</button>
            <button onClick={clearEvr} className='bg-neutral-900 hover:bg-red-500 text-white m-2 px-4 rounded'>
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
          w-96 h-auto top-35 left-212  rounded-md
          [&>p]: font-bold [&>p]:text-center [&>p]:outline-solid [&>p]:bg-zinc-200 [&>p]:box-content [&>p]:my-5 [&>p]:mx-0 [&>p]:rounded-md [&>p]:hover:bg-zinc-300 [&>p]:cursor-default'>
          </div>
          {/* Left Box */}
          <div id='left' className='absolute border-2 border-solid border-red-500
          w-96 h-auto top-35 right-212 rounded-md overflow-auto
          [&>p]: font-bold [&>p]:text-center [&>p]:outline-solid [&>p]:bg-zinc-200 [&>p]:box-content [&>p]:my-5 [&>p]:mx-0 [&>p]:rounded-md [&>p]:hover:bg-zinc-300 [&>p]:cursor-default'>
          </div>
          {/* Evolution Box */}
          {/* transition for box */}
          <div id='evol' className={`${visible ? 'duration-300 ease-in-out h-auto' : 'visible'} border-2 border-solid border-red-500
          top-164 w-190 rounded-lg
          flex absolute shrink-0 basis-auto  
          overflow-auto`}>
          </div>
          {/* Names Box */}
          <div id='evolNames' className={`
            ${visible ? '[&>p]: duration-300 ease-in-out' : ''}
            top-200 h-auto w-190 rounded-lg flex absolute overflow-auto
            [&>p]: w-50% [&>p]: h-50% [&>p]: text-center [&>p]:my-5 [&>p]:mx-0
            [&>p]:rounded-sm [&>p]:text-lg [&>p]:box-content [&>p]:text-white
            place-content-evenly whitespace-pre`}>
          </div>
      </div>
      <div className='border-2 border-solid border-red-500 absolute
      flex w-auto h-20 justify-center
      right-1'>
        <button className='ease-in hover:duration-300 hover:bg-yellow-700 rounded-lg mx-2 my-2 bg-yellow-500 border-2 border-solid px-10 cursor-pointer'>Sign Up</button>
        <button className='ease-in hover:duration-300 hover:bg-indigo-700 rounded-lg my-2 bg-indigo-500 border-2 border-solid px-10 cursor-pointer'>Login</button>

      </div>

    </div>
    </>
  )
}

export default App
