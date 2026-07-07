// js/auth.js
import { auth, googleProvider } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const googleBtn = document.getElementById('googleLoginBtn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
      return Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos.',
        confirmButtonColor: '#4361ee'
      });
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        confirmButtonColor: '#4361ee',
        willClose: () => (window.location.href = 'dashboard.html')
      });
    } catch (error) {
      const msg = {
        'auth/invalid-email': 'El formato del email no es válido',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'Email o contraseña incorrectos',
        'auth/wrong-password': 'Email o contraseña incorrectos'
      };
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: msg[error.code] || 'Ocurrió un error al iniciar sesión',
        confirmButtonColor: '#4361ee'
      });
    }
  });

  googleBtn?.addEventListener('click', async () => {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Has iniciado sesión como ${result.user.email}`,
        confirmButtonColor: '#4361ee',
        willClose: () => (window.location.href = 'dashboard.html')
      });
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Ocurrió un error al autenticar con Google',
        confirmButtonColor: '#4361ee'
      });
    }
  });

  // Redirección si ya está logueado
  auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.endsWith('login.html')) {
      window.location.href = 'dashboard.html';
    }
  });
});
