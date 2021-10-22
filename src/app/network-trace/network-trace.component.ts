import { Component, OnInit } from '@angular/core';
import { NetworkNode } from './networknode';

@Component({
  selector: 'app-network-trace',
  templateUrl: './network-trace.component.html',
  styleUrls: ['./network-trace.component.scss']
})
export class NetworkTraceComponent implements OnInit {
  nodes: NetworkNode[] = [];
  showChart: boolean = false;
  nodeCount = 25;
  maxDirectConnections = 2;

  private maxX: number = 90;
  private maxY: number = 90;

  constructor() { }

  ngOnInit(): void {
    this.buildNetwork();
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
          if (node.hasDirectConnection(targetNode.name)) {
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
}