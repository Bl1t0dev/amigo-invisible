// ===============================================
// 1. CONFIGURACIÓN DEL SORTEO
// ===============================================

// 🚨 PEGA AQUÍ LA CADENA JSON QUE COPIASTE EN EL PASO 1.
// NOTA: Debe ser una cadena de texto (rodeada de comillas simples ' o dobles ").
const SORTEO_DEFINITIVO_JSON = '{"FHA9DL":{"giver":"Mamen","recipient":"Marta"},"1ULH01":{"giver":"Luis","recipient":"Adri"},"Y0VY6W":{"giver":"Leles","recipient":"Javi"},"MJQU48":{"giver":"Pablo","recipient":"Sara"},"TF4KLW":{"giver":"Carlos","recipient":"Bastian"},"NOQZWN":{"giver":"Paloma","recipient":"Nano"},"ATM9UD":{"giver":"Andrea","recipient":"Paloma"},"5QFPHM":{"giver":"Alika","recipient":"Luis"},"AA1C1N":{"giver":"Nano","recipient":"Chuchi"},"G9F36B":{"giver":"Bea","recipient":"Pablo"},"ND5GK7":{"giver":"Bastian","recipient":"Blanca"},"PY1J3P":{"giver":"Foni","recipient":"Bea"},"TF2XK7":{"giver":"Nuria","recipient":"Jesus"},"Y87IPK":{"giver":"Sara","recipient":"Nuria"},"LO75IZ":{"giver":"Javi","recipient":"Leles"},"T86QPF":{"giver":"Maria","recipient":"Carlos"},"UZQ4U1":{"giver":"Marta","recipient":"Mamen"},"OC4IQY":{"giver":"Adri","recipient":"Foni"},"4ADH88":{"giver":"Chuchi","recipient":"Maria"},"962PBO":{"giver":"Jesus","recipient":"Andrea"},"45DUFF":{"giver":"Blanca","recipient":"Alika"}}'
// Ejemplo: Tu código copiado reemplaza este JSON de ejemplo. Asegúrate de que está entre comillas.

// 🚨 LISTA COMPLETA DE PARTICIPANTES (SÓLO NOMBRES)
const participantes = [
    "Mamen",
    "Luis",
    "Leles",
    "Pablo",
    "Carlos",
    "Paloma",
    "Andrea",
    "Alika",
    "Nano",
    "Bea",
    "Bastian",
    "Foni",
    "Nuria",
    "Sara",
    "Javi",
    "Maria",
    "Marta",
    "Adri",
    "Chuchi",
    "Jesus",
    "Blanca"
];

// RESTRICCIONES: Usa SÓLO los nombres limpios (sin códigos).
// Formato: ["QUIEN REGALA", "A QUIEN NO PUEDE REGALAR"]
const restricciones = [
    ["Mamen", "Maria"], 
    ["Luis", "Leles"],
    ["Luis", "Pablo"],
    ["Luis", "Carlos"],
    ["Leles", "Luis"],
    ["Leles", "Pablo"],
    ["Leles", "Carlos"],
    ["Pablo", "Luis"],
    ["Pablo", "Leles"],
    ["Pablo", "Carlos"],
    ["Carlos", "Luis"],
    ["Carlos", "Leles"],
    ["Carlos", "Pablo"],
    ["Paloma", ""],
    ["Andrea", "Alika"],
    ["Alika", "Andrea"],
    ["Nano", "Bea"],
    ["Nano", "Bastian"],
    ["Bea", "Nano"],
    ["Bea", "Bastian"],
    ["Bastian", "Nano"],
    ["Bastian", "Bea"],
    ["Foni", "Nuria"],
    ["Nuria", "Foni"],
    ["Sara", "Javi"],
    ["Javi", "Sara"],
    ["Maria", "Marta"],
    ["Maria", "Mamen"],
    ["Marta", "Maria"],
    ["Adri", ""],
    ["Chuchi", ""],
    ["Jesus", "Blanca"],
    ["Blanca", "Jesus"],
   // ¡Añade tus restricciones aquí!
];

// Datos globales para el sorteo
let datosOrganizador = {}; // Almacenará { "CÓDIGO": { giver: 'Nombre', recipient: 'Destinatario' } }

// ===============================================
// 2. LÓGICA DE FUNCIONAMIENTO Y SEGURIDAD
// ===============================================

/**
 * Genera una clave alfanumérica de 6 caracteres (letras mayúsculas y números).
 */
function generarClaveSeisCaracteres() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    const longitudCaracteres = caracteres.length;
    for (let i = 0; i < 6; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * longitudCaracteres));
    }
    return resultado;
}

/**
 * Normaliza el texto (minúsculas, sin espacios extra).
 */
function normalizar(nombre) {
    return nombre.trim().toLowerCase();
}

/**
 * Comprueba si una asignación [regalador, receptor] es válida.
 */
