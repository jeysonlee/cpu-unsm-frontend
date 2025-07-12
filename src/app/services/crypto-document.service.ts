import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoDocumentService {

  constructor(private http: HttpClient) { }


encryptFile(file: File, key: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  return this.http.post('http://localhost:8080/api/encrypt', formData, {
    responseType: 'blob',
    observe: 'response'
  });
}

decryptFile(file: File, key: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  return this.http.post('https://cpu-unsm-app.onrender.com/api/decrypt', formData, {
    responseType: 'blob',
    observe: 'response'
  });
}


}
