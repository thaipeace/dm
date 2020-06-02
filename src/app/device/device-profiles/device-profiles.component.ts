import {Component, OnInit} from '@angular/core';
import {StarterCard} from "../../shared/components/starter-card/starter-card";

@Component({
  selector: 'app-device-profiles',
  templateUrl: './device-profiles.component.html',
  styleUrls: ['./device-profiles.component.scss']
})
export class DeviceProfilesComponent implements OnInit {
  starterData: StarterCard;

  constructor() {
  }

  ngOnInit() {
    this.starterData = new StarterCard(
      `./assets/images/thumbnail.svg`,
      `You don't have any profiles yet`,
      `Profiles give your things the ability to interact with A-Stack and other web services. Profiles are analyzed and actions are performed based on the messages sent by your things.`,
      `Create a profile`
    );
  }
}
