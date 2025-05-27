import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumLetrasService {

  constructor() { }

  convertirNumeroALetras(num: number): string {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
    
    let entero = Math.floor(num);
    let decimal = Math.round((num - entero) * 100);

    let letrasEntero = '';
    if (entero >= 100) {
      letrasEntero += centenas[Math.floor(entero / 100)];
      entero = entero % 100;
    }
    if (entero >= 10) {
      letrasEntero += ' ' + decenas[Math.floor(entero / 10)];
      entero = entero % 10;
    }
    letrasEntero += ' ' + unidades[entero];

    let letrasDecimal = decimal > 0 ? `con ${decimal}/100` : '';

    return `${letrasEntero.trim()} ${letrasDecimal} Soles`;
  }
}
