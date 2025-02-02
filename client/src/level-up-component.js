import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import {particle_system} from "./particle-system.js";
import {Entity, Component} from './entity.js';


export class LevelUpComponentSpawner extends Component {
  constructor(params) {
    super();
    this._params = params;
  }

  Spawn(pos) {
    const e = new Entity();
    e.SetPosition(pos);
    e.AddComponent(new LevelUpComponent(this._params));
    this.Manager.Add(e);

    return e;
  }
};

export class LevelUpComponent extends Component {
  constructor(params) {
    super();
    this._params = params;

    this._particles = new particle_system.ParticleSystem({
        camera: params.camera,
        parent: params.scene,
        texture: './resources/textures/ball.png',
    });
    this._particles._alphaSpline.AddPoint(0.0, 0.0);
    this._particles._alphaSpline.AddPoint(0.1, 1.0);
    this._particles._alphaSpline.AddPoint(0.7, 1.0);
    this._particles._alphaSpline.AddPoint(1.0, 0.0);
    
    this._particles._colourSpline.AddPoint(0.0, new THREE.Color(0x00FF00));
    this._particles._colourSpline.AddPoint(0.5, new THREE.Color(0x40C040));
    this._particles._colourSpline.AddPoint(1.0, new THREE.Color(0xFF4040));
    
    this._particles._sizeSpline.AddPoint(0.0, 0.05);
    this._particles._sizeSpline.AddPoint(0.5, 0.25);
    this._particles._sizeSpline.AddPoint(1.0, 0.0);
  }

  InitComponent() {
    this._particles.AddParticles(this.Parent.Position, 300);
  }
 
  Update(timeElapsed) {
    this._particles.Step(timeElapsed);
    if (this._particles._particles.length == 0) {
      this.Parent.SetActive(false);
    }
  }
}

export const level_up_component = (() => {
  return {
      LevelUpComponent,
      LevelUpComponentSpawner,
  };
})();