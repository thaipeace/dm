import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  @Input() obj: any;
  @Input() parentName?: string;
  public objKeys: any[];
  public isCollapsed: boolean;

  constructor() { }

  ngOnInit() {
    if (this.isObject(this.obj)) {
      this.isCollapsed = true;
      this.objKeys = Object.keys(this.obj);
    }
  }

  isObject(obj) {
    return typeof obj === 'object';
  }

}
