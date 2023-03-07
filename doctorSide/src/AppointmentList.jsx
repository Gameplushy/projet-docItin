import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import './App.css'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {saveAs} from 'file-saver'
import {createEvent} from 'ics'


function AppointmentList() {
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

  const [appointmentList,setList] = useState([])

  const [list,loading,error] = useCollectionData(query(collection(getFirestore(app),"/users"),where("userType","==","client")))

  const [userFound, loadingUser, errorUser] = useAuthState(auth)

  useEffect(()=>{
    if(loading || loadingUser) return;
    if(error || errorUser){
        alert("An error has occured");
        navi("/userMenu");
    }
    getDocs(query(collection(getFirestore(app),"/users"),where("uid","==",userFound.uid))).then(
        a=>a.forEach(
          b=>{
            if(b.data().userType!="doctor"){
              Disconnect()
            } 
            getDocs(query(collection(getFirestore(app),"/appointments"),where("doctor","==",userFound.uid))).then(
                apl=>
                {
                    var array = []
                    apl.forEach(ap=>{
                        var data = ap.data();
                        var patient = list.filter(d=>d.uid == data.client)[0];
                        console.log(patient)
                        data.client = patient.firstName+" "+patient.lastName
                        array.push(data)
                    })
                    console.log(array)
                    setList(array)
                })
            }

            )
          
        )
  },[loading,loadingUser,list,userFound])

  function CreateICS(ap){
    const event = {
        start: [Number.parseInt(ap.date.substring(0,4)), Number.parseInt(ap.date.substring(5,7)), Number.parseInt(ap.date.substring(8,10)), Number.parseInt(ap.date.substring(11,13)), Number.parseInt(ap.date.substring(14,16))],
        duration: { minutes: 30 },
        title: "Appointment with "+ap.client,
        location: ap.place,
    }
    console.log(event)
    createEvent(event,(error,value)=>{
        const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "event-schedule.ics");
    })

  }

  return (
    <div className="AppointmentList">
        <table>
            <thead>
            <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Lieu</th>
                <th>ics</th>
            </tr>
            </thead>
            <tbody>
                {appointmentList.map(ap=>
                    <tr>
                        <td>{ap.client}</td>
                        <td>{ap.date}</td>
                        <td>{ap.place}</td>
                        <td><button onClick={()=>CreateICS(ap)}>ics</button></td>
                    </tr>
                )}
            </tbody>
        </table>
        <button onClick={()=>navi("/userMenu")}>Go Back</button>
    </div>
  )
}

export default AppointmentList