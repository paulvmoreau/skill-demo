import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {LifeGameCell} from "./life-game-cell";

@Component({
  selector: 'app-life-game-observables',
  templateUrl: './life-game-observables.component.html',
  styleUrls: ['./life-game-observables.component.scss']
})
export class LifeGameObservablesComponent implements OnInit, OnDestroy {
  @Input() refreshRate?: number;
  @Input() initialRows = 30;
  @Input() initialColumns = 30;
  @Input() expand: boolean = false;
  @Input() startObs?: Observable<void>;
  @Input() stepObs?: Observable<void>;
  @Input() stopObs?: Observable<void>;

  rows: LifeGameCell[][] = [];

  private timer?: number;
  private destroy$: Subject<void> = new Subject<void>();
  private stepper: Subject<void> = new Subject<void>();
  private width: number = 0;
  private height: number = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.width = this.initialColumns;
    this.height = this.initialRows;
    this.buildGrid();
    if (this.startObs) {
      this.startObs
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.run();
        });
    }
    if (this.stepObs) {
      this.stepObs
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.step();
        });
    }
    if (this.stopObs) {
      this.stopObs
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.stop();
        });
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  run() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.step();
    }, this.refreshRate);
  }

  stop() {
    clearInterval(this.timer);
  }

  private step() {
    if (this.expand) {
      this.checkEdges()
    }
    this.stepper.next();
  }

  private buildGrid() {
    this.rows = [];
    for (let i = 0; i < this.initialRows; i++) {
      this.rows.push([]);
    }
    this.rows = this.rows.map((row, rowIndex) => {
      for (let i = 0; i < this.initialColumns; i++) {
        row.push(new LifeGameCell(rowIndex, i, this.stepper.asObservable(), this.destroy$));
      }
      return row;
    })
    this.connectCells();
  }

  private connectCells() {
    this.rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
          if (this.rows[i]) {
            for (let j = colIndex - 1; j <= colIndex + 1; j++) {
              if (this.rows[i][j] && !(i === rowIndex && j === colIndex)) {
                this.rows[i][j].addNeighbour(cell);
              }
            }
          }
        }
      })
    })
    if (!this.expand) {
      this.loopEdges();
    }
    this.rows.forEach((row) => {
      row.forEach((cell) => {
        cell.informNeighbours();
      })
    })
  }

  private checkEdges() {
    const topEdge = this.rows[0].filter(cell => cell.alive).length > 0;
    const bottomEdge = this.rows[this.rows.length - 1].filter(cell => cell.alive).length > 0;
    const leftEdge = this.rows.filter(row => row[0].alive).length > 0;
    const rightEdge = this.rows.filter(row => row[row.length - 1].alive).length > 0
    if (topEdge || bottomEdge || leftEdge || rightEdge) {
      this.expandGrid(topEdge, bottomEdge, leftEdge, rightEdge);
    }
  }

  private expandGrid(topEdge: boolean, bottomEdge: boolean, leftEdge: boolean, rightEdge: boolean) {
    const firstRow = this.rows[0][0].row;
    const lastRow = firstRow + this.rows.length;
    const firstCol = this.rows[0][0].col;
    const lastCol = firstCol + this.rows[0].length;
    if (leftEdge || rightEdge) {
      this.rows.forEach((row) => {
        if (leftEdge) {
          row.unshift(new LifeGameCell(row[0].row, firstCol - 1, this.stepper, this.destroy$));
        }
        if (rightEdge) {
          row.push(new LifeGameCell(row[0].row, lastCol, this.stepper, this.destroy$));
        }
      });
    }
    if (topEdge) {
      this.rows.unshift([]);
      for (let i = 0; i < this.rows[1].length; i++) {
        this.rows[0].push(new LifeGameCell(firstRow - 1, firstCol - 1 + i, this.stepper, this.destroy$));
      }
    }
    if (bottomEdge) {
      this.rows.push([]);
      for (let i = 0; i < this.rows[1].length; i++) {
        this.rows[this.rows.length - 1].push(new LifeGameCell(lastRow, firstCol + i, this.stepper, this.destroy$));
      }
    }
    this.connectCells();
    // this.connectEdgesToGrid(topEdge, bottomEdge, leftEdge, rightEdge);
  }

  private loopEdges() {
    const lastRow = this.rows.length - 1;
    const lastCol = this.rows[0].length - 1;
    this.rows[0].forEach((cell, colIndex) => {
      for (let i = colIndex - 1; i <= colIndex + 1; i++) {
        if (this.rows[lastRow][i]) {
          this.connectNeightbours(this.rows[lastRow][i], cell);
        } else if (i < 0) {
          this.connectNeightbours(this.rows[lastRow][lastCol], cell);
        } else {
          this.connectNeightbours(this.rows[lastRow][0], cell);
        }
      }
    })
    this.rows[lastRow].forEach((cell, colIndex) => {
      for (let i = colIndex - 1; i <= colIndex + 1; i++) {
        if (this.rows[0][i]) {
          this.connectNeightbours(this.rows[0][i], cell);
        } else if (i < 0) {
          this.connectNeightbours(this.rows[0][lastCol], cell);
        } else {
          this.connectNeightbours(this.rows[0][0], cell);
        }
      }
    })
    this.rows.forEach((row, rowIndex) => {
      this.connectNeightbours(row[0], row[lastCol]);
      if (rowIndex == 0) {
        this.connectNeightbours(row[0], this.rows[lastRow][lastCol]);
        this.connectNeightbours(row[0], this.rows[rowIndex + 1][lastCol]);
      } else if (rowIndex === lastRow) {
        this.connectNeightbours(row[0], this.rows[0][lastCol]);
        this.connectNeightbours(row[0], this.rows[rowIndex - 1][lastCol]);
      } else {
        this.connectNeightbours(row[0], this.rows[rowIndex + 1][lastCol]);
        this.connectNeightbours(row[0], this.rows[rowIndex - 1][lastCol]);
      }
    })
  }

  connectNeightbours(cellA: LifeGameCell, cellB: LifeGameCell) {
    cellA.addNeighbour(cellB);
    cellB.addNeighbour(cellA);
  }
}
