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

  return (
    <div className="PWAExplanation">
      <p>Install the PWA here!</p>
      <div>
        <img src="explainChrome1.png"/>
        <img src="explainChrome2.png"/>
      </div>
      <p>You won't have to open a browser to get in anymore!</p>
      <div><button onClick={GoBack}>Go Back</button></div>
    </div>
  )
}

export default PWAExplanation
