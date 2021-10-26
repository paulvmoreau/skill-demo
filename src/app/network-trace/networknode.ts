import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface MapNode {
  name: string;
  distance: number;
  viaNode: string;
}


export class NetworkNode {
  name: string;
  map: { [key: string]: MapNode } = {};
  x: number;
  y: number;
  directConnectionCount: number = 0;
  directConnection: NetworkNode[] = [];

  private map$: Subject<{ [key: string]: MapNode }> = new Subject<{ [key: string]: MapNode }>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(name: string, maxXCoord: number, maxYCoord: number) {
    this.name = name;
    this.x = Math.ceil(Math.random() * maxXCoord);
    this.y = Math.ceil(Math.random() * maxYCoord);
    this.map[name] = {
      name,
      distance: 0,
      viaNode: name
    };
  }

  get mapObs(): Observable<{ [key: string]: MapNode }> {
    return this.map$.asObservable();
  }

  isSelf(nodeName: string): boolean {
    return nodeName === this.name;
  }

  addConnection(node: NetworkNode) {
    node.mapObs.pipe(takeUntil(this.destroy$))
      .subscribe((map) => {
        this.checkMap(map, node.name)
      });
    const deltaX = Math.abs(this.x - node.x);
    const deltaY = Math.abs(this.y - node.y);
    const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    this.map[node.name] = {
      name: node.name,
      distance,
      viaNode: this.name
    }
    this.directConnection.push(node);
    this.directConnectionCount++;
    this.map$.next(this.map);
  }

  private checkMap = (map: { [key: string]: MapNode }, originNode: string) => {
    const distanceFromOrigin: number = this.map[originNode].distance;
    let mapUpdated = false;
    Object.keys(map).forEach((key) => {
      const distanceToNode = map[key].distance + distanceFromOrigin;
      if (key !== this.name && (!this.map[key] || distanceToNode < this.map[key].distance)) {
        this.map[key] = {
          name: key,
          distance: distanceToNode,
          viaNode: originNode
        };
        mapUpdated = true;
      }
    })
    if (mapUpdated) {
      this.map$.next(this.map);
    }
  }

}
