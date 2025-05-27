import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../model/usuario';
import Swal from 'sweetalert2';
//import * as XLSX from 'xlsx';
//import * as FileSaver from 'file-saver';
declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario: Usuario = new Usuario();
  isEdit: boolean = false;
  columnas: any[] = [];
  showDialog: boolean = false;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.getUsuarios();

this.columnas = [
  { headerName: 'ID', field: 'id' },
  { headerName: 'Nombre', field: 'name' },
  { headerName: 'Usuario', field: 'username' },
  { headerName: 'Rol', field: 'role' },
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

  // Obtener la lista de usuarios
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
handleAccionUsuario(params: any) {
  const target = params.event.target as HTMLElement;

  if (target.closest('.editar-btn')) {
    this.editUsuario(params.data); // Pasa todo el objeto usuario
  } else if (target.closest('.eliminar-btn')) {
    this.deleteUsuario(params.data.id);
  }
}

  // Registrar un nuevo usuario
  saveUsuario(): void {
    if (this.isEdit) {
      this.usuariosService.updateUsuario(this.usuario).subscribe(
        () => {
          Swal.fire('Actualizado', 'Usuario actualizado exitosamente', 'success');
          this.getUsuarios();
          this.closeModal();
        },
        error => {
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      );
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe(
        () => {
          Swal.fire('Guardado', 'Usuario registrado exitosamente', 'success');
          this.getUsuarios();
        },
        error => {
          Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
        }
      );
    }
    this.resetForm();
    this.closeModal();
  }

// Editar un usuario
editUsuario(usuario: Usuario): void {
  this.usuario = { ...usuario, password: '' }; // Vaciamos la contraseña al clonar el objeto
  this.isEdit = true;
  this.showDialog = true;
}


  // Eliminar un usuario
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

  // Abrir el modal de agregar nuevo usuario
openAddModal(usuario?: Usuario): void {
  this.usuario = usuario ? { ...usuario } : new Usuario();
  this.isEdit = !!usuario;
  this.showDialog = true;
}

closeModal(): void {
  this.showDialog = false;
  this.resetForm();
}


  // Resetear el formulario
  resetForm(): void {
    this.usuario = new Usuario();
    this.isEdit = false;
  }



/* exportarUsuariosAExcel(): void {
  this.usuariosService.getUsuarios().subscribe({
    next: (usuarios: Usuario[]) => {
      // Aplanar los datos
      const flattenedData = usuarios.map((usuario) => ({
        'ID Usuario': usuario.id || 'N/A',
        Nombre: usuario.name || 'N/A',
        Usuario: usuario.username || 'N/A',
        Rol: usuario.role || 'N/A',
      }));

      // Convierte los datos a una hoja Excel
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);

      // Crea un libro de Excel y agrega la hoja
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

      // Convierte el libro a un archivo Blob
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Descarga el archivo
      FileSaver.saveAs(blob, 'usuarios.xlsx');
    },
    error: () => {
      Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
    },
  });
} */
}
