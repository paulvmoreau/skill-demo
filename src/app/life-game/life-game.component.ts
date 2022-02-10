import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {LifeGameService} from "./life-game.service";
import {LifeGameConfig} from "./life-game-observables/life-game-config";

@Component({
  selector: 'app-life-game',
  templateUrl: './life-game.component.html',
  styleUrls: ['./life-game.component.scss']
})
export class LifeGameComponent implements OnInit {
  running: boolean = false;
  initialRows = 30;
  initialColumns = 30;
  refreshRate = 100;
  gridType: boolean = false;
  processingType: string = 'obs';
  categories: string[] = [
    'Still lifes',
    'Oscillators',
    'Spaceships'
  ]
  category: string = this.categories[0];
  name: string = 'preset 1';
  presetCategories: string[] = [];
  presets: {[key: string]:LifeGameConfig[]} = {};
  isAdmin = false;

  private start$: Subject<void> = new Subject<void>();
  private _startObs: Observable<void> = this.start$.asObservable();
  private step$: Subject<void> = new Subject<void>();
  private _stepObs: Observable<void> = this.step$.asObservable();
  private stop$: Subject<void> = new Subject<void>();
  private _stopObs: Observable<void> = this.stop$.asObservable();
  private saveToPreset$: Subject<{ name: string, looped: boolean, category: string }> =
    new Subject<{ name: string, looped: boolean, category: string }>();
  private _saveToPresetObs: Observable<{ name: string, looped: boolean, category: string }> =
    this.saveToPreset$.asObservable();
  private setPreset$: Subject<LifeGameConfig> =
    new Subject<LifeGameConfig>();
  private _setPresetObs: Observable<LifeGameConfig> =
    this.setPreset$.asObservable();

  constructor(private lifeGameService: LifeGameService) {
  }

  ngOnInit(): void {
    this.getPresets();
  }

  get stopObs(): Observable<void> {
    return this._stopObs;
  }

  get startObs(): Observable<void> {
    return this._startObs;
  }

  get saveToPresetObs(): Observable<{ name: string, looped: boolean, category: string }> {
    return this._saveToPresetObs;
  }

  get setPresetObs(): Observable<LifeGameConfig> {
    return this._setPresetObs;
  }

  get stepObs(): Observable<void> {
    return this._stepObs;
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

  savePreset() {
    this.saveToPreset$.next({name: this.name, looped: !this.gridType, category: this.category} );
  }

  private getPresets() {
    this.lifeGameService.getPresets().subscribe((data) => {
      this.presets = data;
      this.presetCategories = Object.keys(this.presets);
    })
  }

  loadPreset(preset: LifeGameConfig) {
    this.initialRows = preset.height;
    this.initialColumns = preset.width;
    this.gridType = !preset.looped;
    this.clear();
    setTimeout(() => {
      this.setPreset$.next(preset);
    })
  }
}
