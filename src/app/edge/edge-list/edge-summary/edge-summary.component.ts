import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edge-summary',
  templateUrl: './edge-summary.component.html',
  styleUrls: ['./edge-summary.component.scss']
})
export class EdgeSummaryComponent implements OnInit {

  @Input() edges: any[];
  public activeEdge: any[];
  public alert: number;

  constructor() { }

  ngOnInit() {
    this.activeEdge = this.edges.filter(edge => edge.Edge.Status === "Active");
  }

}
