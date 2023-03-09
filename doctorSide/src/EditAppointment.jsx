import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import './App.css'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import {saveAs} from 'file-saver'
import {createEvent} from 'ics'
import { useParams } from 'react-router-dom';

function EditAppointment() {
    const {id} = useParams();
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

  //const [list,loading,error] = useCollectionData(query(collection(getFirestore(app),"/users"),where("userType","==","client")))
  const [appointment, loading, error] = useDocumentData(doc(getFirestore(app),"/appointments",id)) //TODO GET WITH ID
  const [userFound, loadingUser, errorUser] = useAuthState(auth)

  useEffect(()=>{
    if(loadingUser ||loading) return;
    if(error || errorUser){
      alert("A problem occured")
      navi("/userMenu");
      return;
    }
    console.log(appointment)
    getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
      a=>a.forEach(
        b=>{
          if(b.data().userType!="doctor" || userFound.uid != appointment.doctor){
            Disconnect()
          }
          setDate(appointment.date)
        }
      ))
  },[loadingUser,loading])

const [chosenDate,setDate] = useState("")

function ChangeDate(event){
  setDate(event.target.value)
}

function Submit(){
  if(!chosenDate){
    alert("Donnez une date normale.")
    return;
  }
  const d = doc(getFirestore(app),"/appointments",id)
  updateDoc(d,{date : chosenDate}).then(()=>{
    alert("Modifié !");
    navi("/appointmentList")
  })
}

  return (
    <div className="EditAppointment">
      <div>
        <input type="datetime-local" value={chosenDate} onChange={ChangeDate}/>
      </div>
      <div>
        <button onClick={Submit}>Modifier</button>
      </div>
      <div><button onClick={()=>navi("/userMenu")}>Go Back</button></div>
    </div>
  )
}

export default EditAppointment
