import { useState } from 'react'
import { initializeApp } from "firebase/app";
import reactLogo from './assets/react.svg'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './App.css'
import { useNavigate } from "react-router-dom";

function Auth() {
  const [mail, setmail] = useState("")
  const [password, setpassword] = useState("")
  const [visibleError,changeVisibility] = useState("invisible")

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

  function Click(event){
      const auth = getAuth();
      signInWithEmailAndPassword(auth,mail,password)
        .then((userCredential) => {
          // User is signed in
          const user = userCredential.user;
          changeVisibility("invisible")
          console.log(user)
          navi("/userMenu");
        })
        .catch((error) => {
          // Handle errors here
          changeVisibility("visible")
          navigator.vibrate(500);
        });
    }

    function SetPW(event){
      setpassword(event.target.value)
    }

    function SetMail(event){
      setmail(event.target.value)
    } 

  return (
    <div className="Auth">
        <div className={visibleError}>Coordonnées invalides.</div>
            <div>
                <label>Mail</label>
                <input type={'text'} value={mail} onChange={SetMail}></input>
            </div>
            <div>
                <label>Password</label>
                <input type={'password'} value={password} onChange={SetPW}></input>        
            </div>
            <div>
                <button action='none' onClick={Click}>Submit</button>
            </div>
    </div>
  )
}

export default Auth
