// ===============================================
// 1. PARTICIPANTES (¡MODIFICA ESTA LISTA!)
// Los nombres deben ser exactamente los que se introducirán en la web.
// ===============================================
const participants = [
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
    "Blanca",
    // ¡Añade todos los participantes aquí!
];

// ===============================================
// 2. RESTRICCIONES (¡MODIFICA ESTA LISTA!)
// Define las parejas [REGALADOR, RECEPTOR] que NO pueden ser asignadas.
// Ambos nombres deben coincidir *exactamente* con la lista de 'participants'.
// Ejemplo: ["María", "Juan"] significa que María NO puede regalar a Juan.
// ===============================================
const restrictions = [
    // Ejemplo de una pareja mutua:
    ["Mamen", "Maria"], 
    ["Luis", "Leles, Pablo, Carlos"], 
    ["Leles", "Luis, Pablo, Carlos"],
    ["Pablo", "Luis, Leles, Carlos"],
    ["Carlos", "Luis, Leles, Pablo"],
    ["Paloma", ""],
    ["Andrea", "Alika"],
    ["Alika", "Andrea"],
    ["Nano", "Bea, Bastian"],
    ["Bea", "Nano, Bastian"],
    ["Bastian", "Nano, Bea"],
    ["Foni", "Nuria"],
    ["Nuria", "Foni"],
    ["Sara", "Javi"],
    ["Javi", "Sara"],
    ["Maria", "Marta, Mamen"],
    ["Marta", "Maria"],
    ["Adri", ""],
    ["Chuchi", ""],
    ["Jesus", "Blanca"],
    ["Blanca", "Jesus"],
        
    // Ejemplo de otra restricción:
    // ["Luis", "Ana"],
];

// Mapeamos las restricciones a minúsculas para facilitar la comprobación
const normalizedRestrictions = restrictions.map(pair => 
    [pair[0].toLowerCase(), pair[1].toLowerCase()]
);

// 3. Lógica del Sorteo y Emparejamiento
let assignments = {};

/**
 * Verifica si una asignación [regalador, receptor] está prohibida.
 * @param {string} giver - Nombre del regalador (en minúsculas).
 * @param {string} receiver - Nombre del receptor (en minúsculas).
 * @returns {boolean} - True si la asignación está restringida, false en caso contrario.
 */
function isRestricted(giver, receiver) {
    // 1. Regla obligatoria: Nadie puede regalarse a sí mismo
    if (giver === receiver) {
        return true;
    }
    // 2. Comprobar restricciones personalizadas
    return normalizedRestrictions.some(([rGiver, rReceiver]) => 
        rGiver === giver && rReceiver === receiver
    );
}

/**
 * Función para realizar el sorteo de forma segura, respetando todas las restricciones.
 */
function runDraw() {
    let success = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 1000; // Intentamos 1000 veces antes de fallar

    // El bucle 'while' asegura que si la asignación falla, se reintenta con otro orden
    while (!success && attempts < MAX_ATTEMPTS) {
        attempts++;
        
        // Usamos una copia en minúsculas para la lógica interna
        const givers = [...participants].map(p => p.toLowerCase());
        let receivers = [...participants];
        
        // Barajamos la lista de receptores (algoritmo Fisher-Yates)
        for (let i = receivers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
        }
        
        success = true; // Asumimos éxito al inicio
        let tempReceivers = [...receivers]; 
        let tempAssignments = {};

        // 1. Asignamos a cada regalador
        for (let i = 0; i < givers.length; i++) {
            const giver = givers[i];
            let assigned = false;

            // 2. Buscamos el primer receptor válido y disponible
            for (let j = 0; j < tempReceivers.length; j++) {
                const receiver = tempReceivers[j];
                
                // Si la asignación NO rompe ninguna restricción
                if (!isRestricted(giver, receiver.toLowerCase())) {
                    tempAssignments[giver] = receiver;
                    tempReceivers.splice(j, 1); // Removemos al receptor de la lista de disponibles
                    assigned = true;
                    break;
                }
            }
            
            // Si no se pudo asignar al regalador actual
            if (!assigned) {
                success = false; // El intento falla
                break; 
            }
        }
        
        if (success) {
            assignments = tempAssignments; // Guardamos el resultado exitoso
        }
    }

    if (attempts >= MAX_ATTEMPTS) {
        // Esto indica que las restricciones hacen imposible el sorteo
        console.error("ERROR CRÍTICO: No se pudo realizar el sorteo. ¡Las restricciones impiden una combinación válida!");
        assignments = {}; // Asegurar que no haya asignaciones parciales
    }

    console.log(`Sorteo realizado en ${attempts} intentos.`);
}

// ===============================================
// 4. Manejo de la Interfaz y Eventos
// ===============================================
const form = document.getElementById('draw-form');
const nameInput = document.getElementById('name-input');
const resultArea = document.getElementById('result-area');
const messageArea = document.getElementById('message-area');
const yourNameDisplay = document.getElementById('your-name');
const recipientNameDisplay = document.getElementById('recipient-name-display');


// Ejecutar el sorteo la primera vez que se carga la página
runDraw();

// Evento al enviar el formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Limpiar mensajes y resultados anteriores
    resultArea.classList.add('hidden');
    messageArea.textContent = '';
    
    const submittedName = nameInput.value.trim();
    // Normalizamos la entrada a minúsculas para buscar en 'assignments'
    const normalizedName = submittedName.toLowerCase();

    // 1. Comprobar si el nombre existe en el sorteo
    if (assignments.hasOwnProperty(normalizedName)) {
        
        const recipient = assignments[normalizedName];

        // Mostrar el resultado en el HTML
        yourNameDisplay.textContent = submittedName; 
        recipientNameDisplay.textContent = recipient;
        resultArea.classList.remove('hidden');
        nameInput.value = ''; // Limpiar input después de mostrar

    } else {
        // Mostrar error si el nombre no está en la lista o si hubo un error crítico
        let message = `El nombre "${submittedName}" no está en la lista. Revisa la ortografía.`;
        
        if (Object.keys(assignments).length === 0) {
            message = "¡Error en el sorteo! El organizador debe revisar las restricciones, son demasiado limitantes.";
        }
        
        messageArea.textContent = message;
    }
});