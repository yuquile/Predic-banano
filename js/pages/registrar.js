import { auth } from '../core/firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// --- DATOS CENTRALIZADOS ---
const features = [
  {
    id: 'feature-precision',
    title: 'Predicciones Precisas',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-svg"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    desc: 'Modelos de IA de alta precisión.'
  },
  {
    id: 'feature-analisis',
    title: 'Análisis Avanzado',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-svg"><polyline points="18 20 18 10 12 20 12 4 6 20 6 14"></polyline></svg>`,
    desc: 'Métricas detalladas de tu cultivo.'
  },
  {
    id: 'feature-tiempo',
    title: 'Datos en Tiempo Real',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    desc: 'Actualización instantánea.'
  },
  {
    id: 'feature-seguridad',
    title: 'Seguridad Total',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feature-svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
    desc: 'Tus datos siempre protegidos.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // --- RENDERIZADO DINÁMICO ---
  const renderFeatures = () => {
    const benefitsGrid = document.getElementById('benefits-grid');

    if (benefitsGrid) {
      features.forEach((feature, index) => {
        // Tarjetas panel derecho (grid de beneficios)
        const benefitHTML = `
          <div class="benefit">
            <div class="benefit-icon">${feature.icon}</div>
            <div class="benefit-text">${feature.title}</div>
          </div>
        `;
        benefitsGrid.insertAdjacentHTML('beforeend', benefitHTML);
      });
    }
  };

  renderFeatures();

  // --- LÓGICA DE FORMULARIO ---
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const registerBtn = document.getElementById("registerBtn");
  const togglePasswordBtn = document.getElementById("togglePassword");

  // Toggle Password
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Cambiar SVG (Ojo abierto / cerrado)
      if (type === 'text') {
        togglePasswordBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        togglePasswordBtn.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        togglePasswordBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        togglePasswordBtn.setAttribute('aria-label', 'Mostrar contraseña');
      }
    });
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    if (registerBtn) {
      registerBtn.disabled = !(isEmailValid && isPasswordValid);
    }
    return isEmailValid && isPasswordValid;
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      registerBtn.classList.add('loading');
      registerBtn.disabled = true;
    } else {
      registerBtn.classList.remove('loading');
      validateForm();
    }
  }

  if (emailInput) emailInput.addEventListener('input', validateForm);
  if (passwordInput) passwordInput.addEventListener('input', validateForm);

  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!validateForm()) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos correctamente.',
          confirmButtonColor: 'var(--verde-oscuro)'
        });
        return;
      }

      setLoadingState(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada exitosamente! 🎉',
          html: `
            <div style="text-align: center; padding: 1rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🍌</div>
              <p style="margin-bottom: 1rem;">¡Bienvenido a BananoSys!</p>
              <p style="color: #666; font-size: 0.9rem;">Tu cuenta ha sido creada. Ahora puedes iniciar sesión.</p>
            </div>
          `,
          confirmButtonText: 'Ir al Login',
          confirmButtonColor: 'var(--verde-oscuro)',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          window.location.href = "login.html";
        });

      } catch (error) {
        setLoadingState(false);
        let errorMessage = 'Error al crear la cuenta';

        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Este correo ya está registrado';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Correo inválido';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: errorMessage,
          confirmButtonColor: 'var(--verde-oscuro)'
        });
      }
    });
  }

  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && registerBtn && !registerBtn.disabled) {
      registerBtn.click();
    }
  });

  validateForm();
});
