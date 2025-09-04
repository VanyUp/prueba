// ============ Mapeo de spans de error por id de input ============
const errorSpanId = {
    name: 'nameError',
    surname: 'surnameError',
    email: 'emailError',
    password: 'passwordError',
    confirmPassword: 'confirmPasswordError',
    birthdate: 'birthdateError',
    celular: 'phoneError',
    tel: 'telError',
    terminos: 'termsError'
};






// ============ Utilidades de UI ============
function setError(htmlId, msg) {
    const input = document.getElementById(htmlId);
    const spanId = errorSpanId[htmlId];
    const span = spanId ? document.getElementById(spanId) : null;

    // No se pinta checkbox con borde rojo/verde
    if (input && input.type !== 'checkbox') {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
    if (span) span.textContent = msg || '';
}

function clearError(htmlId) {
    const input = document.getElementById(htmlId);
    const spanId = errorSpanId[htmlId];
    const span = spanId ? document.getElementById(spanId) : null;

    if (input && input.type !== 'checkbox') {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    if (span) span.textContent = '';
}



function resetFieldState(htmlId) {
    const input = document.getElementById(htmlId);
    const spanId = errorSpanId[htmlId];
    const span = spanId ? document.getElementById(spanId) : null;

    if (input && input.type !== 'checkbox') {
        input.classList.remove('is-invalid', 'is-valid');
    }
    if (span) span.textContent = '';
}

function setOk(htmlId, msg) {
    const input = document.getElementById(htmlId);
    const spanId = errorSpanId[htmlId];
    const span = spanId ? document.getElementById(spanId) : null;

    if (input && input.type !== 'checkbox') {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    if (span) {
        span.classList.remove('err');
        span.classList.add('ok');
        span.textContent = msg || '';
    }
}

function validatePasswords() {
    const pass = document.getElementById('password').value;
    const conf = document.getElementById('confirmPassword').value;

    // No muestres nada mientras el usuario no haya escrito en "confirmar"
    if (conf.length === 0) {
        resetFieldState('confirmPassword');
        return;
    }

    if (conf !== pass) {
        setError('confirmPassword', 'Las contraseñas no coinciden.');
    } else {
        setOk('confirmPassword', 'Coinciden ✅');
    }
}


// ============ Reglas de validación ============
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isCellCO = (v) => /^3\d{9}$/.test(v);     // Celular CO: 3 + 9 dígitos = 10 total
const isPhone = (v) => v === '' || /^\d{7,}$/.test(v); // opcional; si viene, >=7 dígitos

function isAdult(yyyyMmDd) {
    const birth = new Date(yyyyMmDd);
    if (Number.isNaN(birth.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18;
}

const passEl = document.getElementById('password');
const confEl = document.getElementById('confirmPassword');
if (passEl) passEl.addEventListener('input', validatePasswords);
if (confEl) confEl.addEventListener('input', validatePasswords);

if (confirmPassword !== password) {
    setError('confirmPassword', 'Las contraseñas no coinciden.');
    ok = false;
} else {
    setOk('confirmPassword', 'Coinciden ✅');
}

// ---- Mostrar/ocultar contraseña con el ojito ----
document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈'; // cambia el ícono al mostrar
        } else {
            input.type = 'password';
            btn.textContent = '👁️'; // vuelve al ícono original
        }
    });
});




// ============ Lógica principal ============
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const success = document.getElementById('form-success');

    // Limpia estado al escribir / perder foco
    ['name', 'surname', 'email', 'password', 'confirmPassword', 'birthdate', 'celular', 'tel', 'terminos']
        .forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const handler = () => resetFieldState(id);
            el.addEventListener('input', handler);
            el.addEventListener('blur', handler);
            if (el.type === 'checkbox') {
                el.addEventListener('change', handler);
            }
        });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // evitamos envío hasta validar
        if (success) success.textContent = '';

        // Tomamos valores
        const name = document.getElementById('name').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const birthdate = document.getElementById('birthdate').value;
        const celular = document.getElementById('celular').value.trim();
        const tel = document.getElementById('tel').value.trim();
        const terminos = document.getElementById('terminos').checked;

        let ok = true;

        // Validaciones
        if (name.length < 4) { setError('name', 'Mínimo 4 caracteres.'); ok = false; } else clearError('name');
        if (surname.length < 4) { setError('surname', 'Mínimo 4 caracteres.'); ok = false; } else clearError('surname');

        if (!isEmail(email)) { setError('email', 'Correo no válido.'); ok = false; } else clearError('email');

        if (password.length < 8) { setError('password', 'Mínimo 8 caracteres.'); ok = false; } else clearError('password');

        if (confirmPassword !== password) { setError('confirmPassword', 'Las contraseñas no coinciden.'); ok = false; }
        else clearError('confirmPassword');

        if (!isAdult(birthdate)) { setError('birthdate', 'Debes ser mayor de 18 años.'); ok = false; }
        else clearError('birthdate');

        if (!isCellCO(celular)) { setError('celular', 'Debe iniciar por 3 y tener 10 dígitos.'); ok = false; }
        else clearError('celular');

        if (!isPhone(tel)) { setError('tel', 'Solo dígitos, mínimo 7 (o déjalo vacío).'); ok = false; }
        else clearError('tel');

        if (!terminos) { setError('terminos', 'Debes aceptar los términos.'); ok = false; }
        else clearError('terminos');

        // Resultado
        if (!ok) return;

        if (success) success.textContent = '✅ Registro enviado correctamente.';
        form.reset();

        // Limpia estados visuales tras reset
        ['name', 'surname', 'email', 'password', 'confirmPassword', 'birthdate', 'celular', 'tel', 'terminos']
            .forEach(resetFieldState);
    });
});
