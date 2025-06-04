import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentYear: number = new Date().getFullYear();

  beneficios = [
    { titulo: 'Docentes especializados', descripcion: 'Equipo académico con experiencia preuniversitaria.' },
    { titulo: 'Simulacros constantes', descripcion: 'Simulacros periódicos para reforzar tu preparación.' },
    { titulo: 'Aulas virtuales y presenciales', descripcion: 'Modalidades adaptadas a tus necesidades.' },
    { titulo: 'Asesoría personalizada', descripcion: 'Acompañamiento académico y emocional.' },
    { titulo: 'Material actualizado', descripcion: 'Guías y recursos preparados para el examen UNSM.' },
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  mobileMenuOpen = false;

toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}

}
