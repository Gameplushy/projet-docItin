import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import './App.css'
import {getAuth, signOut} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

function AppointmentMap() {
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
            if(b.data().userType!="doctor"){
                console.log("bitch")
              Disconnect()
            } 
          }
        ))
    }
  }
  ,[loading, userFound, navi])

  function Disconnect(){
    signOut(auth).then(navi("/")).catch((error)=>console.log(error));
  }


  const [chosenDay,setDay] = useState("")
  function ChangeDay(event){
    setDay(event.target.value)
  }



  return (
    <div className="AppointmentMap">
        <div>
            <input type="date" value={chosenDay} onChange={ChangeDay}/>
        </div>

        <MapContainer center={[47.233997, 2.415588]} zoom={6.5} scrollWheelZoom={true} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>

        <div>
          <button onClick={()=>navi("/userMenu")}>Go Back</button>
        </div>
    </div>
  )
}

export default AppointmentMap
