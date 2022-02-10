import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private prodBase = 'https://us-central1-skill-demo-41dd3.cloudfunctions.net/';
  private localBass = 'http://localhost:5001/skill-demo-41dd3/us-central1/';
  constructor() { }

  get presets(): any {
    return `${this.prodBase}presets`;
  }

}
