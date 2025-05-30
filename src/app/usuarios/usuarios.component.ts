import { Component, OnInit } from '@angular/core';
import { Rol } from '../model/rol';
import { Usuario } from '../model/usuario';
import { RolService } from '../services/rol-service.service';
import { UsuariosService } from '../services/usuarios.service';
import Swal from 'sweetalert2';
 // Asegúrate que esté creado

@Component({
  selector: 'app-roles',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = []; // Lista de roles cargados desde el backend
  usuario: Usuario = new Usuario();
  isEdit: boolean = false;
  columnas: any[] = [];
  showDialog: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();

    this.columnas = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Nombre', field: 'name' },
      { headerName: 'Usuario', field: 'username' },
      { headerName: 'Rol', field: 'rol.nombre' }, // Acceder a rol.nombre
      {
        headerName: 'Acciones',
        cellRenderer: () => {
          return `
            <span class="acciones-cell">
              <button class="editar-btn" title="Editar">✏️</button>
              <button class="eliminar-btn" title="Eliminar">🗑️</button>
            </span>
          `;
        },
        onCellClicked: (params: any) => this.handleAccionUsuario(params)
      }
    ];
  }

  getUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
      },
      error => {
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    );
  }

  getRoles(): void {
    this.rolService.getRoles().subscribe(
      (data: Rol[]) => this.roles = data,
      error => Swal.fire('Error', 'No se pudieron cargar los roles', 'error')
    );
  }

  saveUsuario(): void {
    if (this.isEdit) {
      this.usuariosService.updateUsuario(this.usuario).subscribe(
        () => {
          Swal.fire('Actualizado', 'Usuario actualizado exitosamente', 'success');
          this.getUsuarios();
          this.closeModal();
        },
        error => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
      );
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe(
        () => {
          Swal.fire('Guardado', 'Usuario registrado exitosamente', 'success');
          this.getUsuarios();
        },
        error => Swal.fire('Error', 'No se pudo registrar el usuario', 'error')
      );
    }
    this.resetForm();
    this.closeModal();
  }

  editUsuario(usuario: Usuario): void {
    this.usuario = { ...usuario, password: '' };
    this.isEdit = true;
    this.showDialog = true;
  }

  deleteUsuario(id: number | undefined): void {
    if (id !== undefined) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuariosService.deleteUsuario(id).subscribe(
            () => {
              Swal.fire('Eliminado', 'Usuario eliminado exitosamente', 'success');
              this.getUsuarios();
            },
            error => {
              Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
            }
          );
        }
      });
    }
  }

  openAddModal(usuario?: Usuario): void {
    this.usuario = usuario ? { ...usuario } : new Usuario();
    this.isEdit = !!usuario;
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.usuario = new Usuario();
    this.isEdit = false;
  }

  handleAccionUsuario(params: any) {
    const target = params.event.target as HTMLElement;
    if (target.closest('.editar-btn')) {
      this.editUsuario(params.data);
    } else if (target.closest('.eliminar-btn')) {
      this.deleteUsuario(params.data.id);
    }
  }
}
