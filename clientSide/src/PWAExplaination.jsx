import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import './App.css'
import {getAuth, signOut} from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function PWAExplanation() {

  const navi = useNavigate();
  function GoBack(){
    navi("/userMenu")
  }

  var installer = null
  const [isVisible, changeVisibility] = useState(false)

  window.addEventListener('beforeinstallprompt', (e) => {
    changeVisibility(true)
    installer = e;
  });

  async function GetPWA(){
    if(installer!=null){
      installer.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installer = null;
      }
    }
  }

  return (
    <div className="PWAExplanation">
      {isVisible ? 
      <div>
        <button className="PWAButton " onClick={GetPWA}>Install the PWA here!</button>
        <div>
          <img src="explainChrome.png"/>
        </div>
        <p>You won't have to open a browser to get in anymore!</p>       
      </div>
      : 
      <p>You cannot access the PWA app in this state.</p>
      }
      <div><button onClick={GoBack}>Go Back</button></div>
    </div>
  )
}

export default PWAExplanation
