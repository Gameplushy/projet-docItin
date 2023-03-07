import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import reactLogo from './assets/react.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './App.css'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';


function AppointmentForm() {
    // Initialize Firebase
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

  const [chosenDoc,setDoc] = useState("")
  const [chosenDate,setDate] = useState("")
  const [chosenPlace,setPlace] = useState("")

  const [docList,setDocList] = useState([])

  const [list,loading,error] = useCollectionData(query(collection(getFirestore(app),"/users"),where("userType","==","doctor")))

  const [userFound, loadingUser, errorUser] = useAuthState(auth)

  function ChangeDoc(event){
    setDoc(event.target.value);
  } 

  function ChangeDate(event){
    setDate(event.target.value)
  }

  function ChangePlace(event){
    setPlace(event.target.value)
  }

  useEffect(()=>{
    if(loadingUser) return;
    if(error || !userFound){
      alert("An error occured");
      navi("/")
    }
    else{
      getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
        a=>a.forEach(
          b=>{
            if(b.data().userType!="client"){
              Disconnect()
            } 
            setPlace(b.data().address)
          }
        ))
    }
  },[loadingUser,userFound,navi])

  useEffect(()=>{
    if(loading) return;
    if(error) alert("An error has occured")
    if(list) {
      setDocList(list.map(d=>[d.uid,d.firstName,d.lastName]))
    }
  },[loading,list])

  function Submit(){
    if(!chosenPlace || !chosenDoc || !chosenDate){
      alert("Each field must be completed")
      return;
    }
    if(loading || loadingUser){
      alert("Please wait for everything to load before doing anything.");
      return;
    }
    console.log(chosenDoc)
    addDoc(collection(getFirestore(app),"/appointments"),{
      client : userFound.uid,
      doctor : chosenDoc,
      place : chosenPlace,
      date : chosenDate
    }).then(()=>{
      //Look if notification compatibility
      NotifySuccess()
      navi("/userMenu")
    })
  }

  function NotifySuccess(){
    if(!('Notification' in window)){
      alert("RDV créé avec succès !")
      return;
    } 
    Notification.requestPermission().then((res)=>{
      if(res=='granted') {
        try{
            new Notification("RDV créé avec succès !")
        }
        catch{
          try{
            navigator.serviceWorker.getRegistration()
              .then((reg) => reg.showNotification("RDV créé avec succès !"))
              .catch((err) => alert('Service Worker registration error: ' + err));
          }
          catch{
              alert("RDV créé avec succès !")
          }
        }
      }
    })

  }

  return (
    <div className="AppointmentForm">
      <div>
          <label>Docteur</label>
          <select value={chosenDoc} onChange={ChangeDoc}>
            <option value={null}>Choisir un docteur...</option>
            {docList == [] ? "" : docList.map((doc)=><option value={doc[0]}>{doc[1]+" "+doc[2]}</option>)}
          </select>
      </div>

        <div>
          <label>Date</label>
          <input type="datetime-local" value={chosenDate} onChange={ChangeDate}/>
        </div>
        <div>
          <label>Lieu</label>
          <input value={chosenPlace} onChange={ChangePlace}/>
        </div>
        <button onClick={Submit}>Prendre RDV</button>
    </div>
  )
}

export default AppointmentForm
