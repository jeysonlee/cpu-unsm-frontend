import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { Modulo } from '../model/modulo';
import { ModuloService } from '../services/modulo.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements OnInit {

  modulos: Modulo[] = [];
  modulo: Modulo = new Modulo();
  isEdit: boolean = false;
  showDialog: boolean = false;
  columnas: any[] = [];

  constructor(private moduloService: ModuloService) {}

  ngOnInit(): void {
    this.getModulos();

    this.columnas = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Nombre', field: 'nombre' },
      { headerName: 'URL', field: 'url' },
      {
        headerName: 'Padre',
        valueGetter: (params: any) => params.data?.padre?.nombre || 'Raíz'
      },
      {
        headerName: 'Acciones',
        cellRenderer: () => `
          <span class="acciones-cell">
            <button class="editar-btn" title="Editar">✏️</button>
            <button class="eliminar-btn" title="Eliminar">🗑️</button>
          </span>
        `,
        onCellClicked: (params: any) => this.handleAccionModulo(params)
      }
    ];
  }

  getModulos(): void {
    this.moduloService.getModulos().subscribe({
      next: (data) => this.modulos = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar los módulos', 'error')
    });
  }

  saveModulo(): void {
    if (this.isEdit && this.modulo.id) {
      this.moduloService.updateModulo(this.modulo).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Módulo actualizado exitosamente', 'success');
          this.getModulos();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el módulo', 'error')
      });
    } else {
      this.moduloService.createModulo(this.modulo).subscribe({
        next: () => {
          Swal.fire('Registrado', 'Módulo registrado exitosamente', 'success');
          this.getModulos();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo registrar el módulo', 'error')
      });
    }
  }

  editModulo(modulo: Modulo): void {
    this.modulo = { ...modulo };
    this.isEdit = true;
    this.showDialog = true;
  }

  deleteModulo(id?: number): void {
    if (!id) return;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then(result => {
      if (result.isConfirmed) {
        this.moduloService.deleteModulo(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Módulo eliminado correctamente', 'success');
            this.getModulos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el módulo', 'error')
        });
      }
    });
  }

  handleAccionModulo(params: any): void {
    const target = params.event.target as HTMLElement;
    if (target.closest('.editar-btn')) {
      this.editModulo(params.data);
    } else if (target.closest('.eliminar-btn')) {
      this.deleteModulo(params.data.id);
    }
  }

  openAddModal(): void {
    this.modulo = new Modulo();
    this.isEdit = false;
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.modulo = new Modulo();
    this.isEdit = false;
  }
}
