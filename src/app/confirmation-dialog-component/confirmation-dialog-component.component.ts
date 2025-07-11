import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirmación</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button color="success" mat-button [mat-dialog-close]="true">Usar aqui</button>
      <button mat-button [mat-dialog-close]="false">cerrar</button>
    </div>
  `
})
export class ConfirmationDialogComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
