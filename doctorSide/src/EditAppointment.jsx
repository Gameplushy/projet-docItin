import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import './App.css'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
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

  const [appointment, loading, error] = useDocumentData(doc(getFirestore(app),"/appointments",id)) //TODO GET WITH ID
  const [userFound, loadingUser, errorUser] = useAuthState(auth)

  useEffect(()=>{
    if(loadingUser ||loading) return;
    if(error || errorUser){
      alert("A problem occured")
      navi("/userMenu");
      return;
    }
    if(!appointment){
      alert("Appointment doesn't exist.");
      navi("/userMenu")
      return;
    }
    if(!userFound){
      navi("/");
      return;
    }
    getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
      a=>a.forEach(
        b=>{
          if(b.data().userType!="doctor" || userFound.uid != appointment.doctor){
            Disconnect()
            return;
          }
          const initialDate = appointment.date.toDate().toISOString()
          setDate(initialDate.substring(0,initialDate.length-5))
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
  updateDoc(d,{date : Timestamp.fromDate(new Date(chosenDate))}).then(()=>{
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
