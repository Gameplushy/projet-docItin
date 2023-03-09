import { useState } from 'react'
import './App.css'
import { useNavigate } from "react-router-dom";

function PWAExplanation() {

  const navi = useNavigate();
  function GoBack(){
    navi("/userMenu")
  }

  const [isVisible, changeVisibility] = useState(true)

  var installer = null

  window.addEventListener('beforeinstallprompt', (e) => {
    changeVisibility(true)
    installer = e;
  });

  async function GetPWA(){
    if(installer!=null){
      console.log("beep")
      installer.prompt();
      const { outcome } = await installer.userChoice;
      if (outcome === 'accepted') {
        installer = null;
      }
    }
  }

  return (
    <div className="PWAExplanation">
      {isVisible ? 
      <div>
        <button className="PWAButton" onClick={GetPWA}>Install the PWA here!</button>
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
