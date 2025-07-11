import { Component } from '@angular/core';
import { DigitalSignatureService } from '../services/digital-signature.service';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.css']
})
export class DigitalSignatureComponent {

  fileToSign: File | null = null;
  signatureFile: File | null = null;
  name = '';
  password = '';
  message = '';

  constructor(private dsService: DigitalSignatureService) {}

  onFileSelected(e: any) {
    this.fileToSign = e.target.files[0];
  }

  onSignatureSelected(e: any) {
    this.signatureFile = e.target.files[0];
  }

  signDocument() {
    if (!this.fileToSign || !this.name || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    this.dsService.signFile(this.fileToSign, this.name, this.password).subscribe((res: any) => {
      this.download(res.pdf, res.filename);
      this.download(res.signature, res.filename.replace('.pdf', '.sig'));
    });
  }

  verifyDocument() {
    if (!this.fileToSign || !this.signatureFile || !this.password) {
      alert('Sube el documento, firma y contraseña');
      return;
    }

    this.dsService.verifySignature(this.fileToSign, this.signatureFile, this.password).subscribe(res => {
      this.message = res;
    });
  }

  download(data: BlobPart, filename: string) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
