import {Component, Input, OnInit} from '@angular/core';
import {StarterCard} from './starter-card';

@Component({
  selector: 'app-starter-card',
  templateUrl: './starter-card.component.html',
  styleUrls: ['./starter-card.component.scss']
})
export class StarterCardComponent implements OnInit {
  @Input() data: StarterCard;

  constructor() {
    console.log(this.data);
  }

  ngOnInit() {
  }

}
