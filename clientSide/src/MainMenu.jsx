import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import './App.css'
import {getAuth, signOut} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

  const [user, setUser] = useState(null)
  const [userFound, loading, error] = useAuthState(auth)
  const [userData, setUserData] = useState({})

    
  useEffect(()=>{
    if(!loading && !userFound){
      navi("/")
    }
    if(!loading && userFound){
      // Firestore
      setUser(userFound)
      getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
        a=>a.forEach(
          b=>{
            if(b.data().userType!="client"){
              Disconnect()
            } 
            setUserData(b.data())
          }
        ))
    }
  }
  ,[loading, userFound, navi])

  function GoList(){
    navi("/appointmentList")
  }

  function GoForm(){
    navi("/appointmentForm")
  }

  function Disconnect(){
    signOut(auth).then(navi("/")).catch((error)=>console.log(error));
  }

  return (
    <div className="MainMenu">
        {userData.firstName == undefined ? "" : <div>{"Hello "+userData.firstName+" "+userData.lastName}</div>}
        <button onClick={GoList}>My appointments</button>
        <button onClick={GoForm}>Make an appointment</button>
        <button onClick={Disconnect}>Déconnexion</button>
    </div>
  )
}

export default MainMenu
