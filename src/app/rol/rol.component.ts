import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { Rol } from '../model/rol';
import { RolService } from '../services/rol-service.service';

@Component({
  selector: 'app-roles',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  roles: Rol[] = [];
  rol: Rol = new Rol();
  isEdit: boolean = false;
  showDialog: boolean = false;
  columnas: any[] = [];

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.getRoles();

    this.columnas = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Nombre', field: 'nombre' },
      {
        headerName: 'Acciones',
        cellRenderer: () => `
          <span class="acciones-cell">
            <button class="editar-btn" title="Editar">✏️</button>
            <button class="eliminar-btn" title="Eliminar">🗑️</button>
          </span>
        `,
        onCellClicked: (params: any) => this.handleAccionRol(params)
      }
    ];
  }

  getRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar los roles', 'error')
    });
  }

  saveRol(): void {
    if (this.isEdit && this.rol.id) {
      this.rolService.updateRol(this.rol).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Rol actualizado exitosamente', 'success');
          this.getRoles();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el rol', 'error')
      });
    } else {
      this.rolService.createRol(this.rol).subscribe({
        next: () => {
          Swal.fire('Registrado', 'Rol registrado exitosamente', 'success');
          this.getRoles();
          this.closeModal();
        },
        error: () => Swal.fire('Error', 'No se pudo registrar el rol', 'error')
      });
    }
  }

  editRol(rol: Rol): void {
    this.rol = { ...rol };
    this.isEdit = true;
    this.showDialog = true;
  }

  deleteRol(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then(result => {
      if (result.isConfirmed) {
        this.rolService.deleteRol(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Rol eliminado correctamente', 'success');
            this.getRoles();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el rol', 'error')
        });
      }
    });
  }

  handleAccionRol(params: any): void {
    const target = params.event.target as HTMLElement;
    if (target.closest('.editar-btn')) {
      this.editRol(params.data);
    } else if (target.closest('.eliminar-btn')) {
      this.deleteRol(params.data.id);
    }
  }

  openAddModal(): void {
    this.rol = new Rol();
    this.isEdit = false;
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.rol = new Rol();
    this.isEdit = false;
  }
}
