/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import {Component, Input, OnInit} from "@angular/core";
import {LineSeries, XYChart} from "@amcharts/amcharts4/charts";
import {NetworkNode} from "../networknode";

am4core.useTheme(am4themes_dataviz);

@Component({
  selector: 'app-network-chart',
  templateUrl: './network-chart.component.html',
  styleUrls: ['./network-chart.component.scss']
})
export class NetworkChartComponent implements OnInit {
  @Input() nodes!: NetworkNode[];

  twoPointTrace: NetworkNode[] = [];
  trace: string[] = [];
  noConnectionError!: boolean;

  private traceSeries!: LineSeries;
  private chart!: XYChart;
  private networkSeries!: LineSeries;

  constructor() {
  }

  ngOnInit(): void {
    this.buildChart();
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
      this.traceSeries.hide();
    }
  }

  private drawTrace() {
    const start = this.twoPointTrace[0];
    const destination = this.twoPointTrace[1];
    const trace = [start];
    if (destination) {
      if (!NetworkChartComponent.checkForConnection(start, destination)) {
        this.trace = [];
        this.noConnectionError = true;
        return;
      } else {
        this.noConnectionError = false;
      }
      if (start.map[destination.name].viaNode === start.name) {
        trace.push(destination);
      } else {
        let lead = start.map[destination.name].viaNode;
        while (lead !== destination.name) {
          const nextNode = this.nodes.filter((node) => {
            return node.name === lead;
          })[0];
          trace.push(nextNode);
          if (lead === nextNode.map[destination.name].viaNode) {
            lead = destination.name;
            trace.push(destination);
          } else {
            lead = nextNode.map[destination.name].viaNode;
          }
        }
      }
    }
    this.trace = trace.map((node) => {
      return node.name;
    });
    this.traceSeries.data = trace;
    this.traceSeries.show();
  }

  private static checkForConnection(start: NetworkNode, destination: NetworkNode) {
    return !!start.map[destination.name].viaNode;
  }
}
