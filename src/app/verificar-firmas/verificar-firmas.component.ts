import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verificar-firmas',
  templateUrl: './verificar-firmas.component.html',
  styleUrls: ['./verificar-firmas.component.css']
})
export class VerificarFirmasComponent {
  archivo: File | null = null;
  mensaje: string = '';
  firmantes: string[] = [];
  esValido: boolean | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.archivo = event.target.files[0];
    this.firmantes = [];
    this.mensaje = '';
    this.esValido = null;
  }

  verificarDocumento() {
    if (!this.archivo) {
      this.mensaje = '❗ Selecciona un archivo PDF para verificar.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.archivo);

    this.http.post<any>('https://cpu-unsm-app.onrender.com/api/documentos/verificar', formData)
      .subscribe({
        next: (respuesta) => {
          this.esValido = respuesta.valido;
          this.firmantes = respuesta.firmantes || [];
          this.mensaje = this.esValido
            ? '✅ Documento válido y firmado correctamente.'
            : '⚠️ El documento no es válido o ha sido alterado.';
        },
        error: () => {
          this.mensaje = '❌ Error al verificar el documento.';
          this.firmantes = [];
          this.esValido = null;
        }
      });
  }
}
