import { Injectable } from '@angular/core';

@Injectable()
export class EdgeListService {

  constructor() { }

  formatEdge(raw): any {
    let edge = {};
    for (let key in raw) {
      edge[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return edge;
  }

  updateEdges(edges, edge): any {
    edges.forEach(item => {
      if (item.Edge.EdgeId !== edge.EdgeId) return;
      item.Edge = edge;
    });

    return edges;
  }

  getEdgesByLimitCount(originalEdgeList: any[], limit: number): any[] {
    let edges =  originalEdgeList.filter((edge, index) => index < limit);
    return edges;
  }
}
