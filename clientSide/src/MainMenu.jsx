import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import './App.css'
import {getAuth, signOut} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';

function MainMenu() {
  const firebasestuff = {   
    apiKey :import.meta.env.VITE_APIKEY,
    authDomain : import.meta.env.VITE_AUTHDOMAIN,
    projectId : import.meta.env.VITE_PROJECTID,
    storageBucket : import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId : import.meta.env.VITE_MESSAGINGSENDERID,
    appId : import.meta.env.VITE_APPID
  }

  const app = initializeApp(firebasestuff);
  const navi = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState("")
  const [userFound, loading, error] = useAuthState(auth)
  useEffect(()=>{
    if(!userFound) navi("/")
    setUser(userFound)
    console.log(auth)
  }
  ,[])

  function GoList(){

  }

  function GoForm(){

  }

  function Disconnect(){
    signOut(auth).then(navi("/")).catch((error)=>console.log(error));
  }

  return (
    <div className="MainMenu">
        {loading ? "Please wait" : JSON.stringify(user)}
        <button onClick={GoList}>List of rendez-vous</button>
        <button onClick={GoForm}>Take a rendez-vous</button>
        <button onClick={Disconnect}>Déconnexion</button>
    </div>
  )
}

export default MainMenu