function esValido(regalador, receptor) {
    const regaladorNorm = normalizar(regalador);
    const receptorNorm = normalizar(receptor);

    // Regla 1: Nadie puede regalarse a sí mismo
    if (regaladorNorm === receptorNorm) return false;

    // Regla 2: Revisar las restricciones manuales
    const estaProhibido = restricciones.some(par => {
        const regaladorRestringido = normalizar(par[0]);
        const receptorRestringido = normalizar(par[1]);
        return regaladorRestringido === regaladorNorm && receptorRestringido === receptorNorm;
    });

    return !estaProhibido;
}

/**
 * Algoritmo recursivo que busca una solución válida (Backtracking).
 */
function resolverSorteo(indiceRegalador, receptoresDisponibles, asignacionesTemporales) {
    if (indiceRegalador === participantes.length) {
        return true; // Éxito, todos han sido asignados
    }

    const regaladorActual = participantes[indiceRegalador];
    const regaladorActualNorm = normalizar(regaladorActual);

    for (let i = 0; i < receptoresDisponibles.length; i++) {
        const receptorPotencial = receptoresDisponibles[i];

        if (esValido(regaladorActual, receptorPotencial)) {
            
            asignacionesTemporales[regaladorActualNorm] = receptorPotencial; 
            
            const proximosReceptoresDisponibles = receptoresDisponibles.filter((_, idx) => idx !== i);

            if (resolverSorteo(indiceRegalador + 1, proximosReceptoresDisponibles, asignacionesTemporales)) {
                return true; // Si el siguiente paso funciona, devolvemos éxito
            }

            delete asignacionesTemporales[regaladorActualNorm]; // Backtracking: deshacemos la asignación
        }
    }

    return false; // No se encontró una solución para este regalador en este camino
}

/**
 * Muestra la tabla secreta en la consola para el organizador.
 */
function mostrarDatosOrganizador() {
    console.log("========================================================");
    console.log("🔒 DATOS SECRETOS DEL SORTEO (PARA EL ORGANIZADOR) 🔒");
    console.log("========================================================");
    console.table(Object.entries(datosOrganizador).map(([codigo, datos]) => ({
        "Código Secreto": codigo,
        "Participante": datos.giver,
        "Regala a": datos.recipient
    })));
    console.log("INSTRUCCIONES: Copia esta tabla y distribuye el 'Código Secreto' a cada 'Participante'.");
    console.log("El formato de acceso en la web es: Nombre Código (Ejemplo: Mamen N7B4X2)");
    console.log("========================================================");
}

/**
 * Función principal: Ejecuta el sorteo, genera los códigos y muestra los datos.
 */
function ejecutarSorteo() {
    console.log("Iniciando sorteo con códigos aleatorios...");
    let asignacionesTemporales = {};
    datosOrganizador = {};

    let receptoresBarajados = [...participantes];
    // Barajar los receptores para aleatorizar el resultado
    for (let i = receptoresBarajados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [receptoresBarajados[i], receptoresBarajados[j]] = [receptoresBarajados[j], receptoresBarajados[i]];
    }

    const exito = resolverSorteo(0, receptoresBarajados, asignacionesTemporales);

    if (exito) {
        // Generar códigos únicos para la estructura final
        Object.keys(asignacionesTemporales).forEach(regaladorNorm => {
            let clave = generarClaveSeisCaracteres();
            
            // Asegurar que la clave sea única
            while (datosOrganizador.hasOwnProperty(clave)) {
                 clave = generarClaveSeisCaracteres();
            }

            const regaladorOriginal = participantes.find(p => normalizar(p) === regaladorNorm); 

            datosOrganizador[clave] = {
                giver: regaladorOriginal,
                recipient: asignacionesTemporales[regaladorNorm],
            };
        });
        
        mostrarDatosOrganizador();
    } else {
        console.error("ERROR CRÍTICO: Las restricciones impiden una solución matemática.");
        alert("¡Atención! Las restricciones son matemáticamente imposibles de resolver. Por favor, elimina alguna restricción.");
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
    // confetti es la función global de la librería
    if (typeof confetti === 'function') {
        confetti({ ...base, particleCount: 50, angle: 60, colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'] });
        confetti({ ...base, particleCount: 50, angle: 120, colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'] });
    }
}


// Ejecutar sorteo al cargar la página
ejecutarSorteo();

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    resultArea.classList.add('hidden');
    messageArea.textContent = '';
    
    const entradaCompleta = nameInput.value.trim();
    // Dividir la entrada por espacios
    const partes = entradaCompleta.split(/\s+/); 
    
    // Comprobar si hay nombre y código
    if (partes.length < 2) {
        messageArea.textContent = `Formato incorrecto. Debe ser: TU NOMBRE y luego el CÓDIGO (separados por un espacio).`;
        return;
    }
    
    // 1. Separar y normalizar
    const codigoEntrada = partes.pop().trim().toUpperCase(); // La última parte es el código
    const nombreEntradaNorm = partes.join(' ').trim().toLowerCase(); // La resta es el nombre (normalizado)
    
    // 2. Buscar el código en la base de datos segura
    if (datosOrganizador.hasOwnProperty(codigoEntrada)) {
        const asignacion = datosOrganizador[codigoEntrada];
        const nombreAsignadoNorm = normalizar(asignacion.giver); 
        
        // 3. Verificar que el nombre introducido coincida con el nombre asociado al código
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
