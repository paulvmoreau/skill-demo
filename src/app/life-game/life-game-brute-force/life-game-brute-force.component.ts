import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {cloneDeep} from "lodash";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {LifeGameConfig} from "../life-game-observables/life-game-config";
import {LifeGameService} from "../life-game.service";

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
  @Input() expand: boolean = false;
  @Input() stepObs?: Observable<void>;
  @Input() savePresetObs?: Observable<{ name: string, looped: boolean, category: string }>;
  @Input() setPresetObs?: Observable<LifeGameConfig>;

  rows: boolean[][] = [];
  private timer?: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private lifeGameService: LifeGameService) {
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
    if (this.savePresetObs) {
      this.savePresetObs
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.savePreset(data.name, data.looped, data.category);
        });
    }
    if (this.setPresetObs) {
      this.setPresetObs
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.setPreset(data);
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
      if (this.expand) {
        this.addRowsCols();
      }
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
      let iIndex = i;
      if (!this.expand) {
        if (iIndex >= this.rows.length) {
          iIndex = 0;
        }
        if (iIndex < 0) {
          iIndex = this.rows.length - 1;
        }
      }
      if (this.rows[iIndex]) {
        for (let j = colIndex - 1; j <= colIndex + 1; j++) {
          if (!(i === rowIndex && j === colIndex)) {
            let jIndex = j;
            if (!this.expand) {
              if (jIndex === this.rows[iIndex].length) {
                jIndex = 0;
              }
              if (jIndex < 0) {
                jIndex = this.rows[iIndex].length - 1;
              }
            }
            if (this.rows[iIndex][jIndex]) {
              liveCount++;
            }
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
    // check top and bottom row
    if (this.rows[0].indexOf(true) > 0 || this.rows[this.rows.length - 1].indexOf(true) > 0) {
      return true;
    }
    // check left and right column
    return this.rows.filter((row) => {
      return row[0] || row[row.length - 1];
    }).length > 0;
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

  private savePreset(name: string, looped: boolean, category: string) {
    const preset: LifeGameConfig = {
      name,
      looped,
      height: this.rows.length,
      width: this.rows[0].length,
      category,
      aliveCoords: this.extractAliveCoords()
    }
    this.lifeGameService.savePreset(preset);
  }

  private extractAliveCoords(): { x: number, y: number }[] {
    const aliveCoords: { x: number; y: number; }[] = [];
    this.rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          aliveCoords.push({
            x: colIndex,
            y: rowIndex
          })
        }
      })
    })
    return aliveCoords;
  }

  private setPreset(data: LifeGameConfig) {
    data.aliveCoords.forEach((point) => {
      this.rows[point.y][point.x] = true;
    })
  }
}
