import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import './App.css'
import {getAuth, signOut} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

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

  const [myPosition,setGeolocation] = useState(null)

  const [clientList, loadingClients, errorClients] = useCollectionData(query(collection(getFirestore(app),"/users"),where("userType","==","client"))) 

  const [appointments, setAPList] = useState([])

  const [chosenDay,setDay] = useState("")
  function ChangeDay(event){
    setDay(event.target.value)
  }


    
  useEffect(()=>{
    if(loading || loadingClients) return;
    if(!userFound){
      navi("/")
    }
    if(userFound && clientList){
      // Firestore
      setUser(userFound)
      getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
        a=>a.forEach(
          b=>{
            if(b.data().userType!="doctor"){
              Disconnect()
            }
            else{
              GetOwnPosition()
              GetAppointmentList()
            } 
          }
        ))
    }
    else{
      navi("/userMenu")
    }
  }
  ,[loading, userFound, navi, loadingClients])

  function GetOwnPosition(){
    navigator.permissions.query({ name: 'geolocation' }).then(
      c=>{
        console.log(c.state)
        if(c.state==="denied")
          alert("Access to your location denied. Please enable it and refresh the page.");
          else{
            navigator.geolocation.getCurrentPosition(function (loc){
              setGeolocation([loc.coords.latitude,loc.coords.longitude])
              console.log("("+loc.coords.latitude+","+loc.coords.longitude+")")})
          }
      }
    )  
  ,function(err){console.log("An error occured.")}
  }

  function GetAppointmentList(){
    if(!chosenDay) return;
    //TODO
    getDocs(query(collection(getFirestore(app),"/appointments"),where("doctor","==",userFound.uid),where("date","==",Timestamp.fromDate(new Date(chosenDay))))).then((res)=>{
      var array = []
      res.forEach(ap=>{
        var data = ap.data();
        //data.key = ap.id
        var patient = clientList.filter(d=>d.uid == data.client)[0];
        console.log(patient)
        //data.client = patient.firstName+" "+patient.lastName
        array.push({
          name : patient.firstName+" "+patient.lastName,
          location : data.place
        })
      })
      console.log(array)
      setAPList(array)
    })
  }

  useEffect(()=>GetAppointmentList(),[chosenDay])

  function Disconnect(){
    signOut(auth).then(navi("/")).catch((error)=>console.log(error));
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
          { myPosition!=null && <Marker position={myPosition}>
            <Popup>
              Emplacement actuel
            </Popup>
          </Marker>}
        </MapContainer>

        <div>
          <button onClick={()=>navi("/userMenu")}>Go Back</button>
        </div>
    </div>
  )
}

export default AppointmentMap
