import { Injectable } from '@angular/core';
import {LifeGameConfig} from "./life-game-observables/life-game-config";
import {UrlService} from "../services/url.service";
import {ApiService} from "../services/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LifeGameService {

  constructor(private urlService: UrlService,
              private apiService: ApiService) { }

  savePreset(preset: LifeGameConfig) {
    const url: string = this.urlService.presets;
    this.apiService.post(url, preset).subscribe(() => {});
  }

  getPresets(): Observable<{[key: string]:LifeGameConfig[]}> {
    const url: string = this.urlService.presets;
    return this.apiService.get<{[key: string]:LifeGameConfig[]}>(url);
  }
}
