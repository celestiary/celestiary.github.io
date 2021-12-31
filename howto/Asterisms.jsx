import React from 'react';
import { useLocation } from 'react-router-dom';
import cAsterisms from './js/Asterisms.js';
import AsterismsCatalog from './js/AsterismsCatalog.js';
import Keys from './js/Keys.js';
import * as Shared from './js/shared.js';
import Stars from './js/Stars.js';
import StarsCatalog from './js/StarsCatalog.js';
import ThreeUi from './js/ThreeUI.js';
import { elt } from './js/utils.js';
import './Asterisms.css';


export default function Asterisms() {
  const [asterisms, setAsterisms] = React.useState(null)
  const [stars, setStars] = React.useState(null)
  React.useEffect(() => { setStars(setup(setAsterisms)) }, [])

  const location = useLocation();
  React.useEffect(() => {
    if (asterisms) {
      const asterismName = (location.hash || '#Orion').substr(1).replaceAll(/%20/g, ' ');
      const [origName, name, hipId] = findCenterStar(stars, asterisms, asterismName);
      const star = stars.catalog.starsByHip[hipId];
      const labelPos = stars.labelCenterPosByName[name];
      if (!labelPos) {
        return;
      }
      asterisms.show(asterismName, () => { return true; });
      window.target = labelPos;
    }
  }, [location])

  return (
    <>
      <div id="ui"></div>
      <h1>Asterisms</h1>
      Asterisms include constellations.
      <div id="faveCtr">
        <table id="faves" cellPadding="5em">
          <tbody>
            <tr><th>Asterism</th><th>Midpoint Star</th><th>Midpoint Star HIP</th></tr>
          </tbody>
        </table>
      </div>
    </>)
}


function setup(setAsterisms) {
  const cb = (scene, ui) => {
    if (window.target) {
      ui.camera.target = window.target;
      ui.camera.lookAt(window.target);
    }
  };
  const ui = new ThreeUi('ui', cb);
  const k = new Keys();
  k.map(',', () => { ui.multFov(0.9); },
        'Narrow field-of-vision');
  k.map('.', () => { ui.multFov(1.1); },
        'Broaden field-of-vision');
  k.map('/', () => { ui.resetFov(); },
        'Reset field-of-vision to ' + Shared.INITIAL_FOV + 'º');

  const props = {
    radius: {
      // Sun's radius in meters.
      scalar: 6.9424895E8
    },
  };
  const stars = new Stars(props, () => {
    new cAsterisms(stars, (asterisms) => {
      stars.add(asterisms);
      setupFavesTable(stars, asterisms);
      setAsterisms(asterisms);
    });
  }, true);
  ui.scene.add(stars);
  ui.camera.position.z = 1e2;
  return stars;
}


function findCenterStar(stars, asterisms, asterismName) {
  const asterism = asterisms.catalog.byName[asterismName];
  for (let pathNdx in asterism.paths) {
    const path = asterism.paths[pathNdx];
    // Search from center to front.
    for (let i = Math.floor(path.length / 2); i >= 0; i--) {
      const starName = path[i];
      let [origName, name, hipId] = stars.catalog.reifyName(starName);
      const names = stars.catalog.namesByHip[hipId];
      if (names && names.length > 2) {
        name = names[0];
        return [origName, name, hipId];
      }
    }
  }
  return [null, null, null];
}


function setupFavesTable(stars, asterisms) {
  const favesTable = elt('faves');
  for (let asterismName in asterisms.catalog.byName) {
    const [origName, name, hipId] = findCenterStar(stars, asterisms, asterismName);
    if (name == null || hipId == null) {
      continue;
    }
    favesTable.innerHTML +=
      `<tr>
        <td><a href="#${asterismName}">${asterismName}</a></td>
        <td>${name}</td>
        <td>${hipId}</td>
      </tr>`;
  }
}