import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog'; // Inyectar MatDialog
import { ConfirmationDialogComponentComponent } from 'src/app/confirmation-dialog-component/confirmation-dialog-component.component';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
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
  isLoading: boolean = false;
  captchaValido: boolean = false;
captchaToken: string | null = null;
  //validargogle='https://cpu-unsm-app.onrender.com/oauth2/google'
  validargogle='http://localhost:8080/oauth2/google'; // URL de tu backend para autenticación con Google

constructor(private authService: AuthService, private router: Router, private http: HttpClient, private dialog: MatDialog,private ngZone: NgZone) {}
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


login() {
  if (!this.captchaValido) {
    Swal.fire('Verificación requerida', 'Confirma que no eres un robot.', 'warning');
    return;
  }

  this.isLoading = true;
  this.authService.isSessionActive(this.username, this.password).subscribe(
    (isActive) => {
      this.isLoading = false;
      if (isActive) {
        this.openConfirmationDialog();
      } else {
        this.isLoading = true;
        this.continueLogin();
      }
    },
    (error) => {
      this.isLoading = false;
      Swal.fire('Error', 'Credenciales inválidas o sesión no verificada.', 'error');
      this.username = '';
      this.password = '';
    }
  );
}

onCaptchaResolved(token: string) {
  this.captchaValido = !!token;
  this.captchaToken = token;
  console.log('Captcha resuelto:', token);
}


  // Método que maneja el login
  private continueLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        if (response === null) {
          Swal.fire('Proceso cancelado', 'La sesión anterior no se invalidó, no se ha iniciado sesión.', 'info');
            this.username = '';
            this.password = '';
        } else if (response.requires2fa) {
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

  // Método para manejar el error de login
  private handleLoginError() {
    Swal.fire('Error de autenticación', 'Credenciales incorrectas o error en el servidor.', 'error');
    this.authService.logout();
  }

  // Método para manejar el login exitoso
  private handleSuccessLogin(token: string) {
    this.authService.setToken(token);
    Swal.fire('Login exitoso', 'Redirigiendo al dashboard...', 'success').then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  // Método para abrir el cuadro de diálogo de confirmación
  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponentComponent, {
      width: '300px',
      data: { message: 'no puedes tener varias sesiones' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // El usuario aceptó invalidar la sesión, proceder con el login
        this.continueLogin();
      } else {
        // El usuario decidió no invalidar la sesión
        Swal.fire('Proceso cancelado', 'No se ha iniciado sesión.', 'info');
          this.username = '';
          this.password = '';
      }
    });
  }
  /* loginWithGoogle() {
  this.isLoading = true;

  this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
    const credential = user.idToken;

    this.authService.loginWithGoogle(credential).subscribe({
      next: (resp) => {
        this.isLoading = false;

        if (resp?.requires2fa) {
          localStorage.setItem('temp_user', resp.username);
          Swal.fire('Código requerido', 'Revisa tu correo para ingresar el código 2FA', 'info').then(() => {
            this.router.navigate(['/verificar-codigo'], { queryParams: { username: resp.username } });
          });
        } else if (resp?.jwt) {
          this.handleSuccessLogin(resp.jwt);
        } else {
          Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          Swal.fire('Sesión activa', err.error, 'info');
        } else {
          Swal.fire('Error', 'Error al iniciar sesión con Google', 'error');
        }
      }
    });

  }).catch(() => {
    this.isLoading = false;
    Swal.fire('Error', 'No se pudo autenticar con Google.', 'error');
  });
}
 */
}
