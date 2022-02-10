import {HttpHeaders, HttpParams} from "@angular/common/http";

export class ClientOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: any; // 'json' | 'text' | 'blob' | 'arrayBuffer'
  withCredentials?: boolean;
}
