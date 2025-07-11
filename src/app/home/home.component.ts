import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentYear: number = new Date().getFullYear();
mobileMenuOpen = false;
  beneficios = [
    { titulo: 'Docentes especializados', descripcion: 'Equipo académico con experiencia preuniversitaria.' },
    { titulo: 'Simulacros constantes', descripcion: 'Simulacros periódicos para reforzar tu preparación.' },
    { titulo: 'Aulas virtuales y presenciales', descripcion: 'Modalidades adaptadas a tus necesidades.' },
    { titulo: 'Asesoría personalizada', descripcion: 'Acompañamiento académico y emocional.' },
    { titulo: 'Material actualizado', descripcion: 'Guías y recursos preparados para el examen UNSM.' },
  ];

scrollTo(id: string) {
  this.mobileMenuOpen = false;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}



toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}



}
