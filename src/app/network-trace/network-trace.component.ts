import { Component, OnInit } from '@angular/core';
import { NetworkNode } from './networknode';
import {FormControl, Validators} from "@angular/forms";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-network-trace',
  templateUrl: './network-trace.component.html',
  styleUrls: ['./network-trace.component.scss']
})
export class NetworkTraceComponent implements OnInit {
  maxNodes: number = 200;
  nodes: NetworkNode[] = [];
  showChart: boolean = false;
  nodeCount = 25;
  maxDirectConnections = 2;

  private maxX: number = 90;
  private maxY: number = 90;
  nodeCountFormControl = new FormControl('', [
    Validators.max(this.maxNodes),
  ]);
  private addNode$: Subject<NetworkNode> = new Subject<NetworkNode>();
  private _addNodeObs: Observable<NetworkNode> = this.addNode$.asObservable();

  constructor() { }

  ngOnInit(): void {
    this.buildNetwork();
  }

  get addNodeObs() {
    return this._addNodeObs;
  }

  redrawGraph() {
    this.nodes = [];
    this.showChart = false;
    setTimeout(() => {
      this.buildNetwork();
    })
  }

  private buildNetwork() {
    let name = 'A';
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push(new NetworkNode(name, this.maxX, this.maxY));
      name = NetworkTraceComponent.nextChar(name);
    }
    // build out connections
    this.nodes = this.nodes.map((node) => {
      const connectionCount = Math.ceil(Math.random() * this.maxDirectConnections);
      if (node.directConnectionCount < connectionCount) {
        for (let i = 0; i < connectionCount; i++) {
          const targetNodeIndex = Math.floor(Math.random() * this.nodeCount);
          const targetNode = this.nodes[targetNodeIndex];
          if (node.isSelf(targetNode.name)) {
            i--;
          } else {
            targetNode.addConnection(node);
            node.addConnection(targetNode);
            this.nodes[targetNodeIndex] = targetNode;
          }
        }
      }
      return node;
    })
    this.showChart = true;
  }

  private static nextChar(c: string) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  addNode() {
    const name = NetworkTraceComponent.nextChar(this.nodes[this.nodeCount - 1].name);
    const node = new NetworkNode(name, this.maxX, this.maxY);
    const connectionCount = Math.ceil(Math.random() * this.maxDirectConnections);
    for (let i = 0; i < connectionCount; i++) {
      const targetNodeIndex = Math.floor(Math.random() * this.nodeCount);
      const targetNode = this.nodes[targetNodeIndex];
      if (node.isSelf(targetNode.name)) {
        i--;
      } else {
        targetNode.addConnection(node);
        node.addConnection(targetNode);
      }
    }
    this.nodes.push(node);
    this.nodeCount++;
    this.addNode$.next(node);
  }
}
