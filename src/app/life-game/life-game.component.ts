import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-life-game',
  templateUrl: './life-game.component.html',
  styleUrls: ['./life-game.component.scss']
})
export class LifeGameComponent implements OnInit {
  get stepObs(): Observable<void> {
    return this._stepObs;
  }
  running: boolean = false;
  initialRows = 30;
  initialColumns = 30;
  refreshRate = 100;
  gridType: boolean = false;
  start$: Subject<void> = new Subject<void>();
  private _startObs: Observable<void> = this.start$.asObservable();
  step$: Subject<void> = new Subject<void>();
  private _stepObs: Observable<void> = this.step$.asObservable();
  stop$: Subject<void> = new Subject<void>();
  private _stopObs: Observable<void> = this.stop$.asObservable();
  processingType: string = 'obs';

  constructor() {
  }

  ngOnInit(): void {
  }

  get stopObs(): Observable<void> {
    return this._stopObs;
  }

  get startObs(): Observable<void> {
    return this._startObs;
  }

  start() {
    this.running = true;
    this.start$.next();
  }

  step() {
    this.step$.next();
  }

  stop() {
    this.running = false;
    this.stop$.next();
  }

  clear() {
    const clone = this.processingType;
    this.processingType = '';
    setTimeout(() => {
      this.processingType = clone;
    })
  }

  //TODO: add presets from https://www.wikiwand.com/en/Conway%27s_Game_of_Life#/Examples_of_patterns
}
