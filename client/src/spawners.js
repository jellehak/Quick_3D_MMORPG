import {Entity, Component} from './entity.js';

import {third_person_camera} from './third-person-camera.js';
import {player_entity} from './player-entity.js'
import {health_component} from './health-component.js';
import {player_input} from './player-input.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {inventory_controller} from './inventory-controller.js';
import {equip_weapon_component} from './equip-weapon-component.js';
import {AttackController} from './attacker-controller.js';

import {npc_entity} from './npc-entity.js';
import {health_bar} from './health-bar.js';
import {network_entity_controller} from './network-entity-controller.js';
import {network_player_controller} from './network-player-controller.js';
import {FloatingName} from './floating-name.js';
import {sorceror_effect} from './sorceror-effect.js';
import {BloodEffect} from './blood-effect.js';

export class PlayerSpawner extends Component {
  constructor(params) {
    super();
    this.params_ = params;
  }

  Spawn(playerParams) {
    const params = {
      camera: this.params_.camera,
      scene: this.params_.scene,
      desc: playerParams,
    };

    const player = new Entity();
    player.Account = playerParams.account;
    player.AddComponent(new player_input.BasicCharacterControllerInput(params));
    player.AddComponent(new player_entity.BasicCharacterController(params));
    player.AddComponent(
      new equip_weapon_component.EquipWeapon({desc: playerParams}));
    player.AddComponent(new inventory_controller.UIInventoryController(params));
    player.AddComponent(new inventory_controller.InventoryController(params));
    player.AddComponent(new health_component.HealthComponent({
        updateUI: true,
        health: 1,
        maxHealth: 1,
        strength: 1,
        wisdomness: 1,
        benchpress: 1,
        curl: 1,
        experience: 1,
        level: 1,
        desc: playerParams,
    }));
    player.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
    player.AddComponent(
        new AttackController());
    player.AddComponent(
        new third_person_camera.ThirdPersonCamera({
            camera: this.params_.camera,
            target: player}));
    player.AddComponent(
        new network_player_controller.NetworkEntityController({
            camera: this.params_.camera,
            target: player}));
    player.AddComponent(new BloodEffect({
        camera: this.params_.camera,
        scene: this.params_.scene,
    }));
    if (playerParams.character.class == 'sorceror') {
      player.AddComponent(
          new sorceror_effect.SorcerorEffect(params));
    }
    this.Manager.Add(player, 'player');

    return player;
  }
};

class NetworkEntitySpawner extends Component {
  constructor(params) {
    super();
    this.params_ = params;
  }

  Spawn(name, desc) {
    const npc = new Entity();
    npc.Account = desc.account;
    npc.AddComponent(new npc_entity.NPCController({
        camera: this.params_.camera,
        scene: this.params_.scene,
        desc: desc,
    }));
    npc.AddComponent(
        new health_component.HealthComponent({
            health: 50,
            maxHealth: 50,
            strength: 2,
            wisdomness: 2,
            benchpress: 3,
            curl: 1,
            experience: 0,
            level: 1,
            desc: desc,
        }));
    npc.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
    npc.AddComponent(
        new network_entity_controller.NetworkEntityController());
    if (desc.account.name) {
      npc.AddComponent(
          new FloatingName({desc: desc}));
    }
    npc.AddComponent(
        new equip_weapon_component.EquipWeapon({desc: desc}));
    npc.AddComponent(new inventory_controller.InventoryController());
    npc.AddComponent(new BloodEffect({
        camera: this.params_.camera,
        scene: this.params_.scene,
    }));
    if (desc.character.class == 'sorceror') {
      npc.AddComponent(
          new sorceror_effect.SorcerorEffect({
              camera: this.params_.camera,
              scene: this.params_.scene,
          }));
    }

    this.Manager.Add(npc, name);

    return npc;
  }
}

export const spawners = (() => {
  return {
    PlayerSpawner,
    NetworkEntitySpawner,
  };
})();