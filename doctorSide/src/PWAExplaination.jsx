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
            <table>
        <thead>
        <tr>
          <th></th>
          <th>Windows (Chrome)</th>
          <th>MacOS (Safari)</th>
          <th>Android (Chrome)</th>
          <th>iOS (Safari)</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <th>Vibration</th>
            <td><img src="no.png"/></td>
            <td><img src="no.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
          <tr>
            <th>Fichier ics</th>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
          <tr>
            <th>Mail</th>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
          <tr>
            <th>Splashscreen</th>
            <td><img src="maybe.png"/></td>
            <td><img src="no.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="no.png"/></td>
          </tr>
          <tr>
            <th>Bouton d'installation de PWA manuel</th>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
          <tr>
            <th title="En cours d'implmémentation">Stockage offline des RDV</th>
            <td><img src="maybe.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="maybe.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
          <tr>
            <th title="En cours d'implmémentation">Géolocation</th>
            <td><img src="yes.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="yes.png"/></td>
            <td><img src="maybe.png"/></td>
          </tr>
        </tbody>
      </table>
      <div><button onClick={GoBack}>Go Back</button></div>
    </div>
  )
}

export default PWAExplanation
