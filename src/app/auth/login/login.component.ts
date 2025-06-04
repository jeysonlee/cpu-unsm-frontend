import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { NgZone } from '@angular/core';

import { HttpClient } from '@angular/common/http';

declare const google: any; // para poder usar la API de Google


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  showRegister: boolean = false;
  registerName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  isLoading: boolean = false;
  validargogle='https://cpu-unsm-app.onrender.com/oauth2/google'
  //validargogle='http://localhost:8080/oauth2/google'; // URL de tu backend para autenticación con Google

  constructor(private authService: AuthService, private router: Router, private http: HttpClient,private ngZone: NgZone) {}

ngOnInit(): void {
  google.accounts.id.initialize({
    client_id: '208653476798-6tsh9o9efl15l3occ12fdjsahrafqob8.apps.googleusercontent.com',
    callback: (response: any) => {
      this.ngZone.run(() => this.handleGoogleCredential(response)); // ✅ Corre en zona Angular
    }
  });

  google.accounts.id.renderButton(
    document.getElementById('googleButton'),
    { theme: 'outline', size: 'large' }
  );
}


handleGoogleCredential(response: any) {
  this.isLoading = true; // Mostrar spinner inmediatamente al seleccionar cuenta

  const credential = response.credential;

  this.http.post<any>(this.validargogle, { credential }).subscribe({
    next: res => {
      if (res.requires2fa) {
        localStorage.setItem('temp_user', res.username);
      this.isLoading = false;
        // Mostrar alerta y luego desactivar spinner
        Swal.fire({
          title: 'Código requerido',
          text: res.message,
          icon: 'info'
        }).then(() => {
          this.isLoading = false;
          this.router.navigate(['/verificar-codigo'], {
            queryParams: { username: res.username }
          });
        });

      } else if (res.token) {
        this.authService.setToken(res.token);

        Swal.fire('Login exitoso', 'Bienvenido con Google', 'success').then(() => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        });

      } else {
        this.isLoading = false;
        Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
      }
    },
    error: err => {
      this.isLoading = false;
      Swal.fire('Error', 'Token inválido o error al autenticar', 'error');
      console.error(err);
    }
  });
}




  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.clearFields();
  }

  clearFields() {
    this.username = '';
    this.password = '';
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
  }

login() {
  this.isLoading = true;
  this.authService.login(this.username, this.password).subscribe(
    (response) => {
      this.isLoading = false;
      if (response.requires2fa) {
        localStorage.setItem('temp_user', this.username);
        Swal.fire('Código requerido', 'Revisa tu correo para ingresar el código 2FA', 'info').then(() => {
          this.router.navigate(['/verificar-codigo'], { queryParams: { username: this.username } });
        });
      } else if (response.jwt) {
        this.handleSuccessLogin(response.jwt);
      } else {
        Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
      }
    },
    () => {
      this.isLoading = false;
      this.handleLoginError();
    }
  );
}


register() {
  this.isLoading = true;
  const user = {
    name: this.registerName,
    username: this.registerEmail,
    password: this.registerPassword
  };

  this.authService.registerPublicUser(user).subscribe(
    () => {
      this.isLoading = false;
      localStorage.setItem('temp_user', this.registerEmail); // ✅ Esto es lo que faltaba
      Swal.fire('Registro exitoso', 'Revisa tu correo para el código de verificación', 'success').then(() => {
        this.router.navigate(['/verificar-codigo'], { queryParams: { username: this.registerEmail } });
      });
    },
    (error) => {
      this.isLoading = false;
      console.error(error);
      Swal.fire('Error', 'No se pudo completar el registro.', 'error');
    }
  );
}

  private handleSuccessLogin(token: string) {
    this.authService.setToken(token);
    Swal.fire('Login exitoso', 'Redirigiendo al dashboard...', 'success').then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  private handleLoginError() {
    Swal.fire('Error de autenticación', 'Credenciales incorrectas o error en el servidor.', 'error');
    this.authService.logout();
  }

  logout() {
    this.authService.logout();
    Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente.', 'success');
    this.router.navigate(['/login']);
  }
}
