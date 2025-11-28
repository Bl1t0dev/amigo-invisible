// ===============================================
// 1. CONFIGURACIÓN DEL SORTEO FIJO
// ===============================================

// 🚨 RESULTADO DEL SORTEO BLOQUEADO. ¡NO CAMBIA NUNCA!
const SORTEO_DEFINITIVO_JSON = '{"FHA9DL":{"giver":"Mamen","recipient":"Marta"},"1ULH01":{"giver":"Luis","recipient":"Adri"},"Y0VY6W":{"giver":"Leles","recipient":"Javi"},"MJQU48":{"giver":"Pablo","recipient":"Sara"},"TF4KLW":{"giver":"Carlos","recipient":"Bastian"},"NOQZWN":{"giver":"Paloma","recipient":"Nano"},"ATM9UD":{"giver":"Andrea","recipient":"Paloma"},"5QFPHM":{"giver":"Alika","recipient":"Luis"},"AA1C1N":{"giver":"Nano","recipient":"Chuchi"},"G9F36B":{"giver":"Bea","recipient":"Pablo"},"ND5GK7":{"giver":"Bastian","recipient":"Blanca"},"PY1J3P":{"giver":"Foni","recipient":"Bea"},"TF2XK7":{"giver":"Nuria","recipient":"Jesus"},"Y87IPK":{"giver":"Sara","recipient":"Nuria"},"LO75IZ":{"giver":"Javi","recipient":"Leles"},"T86QPF":{"giver":"Maria","recipient":"Carlos"},"UZQ4U1":{"giver":"Marta","recipient":"Mamen"},"OC4IQY":{"giver":"Adri","recipient":"Foni"},"4ADH88":{"giver":"Chuchi","recipient":"Maria"},"962PBO":{"giver":"Jesus","recipient":"Andrea"},"45DUFF":{"giver":"Blanca","recipient":"Alika"}}';

// LISTA DE PARTICIPANTES (Solo para normalizar y mostrar)
const participantes = [
    "Mamen", "Luis", "Leles", "Pablo", "Carlos", "Paloma", "Andrea", "Alika", "Nano", "Bea",
    "Bastian", "Foni", "Nuria", "Sara", "Javi", "Maria", "Marta", "Adri", "Chuchi", "Jesus", "Blanca"
];

// Las restricciones ya no se usan en el código, pero es útil dejarlas como comentario
// const restricciones = [ /* ... */ ]; 

// Los datos del sorteo se cargarán aquí al inicio.
let datosOrganizador = {}; 

// ===============================================
// 2. LÓGICA DE CARGA Y UTILIDAD
// ===============================================

/**
 * Normaliza el texto (minúsculas, sin espacios extra).
 */
function normalizar(nombre) {
    return nombre.trim().toLowerCase();
}

/**
 * Muestra la tabla secreta en la consola para el organizador.
 */
function mostrarDatosOrganizador() {
    console.log("========================================================");
    console.log("🎉 SORTEO BLOQUEADO Y LISTO 🎉");
    console.log("========================================================");
    console.table(Object.entries(datosOrganizador).map(([codigo, datos]) => ({
        "Código Secreto": codigo,
        "Participante": datos.giver,
        "Regala a": datos.recipient
    })));
    console.log("INSTRUCCIONES: Distribuye el 'Código Secreto' junto al nombre.");
    console.log("Formato de acceso en la web: Nombre Código (Ejemplo: Mamen FHA9DL)");
    console.log("========================================================");
}

/**
 * Función principal: Solo carga el resultado fijo.
 */
function ejecutarSorteo() {
    
    if (SORTEO_DEFINITIVO_JSON) {
        try {
            // Convierte la cadena de texto JSON en un objeto JavaScript
            datosOrganizador = JSON.parse(SORTEO_DEFINITIVO_JSON);
            console.log("Sorteo cargado correctamente desde el resultado fijo.");
            mostrarDatosOrganizador(); 
            return;
        } catch (e) {
            console.error("ERROR CRÍTICO: El formato JSON es incorrecto. El sorteo no se pudo cargar.", e);
            alert("Error interno: El sorteo fijo no se pudo cargar. Revisa el JSON.");
        }
    } else {
        console.error("ERROR: No se encontró la cadena SORTEO_DEFINITIVO_JSON.");
        alert("Error interno: No hay datos de sorteo definidos.");
    }
}

// ===============================================
// 3. INTERFÍCIE (DOM)
// ===============================================

const form = document.getElementById('draw-form');
const nameInput = document.getElementById('name-input');
const resultArea = document.getElementById('result-area');
const messageArea = document.getElementById('message-area');
const yourNameDisplay = document.getElementById('your-name');
const recipientNameDisplay = document.getElementById('recipient-name-display');

// Implementación de Confeti (asegúrate de incluir el CDN en index.html)
function launchConfetti() {
    const base = {
        origin: { y: 0.7 },
        angle: 60,
        spread: 55,
        ticks: 150,
        startVelocity: 30
    };
    if (typeof confetti === 'function') {
        confetti({ ...base, particleCount: 50, angle: 60, colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'] });
        confetti({ ...base, particleCount: 50, angle: 120, colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'] });
    }
}


// Ejecutar sorteo al cargar la página (solo carga el fijo)
ejecutarSorteo();

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    resultArea.classList.add('hidden');
    messageArea.textContent = '';
    
    const entradaCompleta = nameInput.value.trim();
    const partes = entradaCompleta.split(/\s+/); 
    
    if (partes.length < 2) {
        messageArea.textContent = `Formato incorrecto. Debe ser: TU NOMBRE y luego el CÓDIGO (separados por un espacio).`;
        return;
    }
    
    const codigoEntrada = partes.pop().trim().toUpperCase(); 
    const nombreEntradaNorm = partes.join(' ').trim().toLowerCase(); 
    
    // 1. Buscar el código
    if (datosOrganizador.hasOwnProperty(codigoEntrada)) {
        const asignacion = datosOrganizador[codigoEntrada];
        const nombreAsignadoNorm = normalizar(asignacion.giver); 
        
        // 2. Verificar que el nombre coincida
        if (nombreEntradaNorm === nombreAsignadoNorm) {
            
            yourNameDisplay.textContent = asignacion.giver; 
            recipientNameDisplay.textContent = asignacion.recipient;
            resultArea.classList.remove('hidden');
            
            // Lanzar confeti (si la librería está cargada)
            launchConfetti();
            
            nameInput.value = ''; 
        } else {
            messageArea.textContent = `El nombre que has introducido no coincide con el código secreto.`;
        }
    } else {
        messageArea.textContent = `Código secreto incorrecto o no encontrado.`;
    }
});
