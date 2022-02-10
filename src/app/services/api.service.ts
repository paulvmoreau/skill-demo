import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ClientOptions} from "../models/client-options";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private defaultOptions: ClientOptions;

  constructor(private httpClient: HttpClient) {
    this.defaultOptions = new ClientOptions();
  }

  get<T>(url: string, options? : ClientOptions) {
    // options = this.aggregateOptions(options); // enable when Auth built
    return this.httpClient.get<T>(url, options);
  }

  post(url: string, data?: any, options?: ClientOptions): Observable<any> {
    return this.httpClient.post(url, data, options);
  }

  private aggregateOptions(options: ClientOptions | undefined) {
    this.createAuthorizationHeader();
    return {...this.defaultOptions, ...options} as ClientOptions;
  }

  createAuthorizationHeader(): void {
    if (localStorage.getItem('id_token')) {
      this.defaultOptions.headers = this.defaultOptions.headers ? this.defaultOptions.headers : new HttpHeaders();
      // @ts-ignore
      const token = localStorage.getItem('id_token').toString();
      this.defaultOptions.headers = this.defaultOptions.headers.set('Authorization', token);
    }
  }
}
