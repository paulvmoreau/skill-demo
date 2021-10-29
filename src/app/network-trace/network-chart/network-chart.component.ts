/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import {Component, Input, OnInit} from "@angular/core";
import {LineSeries, XYChart} from "@amcharts/amcharts4/charts";
import {NetworkNode} from "../networknode";
import {Observable, Subject} from "rxjs";

am4core.useTheme(am4themes_dataviz);

interface TableTrace {
  from: string;
  to: string;
  distance: number
}

@Component({
  selector: 'app-network-chart',
  templateUrl: './network-chart.component.html',
  styleUrls: ['./network-chart.component.scss']
})
export class NetworkChartComponent implements OnInit {
  @Input() nodes!: NetworkNode[];
  @Input() addNode!: Observable<NetworkNode>;

  twoPointTrace: NetworkNode[] = [];
  trace: NetworkNode[] = [];
  tableTrace: TableTrace[] = [];
  noConnectionError!: boolean;
  displayedColumns: string[] = ['from', 'to', 'distance'];
  traceDistance: number = 0;
  tableTrace$: Subject<TableTrace[]> = new Subject<TableTrace[]>();

  private _tableTraceObs: Observable<TableTrace[]> = this.tableTrace$.asObservable();
  private traceSeries!: LineSeries;
  private chart!: XYChart;
  private networkSeries!: LineSeries;
  private connections: LineSeries[] = [];

  constructor() {
  }

  get tableTraceObs(): Observable<TableTrace[]> {
    return this._tableTraceObs;
  }

  ngOnInit(): void {
    this.buildChart();
    if (this.addNode) {
      this.addNode.subscribe((node) => {
        this.addNodeToChart(node);
      })
    }
  }

  private buildChart() {
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.padding(30, 0, 30, 0);
    // @ts-ignore
    let title = this.chart.tooltipContainer.createChild(am4core.Label);
    title.text = "Network Map";
    title.fill = am4core.color("#00254b");
    title.fontSize = 15;
    title.x = 10;
    title.y = 10;

    // Create axes
    NetworkChartComponent.createAxis(this.chart.xAxes);
    NetworkChartComponent.createAxis(this.chart.yAxes);

    this.createNodes('nodes', this.nodes);
    this.drawConnections();
  }

  private createNodes(name: string, data: any[]) {
    // Create series
    this.networkSeries = this.chart.series.push(new am4charts.LineSeries());
    this.networkSeries.data = data;
    this.networkSeries.name = name;
    this.networkSeries.dataFields.valueX = 'x';
    this.networkSeries.dataFields.valueY = 'y';
    this.networkSeries.strokeWidth = 0;
    this.networkSeries.connect = false;

    let bullet = this.networkSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 8;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.stroke = am4core.color("#000");
    bullet.circle.strokeWidth = 1;
    bullet.setStateOnChildren = true;
    bullet.events.on('hit', (ev: any) => {
      if (ev.target.dataItem) {
        this.highlightBullet(ev.target.dataItem.dataContext as NetworkNode);
      }
    });

    let labelBullet = this.networkSeries.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = '{name}'
    labelBullet.label.fontSize = 10;
    labelBullet.events.on('hit', (ev) => {
      if (ev.target.dataItem) {
        this.highlightBullet(ev.target.dataItem.dataContext as NetworkNode);
      }
    });

    this.traceSeries = this.chart.series.push(new am4charts.LineSeries());
    this.traceSeries.data = this.trace;
    this.traceSeries.name = name;
    this.traceSeries.dataFields.valueX = 'x';
    this.traceSeries.dataFields.valueY = 'y';
    this.traceSeries.strokeWidth = 4;
    this.traceSeries.stroke = am4core.color("#008489");
    this.traceSeries.zIndex = 10;

    let traceBullet = this.traceSeries.bullets.push(new am4charts.CircleBullet());
    traceBullet.circle.radius = 8;
    traceBullet.circle.fill = am4core.color("#673ab7");
    traceBullet.circle.stroke = am4core.color("#EEEEEE");
    traceBullet.circle.strokeWidth = 2;
    traceBullet.events.on('hit', (ev: any) => {
      if (ev.target.dataItem) {
        this.highlightBullet(ev.target.dataItem.dataContext as NetworkNode);
      }
    });
    let traceLabelBullet = this.traceSeries.bullets.push(new am4charts.LabelBullet());
    traceLabelBullet.label.text = '{name}'
    traceLabelBullet.label.fontSize = 10;
    traceLabelBullet.label.fill = am4core.color("white");
    traceLabelBullet.events.on('hit', (ev) => {
      if (ev.target.dataItem) {
        this.highlightBullet(ev.target.dataItem.dataContext as NetworkNode);
      }
    });
  }

