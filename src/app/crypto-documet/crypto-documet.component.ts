import { Component } from '@angular/core';
import { CryptoDocumentService } from '../services/crypto-document.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crypto-documet',
  templateUrl: './crypto-documet.component.html',
  styleUrls: ['./crypto-documet.component.css']
})
export class CryptoDocumetComponent {
  encryptFileName: File | null = null;
  decryptFileName: File | null = null;
  encryptKey: string = '';
  decryptKey: string = '';

  encryptedBlob: Blob | null = null;
  decryptedBlob: Blob | null = null;

  constructor(private cryptoService: CryptoDocumentService) {}

  onEncryptFileChange(event: any) {
    this.encryptFileName = event.target.files[0];
  }

  onDecryptFileChange(event: any) {
    this.decryptFileName = event.target.files[0];
  }

  encrypt() {
    if (!this.encryptFileName) {
      Swal.fire('Error', 'Debe seleccionar un archivo para cifrar.', 'error');
      return;
    }

    if (!this.encryptKey || this.encryptKey.length !== 16) {
      Swal.fire('Clave inválida', 'La clave debe tener exactamente 16 caracteres.', 'warning');
      return;
    }

    this.cryptoService.encryptFile(this.encryptFileName, this.encryptKey).subscribe({
      next: res => {
        this.encryptedBlob = res.body!;
        this.download(this.encryptedBlob, this.encryptFileName!.name + '.enc');
        Swal.fire('Éxito', 'Archivo cifrado correctamente.', 'success');
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cifrar el archivo.', 'error');
      }
    });
  }

  decrypt() {
    if (!this.decryptFileName) {
      Swal.fire('Error', 'Debe seleccionar un archivo para descifrar.', 'error');
      return;
    }

    if (!this.decryptKey || this.decryptKey.length !== 16) {
      Swal.fire('Clave inválida', 'La clave debe tener exactamente 16 caracteres.', 'warning');
      return;
    }

    this.cryptoService.decryptFile(this.decryptFileName, this.decryptKey).subscribe({
      next: res => {
        const disposition = res.headers.get('content-disposition');
        const filenameMatch = disposition?.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'archivo-descifrado';

        this.decryptedBlob = res.body!;
        this.download(this.decryptedBlob, filename);
        Swal.fire('Éxito', 'Archivo descifrado correctamente.', 'success');
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudo descifrar el archivo. Verifique la clave o el archivo.', 'error');
      }
    });
  }

  download(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
