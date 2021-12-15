import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {cloneDeep} from "lodash";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-life-game-brute-force',
  templateUrl: './life-game-brute-force.component.html',
  styleUrls: ['./life-game-brute-force.component.scss']
})
export class LifeGameBruteForceComponent implements OnInit, OnDestroy {
  @Input() refreshRate = 500;
  @Input() initialRows = 10;
  @Input() initialColumns = 10;
  @Input() startObs?: Observable<void>;
  @Input() stopObs?: Observable<void>;

  rows: boolean[][] = [];
  private timer?: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngOnInit(): void {
    this.buildGrid();
    if (this.startObs) {
      this.startObs
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.run();
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

  private buildGrid() {
    this.rows = [];
    for (let i = 0; i < this.initialRows; i++) {
      this.rows.push([]);
    }
    this.rows = this.rows.map((row) => {
      for (let i = 0; i < this.initialColumns; i++) {
        row.push(false);
      }
      return row;
    })
  }

  toggleCell(rowIndex: number, colIndex: number) {
    this.rows[rowIndex][colIndex] = !this.rows[rowIndex][colIndex];
  }

  private step() {
    if (this.checkEdges()) {
      this.addRowsCols();
    }
    const clone = cloneDeep(this.rows);
    this.rows = clone.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return this.checkCell(cell, rowIndex, colIndex);
      });
    });
  }

  private checkCell(cell: boolean, rowIndex: number, colIndex: number): boolean {
    let liveCount = 0;
    for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
      if (this.rows[i]) {
        for (let j = colIndex - 1; j <= colIndex + 1; j++) {
          if (i === rowIndex && j === colIndex) {
          } else if (this.rows[i][j]) {
            liveCount++;
          }
        }
      }
    }
    if (cell) {
      return liveCount >= 2 && liveCount < 4;
    } else {
      return liveCount === 3;
    }
  }

  private checkEdges() {
    return this.rows[0].filter(cell => cell).length > 0 || this.rows.filter(row => row[0]).length > 0;
  }

  private addRowsCols() {
    this.rows = this.rows.map((row) => {
      row.unshift(false);
      row.push(false);
      return row;
    })
    const colCount = this.rows[0].length;
    const blankRow = [];
    for (let i = 0; i < colCount; i++) {
      blankRow.push(false);
    }
    this.rows.unshift(cloneDeep(blankRow));
    this.rows.push(cloneDeep(blankRow));
  }

}
