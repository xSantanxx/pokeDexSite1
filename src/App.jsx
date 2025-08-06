import { useState } from 'react'
import './App.css'

function App() {

  const [fade, setFade] = useState(false);
  const [pokemonName, setPokemonName] = useState('');

  async function getPokemonName(){

    console.log("pokemon name")
    console.log(pokemonName);

    const info = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)

    const response = await info.json();

    // .then(response => response.json())

    const img = document.getElementById('mainSprite');

    img.src = response.sprites.versions['generation-v']['black-white'].animated.front_default;

    console.log(response);
  }

  const triggerAnimation = () => {
    setFade(!fade);
    getPokemonName();
  }

  return (
    <>
    {/* Main homescreen */}
    <div className='bg-gradient-to-r from-neutral-300 via-zinc-900 to-red-700
    w-screen h-screen flex justify-center relative'>
      {/* Entry Box */}
      <div className={`${fade ? "animate-pulse" : "animate-none"}  border-2 border-solid border-indigo-500 w-2xl h-1/3 absolute top-35
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
            <img src="" alt="pokemon sprite" id='mainSprite'
            className='w-30'/>
          </div>
      </div>

    </div>
    </>
  )
}

export default App
