import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  export class DigitalSignatureService {

  private baseUrl = 'http://localhost:8080/api/signature';

  constructor(private http: HttpClient) {}

  signFile(file: File, name: string, password: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('password', password);

    return this.http.post(this.baseUrl + '/sign', formData, { responseType: 'json' });
  }

  verifySignature(file: File, sig: File, password: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', sig);
    formData.append('password', password);

    return this.http.post(this.baseUrl + '/verify', formData, { responseType: 'text' });
  }
}
