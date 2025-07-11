import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-upload-firmar',
  templateUrl: './upload-firmar.component.html',
  styleUrls: ['./upload-firmar.component.css']
})
export class UploadFirmarComponent implements OnInit {
  archivo: File | null = null;
  nombreFirmante: string = '';
  mensaje: string = '';
  pdfFirmadoURL: SafeResourceUrl | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.nombreFirmante = this.obtenerNombre();
  }

  obtenerNombre(): string {
    const info = this.authService.getUserInfo();
    return info && info.name ? info.name : 'Invitado';
  }

  onFileChange(event: any) {
    this.archivo = event.target.files[0];
  }

  firmarDocumento() {
    if (!this.archivo || !this.nombreFirmante.trim()) {
      this.mensaje = '❗ Por favor sube un archivo y escribe tu nombre.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.archivo);
    formData.append('nombre', this.nombreFirmante);

    this.http.post('http://localhost:8080/api/documentos/firmar', formData, {
      responseType: 'blob'
    }).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        this.pdfFirmadoURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mensaje = '✅ Documento firmado con éxito.';
      },
      error: () => {
        this.mensaje = '❌ Error al firmar el documento.';
      }
    });
  }
}
