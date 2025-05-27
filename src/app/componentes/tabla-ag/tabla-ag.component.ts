import { Component, Input, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-tabla-ag',
  templateUrl: './tabla-ag.component.html',
  styleUrls: ['./tabla-ag.component.css']
})
export class TablaAgComponent {
  @Input() columnDefs: any[] = [];
  @Input() rowData: any[] = [];

  @ViewChild('agGrid') agGrid!: AgGridAngular;

  // Configuración por defecto de las columnas
defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,       // 🔹 Cada columna ocupa espacio proporcional
  minWidth: 100  // 🔹 No se reduce más allá de 100px (evita que desaparezca)
};


  // Búsqueda global
  quickFilterValue = '';

onQuickFilterChanged(event: Event) {
  const input = event.target as HTMLInputElement;
  this.quickFilterValue = input.value;
  this.agGrid.api.setQuickFilter(this.quickFilterValue);
}

}
