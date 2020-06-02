import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AgmMap, LatLngBounds } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-edge-list-map',
  templateUrl: './edge-list-map.component.html',
  styleUrls: ['./edge-list-map.component.scss']
})
export class EdgeListMapComponent implements OnInit {

  private _edges: any[];
  public edgeColors: any;
  public edgeRealStatus: any;
  public peakCoords: any[];
  public centeredPolygon: any;

  @Input() set edges(value: any[]) {
    this._edges = value;
    this.updateMarkers(this.edges);
  }
  get edges(): any[] {
    return this._edges;
  }

  @Input() searchText: string;
  public markers: any;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.Edge.Location', type: 'string'},
        {name: 'item.Edge.DisplayName', type: 'string'}
      ],
      require: false
    }
  ];

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor() { }

  ngOnInit() { 
    this.edgeRealStatus = {};
    this.peakCoords = [];

    this.edges.forEach(edge => {
      this.edgeRealStatus[edge.Edge.EdgeId] = edge.Edge.Status === 'Active' ?
       (edge.Edge.Alert ? 'activeAlert' : 'active') :
       'default';

      this.peakCoords.push({
        lat: parseFloat(edge.Edge.Location.split(',')[0]),
        long: parseFloat(edge.Edge.Location.split(',')[1])
      });
    });

    this.edgeColors = {
      active: 'assets/images/marker-green.png',
      activeAlert: 'assets/images/marker-yellow.png',
      default: 'assets/images/marker-red.png'
    }

    this.setCenteredPolygon();
  }

  ngAfterViewInit() {
    // this.agmMap.mapReady.subscribe(map => {
    //   const bounds: LatLngBounds = new google.maps.LatLngBounds();
    //   for (const mm of this.markers) {
    //     bounds.extend(new google.maps.LatLng(mm.lat, mm.long));
    //   }
    //   map.fitBounds(bounds);
    // });
  }

  updateMarkers(edges: any[]) {
    this.markers = {};
    edges.forEach(edge => {
      this.markers[edge.Edge.EdgeId] = {
        lat: parseFloat(edge.Edge.Location.split(',')[0]),
        long: parseFloat(edge.Edge.Location.split(',')[1])
      }
    });
  }

  setCenteredPolygon() {
    if (this.peakCoords.length > 1) {
      this.centeredPolygon = {
        lat: this.peakCoords.map(peak => peak.lat).reduce((a, b) => a + b, 0) / this.peakCoords.length,
        long: this.peakCoords.map(peak => peak.long).reduce((a, b) => a + b, 0) / this.peakCoords.length
      }
    } else {
      // this.centeredPolygon = {
      //   lat: this.markers[0].lat,
      //   long: this.markers[0].long
      // }
    }
    
  }
}
