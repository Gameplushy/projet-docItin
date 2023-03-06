import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {getAuth} from 'firebase/auth'

function MainMenu() {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    
  }
  ,[])

  function GoList(){

  }

  function GoForm(){

  }

  return (
    <div className="MainMenu">
        <button onClick={GoList}>List of rendez-vous</button>
        <button onClick={GoForm}>Take a rendez-vous</button>
    </div>
  )
}

export default MainMenu
