import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {cloneDeep} from "lodash";

export interface LifeGameCellStatus {
  row: number,
  col: number,
  alive: boolean
}

export class LifeGameCell {
  get currentStatus(): Observable<LifeGameCellStatus> {
    return this._currentStatus;
  }

  alive: boolean = false;
  row: number;
  col: number;
  liveCount: number = 0;

  private currentStatus$: BehaviorSubject<LifeGameCellStatus> = new BehaviorSubject<LifeGameCellStatus>({
    col: 0,
    row: 0,
    alive: false
  });
  private _currentStatus: Observable<LifeGameCellStatus> = this.currentStatus$.asObservable();
  private neighbours: { [key: string]: boolean } = {};
  private destroy$: Subject<void> = new Subject<void>();
  private neighbourChanged: boolean = false;
  private neighbourHash: { [key: string]: Subscription } = {};

  constructor(row: number, col: number, stepper: Observable<void>, destroy: Subject<void>) {
    this.row = row;
    this.col = col;
    this.destroy$ = destroy;
    this.currentStatus$.next({
      col,
      row,
      alive: false
    });
    stepper
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkSelf();
      })
  }

  addNeighbour(cell: LifeGameCell) {
    const neighbourObs = cell.currentStatus;
    const neighbourRow = cell.row;
    const neighbourCol = cell.col;
    if (!!this.neighbourHash[`row${neighbourRow}-col${neighbourCol}`]) {
      return;
    }
    this.neighbourHash[`row${neighbourRow}-col${neighbourCol}`] = neighbourObs.pipe(takeUntil(this.destroy$))
      .subscribe((data: LifeGameCellStatus) => {
        if (this.neighbours[`row${data.row}-col${data.col}`] !== data.alive) {
          this.neighbourChanged = true;
        }
        this.neighbours[`row${data.row}-col${data.col}`] = data.alive;
        this.liveCount = Object.values(this.neighbours).filter(value => value).length;
      })
  }

  checkSelf() {
    if (!this.neighbourChanged) {
      return;
    }
    this.neighbourChanged = false;
    const originalStatus = cloneDeep(this.alive);
    let liveCount = 0;
    Object.values(this.neighbours).forEach(alive => {
      if (alive) {
        liveCount++;
      }
    })
    if (this.alive) {
      this.alive = liveCount === 2 || liveCount === 3;
    } else {
      this.alive = liveCount === 3
    }
    if (originalStatus !== this.alive) {
      setTimeout(() => this.informNeighbours());
    }
  }

  toggleSelf() {
    this.alive = !this.alive;
    this.informNeighbours();
  }

  informNeighbours() {
    this.currentStatus$.next({
      row: this.row,
      col: this.col,
      alive: this.alive
    });
  }
}