  private createLine(data: any[]) {
    // Create series
    let series = this.chart.series.push(new am4charts.LineSeries());
    series.data = data;

    // Set up binding to data
    series.dataFields.valueX = 'x';
    series.dataFields.valueY = 'y';

    // Set up appearance
    series.stroke = am4core.color("#f49432");
    series.strokeWidth = 2;
    series.connect = false;
    series.tensionX = 0.5;
    series.tensionY = 0.5;
    series.zIndex = 1;
    this.connections.push(series);
  }

  private static createAxis(list: any) {
    let axis = list.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.disabled = true;
    axis.renderer.baseGrid.disabled = true;
  }

  private highlightBullet(node: NetworkNode) {
    const nodeIndex = this.twoPointTrace.indexOf(node)
    if (nodeIndex > -1) {
      this.twoPointTrace.splice(nodeIndex, 1);
    } else {
      this.twoPointTrace.push(node);
      if (this.twoPointTrace.length > 2) {
        this.twoPointTrace.shift();
      }
    }
    if (this.twoPointTrace.length !== 0) {
      this.drawTrace();
    } else {
      this.trace = [];
      this.tableTrace = [];
      this.traceSeries.hide();
    }
  }

  private drawTrace() {
    const start: NetworkNode = this.twoPointTrace[0];
    const destination: NetworkNode = this.twoPointTrace[1];
    this.trace = [start];
    this.tableTrace = [];
    if (destination) {
      if (!NetworkChartComponent.checkForConnection(start, destination)) {
        this.trace = [];
        this.noConnectionError = true;
        return;
      } else {
        this.traceDistance = start.map[destination.name].distance;
        this.noConnectionError = false;
      }

      if (start.map[destination.name].viaNode === start.name) {    // Direct connection
        this.trace.push(destination);
        this.tableTrace.push({
          from: start.name,
          to: destination.name,
          distance: start.map[destination.name].distance
        });
      } else {
        let lead = start.map[destination.name].viaNode;
        this.tableTrace.push({
          from: start.name,
          to: lead,
          distance: start.map[lead].distance
        })
        while (lead !== destination.name) {
          const nextNode = this.nodes.filter((node) => {
            return node.name === lead;
          })[0];
          this.trace.push(nextNode);
          const viaNode = nextNode.map[destination.name].viaNode
          if (lead === viaNode) { // last connection
            this.trace.push(destination);
            this.tableTrace.push({
              from: lead,
              to: destination.name,
              distance: nextNode.map[destination.name].distance
            })
            lead = destination.name;
          } else {
            this.tableTrace.push({
              from: lead,
              to: viaNode,
              distance: nextNode.map[viaNode].distance
            })
            lead = viaNode;
          }
        }
      }
    }
    this.tableTrace$.next(this.tableTrace);
    this.traceSeries.data = this.trace;
    this.traceSeries.show();
  }

  private static checkForConnection(start: NetworkNode, destination: NetworkNode) {
    return !!start.map[destination.name] && !!start.map[destination.name].viaNode;
  }

  private addNodeToChart(node: NetworkNode) {
    this.networkSeries.data = this.nodes;
    node.directConnection.forEach((connection) => {
      this.createLine([
        {
          x: node.x,
          y: node.y
        }, {
          x: connection.x,
          y: connection.y
        }
      ])
    });
  }

  private drawConnections() {
    this.nodes.forEach((node) => {
      node.directConnection.forEach((connection) => {
        this.createLine([
          {
            x: node.x,
            y: node.y
          }, {
            x: connection.x,
            y: connection.y
          }
        ])
      })
    })
  }
}
