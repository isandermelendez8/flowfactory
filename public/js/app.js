// Flow Factory RP - Panel de Whitelist
// By Burlau Development

// Estado global
let currentUser = null;
let quizState = {
    currentQuestion: 1,
    answers: {},
    startTime: null,
    timerInterval: null
};

// 53 Normativas del servidor
const rulesData = [
    { id: 1, category: "Conceptos Básicos", title: "IC vs OOC", description: "IC (In Character) es todo lo que tu personaje vive dentro del rol. OOC (Out of Character) es todo lo externo al personaje. Nunca mezcles ambos." },
    { id: 2, category: "Conceptos Básicos", title: "Power Gaming (PG)", description: "Realizar acciones imposibles en la vida real o que no dan tiempo de reacción a otros jugadores. Ej: /me rompe el cuello al policía sin dar chance de reaccionar." },
    { id: 3, category: "Conceptos Básicos", title: "Meta Gaming (MG)", description: "Usar información obtenida fuera del juego (Discord, streams, WhatsApp) dentro del personaje. Sanción: 400 comunitarias." },
    { id: 4, category: "Conceptos Básicos", title: "Fail RP", description: "Acciones que rompen la inmersión del rol o no corresponden al personaje. Mantén siempre el personaje consistente." },
    { id: 5, category: "Conceptos Básicos", title: "VDM - Vehicle Deathmatch", description: "Usar vehículos como arma para atropellar intencionalmente sin motivo de rol. Prohibido excepto en persecuciones con rol previo." },
    { id: 6, category: "Conceptos Básicos", title: "RDM - Random Deathmatch", description: "Atacar o matar sin razón de rol válida. Siempre debe haber interacción previa y motivación clara. Sanción: 300-350 comunitarias." },
    { id: 7, category: "Conceptos Básicos", title: "Revenge Kill (RK)", description: "Volver a matar por venganza tras haber muerto. Después de PK/CK olvidas el conflicto. Sanción: 150-350 comunitarias." },
    { id: 8, category: "Conceptos Básicos", title: "Fear Roleplay (FRP)", description: "Debes valorar tu vida en todo momento. Si te apuntan, levanta las manos y coopera. Sanción: 500 comunitarias." },
    { id: 9, category: "Conceptos Básicos", title: "No Rape Roleplay", description: "Prohibido el roleplay de violación/abuso sexual completamente. Reportar acoso es prioridad." },
    { id: 10, category: "Conceptos Básicos", title: "Anti-Cheat / Anti-AFK", description: "No uses programas de terceros, macros, AFK farm, etc. Cada fase de whitelist detecta mejor los alts." },
    { id: 11, category: "Zonas Seguras", title: "Zonas Safe - Hospital", description: "El hospital es zona segura. No se permite robar, secuestrar ni iniciar acciones delictivas." },
    { id: 12, category: "Zonas Seguras", title: "Zonas Safe - Comisaría", description: "La comisaría es zona segura. Neutralidad absoluta. Sanción: 150-850 comunitarias según infracción." },
    { id: 13, category: "Zonas Seguras", title: "Zonas Safe - Talleres", description: "Los talleres mecánicos son zonas seguras. Prohibida cualquier violencia o rol agresivo." },
    { id: 14, category: "Zonas Seguras", title: "Zonas Safe - Negocios", description: "Tiendas de ropa, restaurantes y negocios de comida son zonas seguras." },
    { id: 15, category: "Zonas Seguras", title: "Zonas de Spawn", description: "Respetar las zonas de spawn de nuevos jugadores. No acosar ni aprovecharse de ellos." },
    { id: 16, category: "Sistema de Muerte", title: "Fase 1: Herido", description: "Puedes arrastrarte, hablar, usar radio. $300 para ir con María. NO eres invisible." },
    { id: 17, category: "Sistema de Muerte", title: "Fase 2: Desangrándose", description: "Puedes hablar pero NO radio, NO llamadas. Si te vas = PK. /alert EMS para llamar ayuda." },
    { id: 18, category: "Sistema de Muerte", title: "Fase 3: Inconsciente", description: "Sin comunicación. 100% PK si EMS llega. No recordar nada de la escena." },
    { id: 19, category: "Sistema de Muerte", title: "NLR - New Life Rule", description: "Al morir, olvidas los eventos que llevaron a tu muerte. No regresar a la zona durante 15 minutos." },
    { id: 20, category: "Sistema de Muerte", title: "Valorar la vida", description: "Debes valorar la vida de tu personaje como si fuera real. No arriesgarte innecesariamente." },
    { id: 21, category: "Normas Policiales", title: "Corrupción Policial", description: "Totalmente prohibida sin aprobación de administración. Sanción grave + posible blacklist." },
    { id: 22, category: "Normas Policiales", title: "Vehículos Policiales", description: "Prohibido usar vehículos personales en servicio. Usar solo vehículos asignados." },
    { id: 23, category: "Normas Policiales", title: "Negociaciones", description: "Una vez aceptados términos, deben respetarse. No engañar a civiles/criminales después de negociar." },
    { id: 24, category: "Normas Policiales", title: "Grabación Obligatoria", description: "Obligatorio grabar al iniciar servicio. Sin video no hay pruebas para reportes." },
    { id: 25, category: "Normas Policiales", title: "Uso de fuerza", description: "Usar fuerza proporcional a la amenaza. No abuso de autoridad. Prioridad: preservar vidas." },
    { id: 26, category: "Normas EMS", title: "Rol Profesional EMS", description: "Serio, realista, sin actuar de forma troll. Los EMS son servicio de emergencia, no Uber." },
    { id: 27, category: "Normas EMS", title: "Neutralidad EMS", description: "Rol completamente neutral. No tomar partido en conflictos. Atender a todos por igual." },
    { id: 28, category: "Normas EMS", title: "Venta de Items EMS", description: "PROHIBIDA la venta de banditas y medkits. Solo para uso propio o emergencias médicas." },
    { id: 29, category: "Normas EMS", title: "Zonas Activas - EMS", description: "Esperar autorización policial para entrar a zonas activas de tiroteo/crimen." },
    { id: 30, category: "Normas EMS", title: "Prioridad de Vida", description: "La vida del paciente es prioridad. No dejar morir intencionalmente a nadie." },
    { id: 31, category: "Gangas", title: "Aprobación de Gangas", description: "Toda ganga debe ser aprobada por administración. Sin aprobación = ganga ilegal = sanción." },
    { id: 32, category: "Gangas", title: "Ataques entre Gangas", description: "Debe existir motivo IC previo. No ataques sin rol previo. Respetar reglas de guerra." },
    { id: 33, category: "Gangas", title: "Atracos y Robos", description: "Solo con policías en servicio. Mínimo 4 policías para atraco a banco." },
    { id: 34, category: "Gangas", title: "Responsable de Ganga", description: "El líder es responsable de toda la organización. Sus miembros violan normas = su responsabilidad." },
    { id: 35, category: "Gangas", title: "Zonas de Gangas", description: "Respetar territorios. Las guerras de territorio deben ser coordinadas con administración." },
    { id: 36, category: "Sanciones Graves", title: "Abuso de Bugs/Exploits", description: "BAN PERMANE sin excepciones. Reportar bugs reciben recompensa; abusarlos = expulsión." },
    { id: 37, category: "Sanciones Graves", title: "Multicuentas", description: "Expulsión permanente. Una persona = una cuenta. No compartir cuentas." },
    { id: 38, category: "Sanciones Graves", title: "F8/ALT+F4 en Rol", description: "700 comunitarias o 24h BAN. No salirse en medio de rol activo." },
    { id: 39, category: "Sanciones Graves", title: "Evasión de Rol", description: "+10 minutos AFK en rol activo = sanción según gravedad. Avisar si necesitas irte." },
    { id: 40, category: "Sanciones Graves", title: "Stream Sniping", description: "24h de BAN. Usar streams para obtener información ventaja = prohibido." },
    { id: 41, category: "Comercio y Economía", title: "Estafas OOC", description: "Prohibidas. Todo comercio debe ser IC y legítimo dentro del rol." },
    { id: 42, category: "Comercio y Economía", title: "Precios Imbalanceados", description: "No vender items a precios absurdos fuera del mercado establecido." },
    { id: 43, category: "Vehículos", title: "Conduscción Realista", description: "Conducir de forma realista. No conducción temeraria sin motivo de rol." },
    { id: 44, category: "Vehículos", title: "Vehículos Robados", description: "Reportar vehículos robados a policía. No quedarse con vehículos robados indefinidamente." },
    { id: 45, category: "Trabajos Legales", title: "Rol de Trabajo", description: "Cumplir con el rol de tu trabajo. Mineros, pescadores, etc. deben actuar según su profesión." },
    { id: 46, category: "Trabajos Legales", title: "Farmeo Ilegal", description: "No usar trabajos legales para farmear dinero de forma ilegal o exploit." },
    { id: 47, category: "Comunicación", title: "Uso del /me y /do", description: "Usar /me para acciones físicas. Usar /do para preguntas de rol. Responder siempre con /do." },
    { id: 48, category: "Comunicación", title: "Voz en Character", description: "Mantener voz IC consistente. No usar voice changers excesivos que rompan inmersión." },
    { id: 49, category: "Reportes", title: "Reportes Constructivos", description: "Reportar con evidencia clara. No reportes falsos o por venganza." },
    { id: 50, category: "Reportes", title: "Evidencia de Reportes", description: "Video o screenshot obligatorio para reportes graves. Sin evidencia no se puede actuar." },
    { id: 51, category: "Eventos", title: "Participación en Eventos", description: "Respetar reglas de eventos. No interrumpir eventos organizados sin ser invitado." },
    { id: 52, category: "Eventos", title: "Organización de Eventos", description: "Pedir permiso a administración para organizar eventos grandes." },
    { id: 53, category: "General", title: "Cumplimiento de Normas", description: "El no conocer las normas no exime de cumplirlas. Leer todas las normas antes de jugar." }
];

// 50 Preguntas del whitelist
const quizQuestions = [
    { id: 1, category: "Conceptos Básicos", question: "¿Qué significa IC?", options: ["In Character - Dentro del personaje", "International Communication", "Instant Chat", "In Community"], correct: 0 },
    { id: 2, category: "Conceptos Básicos", question: "¿Qué es el Power Gaming?", options: ["Jugar durante muchas horas", "Realizar acciones imposibles en la vida real", "Usar hacks", "Jugar con amigos"], correct: 1 },
    { id: 3, category: "Conceptos Básicos", question: "¿Qué es el Meta Gaming?", options: ["Usar información de Discord en el juego", "Jugar metódicamente", "Usar macros", "Jugar solo"], correct: 0 },
    { id: 4, category: "Conceptos Básicos", question: "¿Qué significa OOC?", options: ["Out of Character - Fuera del personaje", "Online Official Chat", "Out of Community", "Online Only Chat"], correct: 0 },
    { id: 5, category: "Conceptos Básicos", question: "¿Qué es el VDM?", options: ["Vehicle Deathmatch - usar vehículos como arma", "Very Dangerous Move", "Virtual Death Mode", "Voice Direct Message"], correct: 0 },
    { id: 6, category: "Conceptos Básicos", question: "¿Qué es el RDM?", options: ["Random Deathmatch - matar sin razón de rol", "Real Death Mode", "Rapid Damage Move", "Roleplay Death Match"], correct: 0 },
    { id: 7, category: "Conceptos Básicos", question: "¿Qué es el Fear Roleplay (FRP)?", options: ["Tener miedo a perder", "Valorar tu vida como si fuera real", "No tener miedo", "Rol de terror"], correct: 1 },
    { id: 8, category: "Conceptos Básicos", question: "¿Qué es el Revenge Kill?", options: ["Volver a matar por venganza tras morir", "Matar por defensa propia", "Matar enemigos", "Matar por dinero"], correct: 0 },
    { id: 9, category: "Conceptos Básicos", question: "¿Cuál es la sanción por Meta Gaming?", options: ["400 comunitarias", "200 comunitarias", "Ban permanente", "Advertencia verbal"], correct: 0 },
    { id: 10, category: "Conceptos Básicos", question: "¿Está permitido el roleplay de violación?", options: ["No, está prohibido completamente", "Sí, si ambos consienten", "Solo en zonas privadas", "Depende de la situación"], correct: 0 },
    { id: 11, category: "Zonas Seguras", question: "¿Qué es una zona segura?", options: ["Área sin PVP", "Hospital, comisaría, talleres", "Zona de spawn", "Todas las anteriores"], correct: 1 },
    { id: 12, category: "Zonas Seguras", question: "¿Puedes robar en el hospital?", options: ["No, es zona segura", "Sí, si no hay policías", "Sí, en la noche", "Solo si es emergencia"], correct: 0 },
    { id: 13, category: "Zonas Seguras", question: "¿Qué sanción por violar zona segura?", options: ["150-850 comunitarias", "Solo advertencia", "Ban de 1 día", "Ninguna"], correct: 0 },
    { id: 14, category: "Zonas Seguras", question: "¿Los talleres son zonas seguras?", options: ["Sí", "No", "Solo durante el día", "Depende del mecánico"], correct: 0 },
    { id: 15, category: "Zonas Seguras", question: "¿Qué pasa si secuestras en zona segura?", options: ["Sanción grave", "Nada", "Es válido", "Solo multa"], correct: 0 },
    { id: 16, category: "Sistema de Muerte", question: "¿Cuánto tiempo esperar para regresar tras morir?", options: ["15 minutos", "5 minutos", "10 minutos", "30 minutos"], correct: 0 },
    { id: 17, category: "Sistema de Muerte", question: "¿Qué es el NLR?", options: ["New Life Rule - olvidar eventos previos al morir", "No Loss Rule", "Next Level Roleplay", "Night Life Rule"], correct: 0 },
    { id: 18, category: "Sistema de Muerte", question: "En Fase 1 (Herido), ¿puedes usar radio?", options: ["Sí", "No", "Solo si eres policía", "Depende"], correct: 0 },
    { id: 19, category: "Sistema de Muerte", question: "En Fase 2 (Desangrándose), ¿qué NO puedes hacer?", options: ["Usar radio y llamadas", "Hablar", "Moverte", "Pedir ayuda"], correct: 0 },
    { id: 20, category: "Sistema de Muerte", question: "¿Cuánto cuesta ir con María en Fase 1?", options: ["$300", "$500", "$100", "Gratis"], correct: 0 },
    { id: 21, category: "Sistema de Muerte", question: "En Fase 3 (Inconsciente), ¿recuerdas algo?", options: ["No, 100% amnesia", "Sí, todo", "Solo algunas cosas", "Depende del EMS"], correct: 0 },
    { id: 22, category: "Sistema de Muerte", question: "¿Puedes usar /alert EMS en Fase 2?", options: ["Sí", "No", "Solo con radio", "Nunca"], correct: 0 },
    { id: 23, category: "Normas Policiales", title: "¿Está permitida la corrupción policial?", options: ["No, prohibida sin aprobación admin", "Sí, si es secreta", "Solo con jefes", "Depende del caso"], correct: 0 },
    { id: 24, category: "Normas Policiales", title: "¿Puedes usar vehículo personal de policía?", options: ["No, solo vehículos asignados", "Sí", "Solo en emergencias", "Si es tu propio coche"], correct: 0 },
    { id: 25, category: "Normas Policiales", title: "¿Qué pasa si aceptas términos de negociación?", options: ["Debes cumplirlos", "Puedes romperlos", "Es opcional", "Depende"], correct: 0 },
    { id: 26, category: "Normas Policiales", title: "¿Es obligatorio grabar en servicio?", options: ["Sí", "No", "Solo en noches", "Solo para reportes"], correct: 0 },
    { id: 27, category: "Normas Policiales", title: "¿Qué fuerza usar ante amenaza leve?", options: ["Proporcional a la amenaza", "Fuerza letal inmediata", "Ignorar", "Llamar refuerzos"], correct: 0 },
    { id: 28, category: "Normas EMS", title: "¿Pueden los EMS ser trolls?", options: ["No, rol serio y profesional", "Sí, a veces", "Solo en privado", "Depende del día"], correct: 0 },
    { id: 29, category: "Normas EMS", title: "¿Los EMS deben ser neutrales?", options: ["Sí, completamente", "No, pueden tomar partido", "Solo en guerras", "Depende del paciente"], correct: 0 },
    { id: 30, category: "Normas EMS", title: "¿Pueden vender banditas y medkits?", options: ["No, prohibido", "Sí", "Solo a policías", "Solo en emergencias"], correct: 0 },
    { id: 31, category: "Normas EMS", title: "¿Pueden entrar a zonas activas sin autorización?", options: ["No, esperar autorización policial", "Sí", "Solo si hay heridos", "Rápidamente"], correct: 0 },
    { id: 32, category: "Gangas", title: "¿Necesitan aprobación para crear ganga?", options: ["Sí, de administración", "No", "Solo si son más de 5", "Solo para territorios"], correct: 0 },
    { id: 33, category: "Gangas", title: "¿Puedes atacar sin motivo IC?", options: ["No, debe existir motivo", "Sí", "Solo en la noche", "Si eres más fuerte"], correct: 0 },
    { id: 34, category: "Gangas", title: "¿Cuántos policías mínimo para atraco a banco?", options: ["4 policías", "2 policías", "1 policía", "Ninguno"], correct: 0 },
    { id: 35, category: "Gangas", title: "¿Quién es responsable de los miembros?", options: ["El líder", "Cada uno", "Los admins", "Nadie"], correct: 0 },
    { id: 36, category: "Sanciones Graves", title: "¿Qué pasa si abusas bugs?", options: ["BAN permanente", "Advertencia", "1 día de ban", "Multa"], correct: 0 },
    { id: 37, category: "Sanciones Graves", title: "¿Están permitidas las multicuentas?", options: ["No, expulsión permanente", "Sí", "Solo 2", "Solo si son tuyas"], correct: 0 },
    { id: 38, category: "Sanciones Graves", title: "¿Sanción por F8/ALT+F4 en rol?", options: ["700 comunitarias o 24h BAN", "Solo advertencia", "Multa leve", "Nada"], correct: 0 },
    { id: 39, category: "Sanciones Graves", title: "¿Qué es evasión de rol?", options: ["+10 min AFK en rol activo", "Salir del juego", "No responder", "Irse a dormir"], correct: 0 },
    { id: 40, category: "Sanciones Graves", title: "¿Sanción por Stream Sniping?", options: ["24h de BAN", "Advertencia", "1 semana", "Nada"], correct: 0 },
    { id: 41, category: "Comercio", title: "¿Están permitidas las estafas OOC?", options: ["No", "Sí", "Solo si son pequeñas", "Depende"], correct: 0 },
    { id: 42, category: "Comercio", title: "¿Puedes vender a precios absurdos?", options: ["No, respetar mercado", "Sí", "Solo si es raro", "A quien quieras"], correct: 0 },
    { id: 43, category: "Vehículos", title: "¿Debes conducir de forma realista?", options: ["Sí", "No", "Solo en ciudad", "Solo de día"], correct: 0 },
    { id: 44, category: "Vehículos", title: "¿Qué hacer con vehículos robados?", options: ["Reportar a policía", "Quedárselo", "Venderlo", "Esconderlo"], correct: 0 },
    { id: 45, category: "Trabajos", title: "¿Debes cumplir el rol de tu trabajo?", options: ["Sí", "No", "Solo si hay jefe", "Depende del sueldo"], correct: 0 },
    { id: 46, category: "Trabajos", title: "¿Puedes farmear ilegalmente con trabajos legales?", options: ["No", "Sí", "Solo de noche", "Si nadie ve"], correct: 0 },
    { id: 47, category: "Comunicación", title: "¿Para qué sirve /me?", options: ["Acciones físicas", "Preguntas de rol", "Hablar OOC", "Enviar dinero"], correct: 0 },
    { id: 48, category: "Comunicación", title: "¿Para qué sirve /do?", options: ["Preguntas de rol", "Acciones físicas", "Hablar IC", "Comandos admin"], correct: 0 },
    { id: 49, category: "Reportes", title: "¿Necesitas evidencia para reportar?", options: ["Sí, video o screenshot", "No", "Solo testimonio", "Solo en casos graves"], correct: 0 },
    { id: 50, category: "General", question: "¿El no conocer normas te exime de cumplirlas?", options: ["No", "Sí", "Parcialmente", "Solo primera vez"], correct: 0 }
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadDiscordStats();
    setInterval(loadDiscordStats, 30000); // Actualizar cada 30s
});

function initApp() {
    // Cargar usuario de localStorage o de Discord OAuth
    loadUserData();
    
    // Fecha actual
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = new Date().toLocaleDateString('es-ES', dateOptions);
    }
    
    // Cargar normativas
    loadRules();
    
    // Inicializar grid de preguntas
    initQuestionGrid();
    
    // Cargar aplicaciones del usuario
    loadUserApplications();
}

function loadUserData() {
    // Intentar cargar desde localStorage primero
    const savedUser = localStorage.getItem('trapcity_user');
    const savedAvatar = localStorage.getItem('trapcity_avatar');
    
    if (savedUser) {
        currentUser = savedUser;
        updateUserUI(savedUser, savedAvatar);
    }
    
    // Si hay token de Discord en la URL, cargar desde Discord
    const urlParams = new URLSearchParams(window.location.search);
    const discordUser = urlParams.get('user');
    const discordTag = urlParams.get('tag');
    const discordAvatar = urlParams.get('avatar');
    
    if (discordUser) {
        currentUser = discordUser;
        localStorage.setItem('trapcity_user', discordUser);
        if (discordTag) localStorage.setItem('trapcity_tag', discordTag);
        if (discordAvatar) localStorage.setItem('trapcity_avatar', discordAvatar);
        updateUserUI(discordUser, discordAvatar);
    }
}

function updateUserUI(username, avatar) {
    const userNameEl = document.getElementById('userName');
    const userTagEl = document.getElementById('userTag');
    const userAvatarEl = document.getElementById('userAvatar');
    const welcomeNameEl = document.getElementById('welcomeName');
    const settingsUsernameEl = document.getElementById('settingsUsername');
    const settingsUserTagEl = document.getElementById('settingsUserTag');
    const settingsAvatarEl = document.getElementById('settingsAvatar');
    
    if (userNameEl) userNameEl.textContent = username;
    if (userTagEl) userTagEl.textContent = localStorage.getItem('trapcity_tag') || '@usuario';
    if (welcomeNameEl) welcomeNameEl.textContent = username;
    if (settingsUsernameEl) settingsUsernameEl.textContent = username;
    if (settingsUserTagEl) settingsUserTagEl.textContent = localStorage.getItem('trapcity_tag') || '@usuario';
    
    if (avatar) {
        if (userAvatarEl) userAvatarEl.src = avatar;
        if (settingsAvatarEl) settingsAvatarEl.src = avatar;
    } else {
        // Avatar por defecto con iniciales
        const initial = username.charAt(0).toUpperCase();
        if (userAvatarEl) {
            userAvatarEl.src = `https://ui-avatars.com/api/?name=${username}&background=dc2626&color=fff`;
        }
    }
}

// Cargar estadísticas de Discord
async function loadDiscordStats() {
    try {
        const response = await fetch('/api/discord-stats');
        if (response.ok) {
            const stats = await response.json();
            
            // Actualizar contadores
            const onlineCountEl = document.getElementById('onlineCount');
            const memberCountEl = document.getElementById('memberCount');
            const discordOnlineEl = document.getElementById('discordOnline');
            const discordTotalEl = document.getElementById('discordTotal');
            
            if (onlineCountEl) onlineCountEl.textContent = stats.online || '-';
            if (memberCountEl) memberCountEl.textContent = stats.total || '-';
            if (discordOnlineEl) discordOnlineEl.textContent = stats.online || '-';
            if (discordTotalEl) discordTotalEl.textContent = stats.total || '-';
        }
    } catch (err) {
        console.log('Error cargando stats de Discord:', err);
        // Valores de ejemplo si falla
        const onlineCountEl = document.getElementById('onlineCount');
        const memberCountEl = document.getElementById('memberCount');
        if (onlineCountEl && onlineCountEl.textContent === '-') onlineCountEl.textContent = '128';
        if (memberCountEl && memberCountEl.textContent === '-') memberCountEl.textContent = '1543';
    }
}

// Navegación entre secciones
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Actualizar sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        item.classList.add('text-gray-400');
    });
    
    const activeBtn = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('text-gray-400');
    }
    
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
    localStorage.removeItem('trapcity_user');
    localStorage.removeItem('trapcity_tag');
    localStorage.removeItem('trapcity_avatar');
    window.location.href = '/';
}

// Whitelist
function startWhitelist() {
    showSection('whitelist');
}

function startQuiz() {
    quizState.currentQuestion = 1;
    quizState.answers = {};
    quizState.startTime = Date.now();
    
    showSection('quiz');
    loadQuestion(1);
    startTimer();
    updateProgress();
}

function startTimer() {
    if (quizState.timerInterval) clearInterval(quizState.timerInterval);
    
    quizState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function initQuestionGrid() {
    const grid = document.getElementById('questionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 1; i <= 50; i++) {
        const btn = document.createElement('button');
        btn.className = 'grid-number pending';
        btn.textContent = i;
        btn.onclick = () => goToQuestion(i);
        btn.id = `grid-${i}`;
        grid.appendChild(btn);
    }
}

function goToQuestion(num) {
    if (num >= 1 && num <= 50) {
        quizState.currentQuestion = num;
        loadQuestion(num);
    }
}

function loadQuestion(num) {
    const question = quizQuestions[num - 1];
    if (!question) return;
    
    const catEl = document.getElementById('questionCategory');
    const numEl = document.getElementById('currentQuestionNum');
    const textEl = document.getElementById('questionText');
    const container = document.getElementById('optionsContainer');
    
    if (catEl) catEl.textContent = question.category;
    if (numEl) numEl.textContent = num;
    if (textEl) textEl.textContent = question.question;
    
    if (container) {
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            const isSelected = quizState.answers[num] === index;
            
            btn.className = `option-card w-full p-4 rounded-xl text-left flex items-center gap-3 ${isSelected ? 'selected' : ''}`;
            btn.innerHTML = `
                <div class="w-6 h-6 rounded-full border-2 ${isSelected ? 'border-red-500 bg-red-500' : 'border-gray-500'} flex items-center justify-center flex-shrink-0">
                    ${isSelected ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                </div>
                <span>${option}</span>
            `;
            btn.onclick = () => selectAnswer(index);
            container.appendChild(btn);
        });
    }
    
    // Botones de navegación
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = num === 1;
    if (nextBtn) {
        nextBtn.innerHTML = num === 50 ? 'Enviar <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : 'Siguiente <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
    }
    
    updateGrid();
}

function selectAnswer(optionIndex) {
    quizState.answers[quizState.currentQuestion] = optionIndex;
    loadQuestion(quizState.currentQuestion);
    updateProgress();
}

function prevQuestion() {
    if (quizState.currentQuestion > 1) {
        quizState.currentQuestion--;
        loadQuestion(quizState.currentQuestion);
    }
}

function nextQuestion() {
    if (quizState.currentQuestion < 50) {
        quizState.currentQuestion++;
        loadQuestion(quizState.currentQuestion);
    } else {
        submitQuiz();
    }
}

function updateProgress() {
    const answered = Object.keys(quizState.answers).length;
    const percent = Math.round((answered / 50) * 100);
    
    const answeredCountEl = document.getElementById('answeredCount');
    const navAnsweredEl = document.getElementById('navAnswered');
    const minAnswersEl = document.getElementById('minAnswers');
    const progressPercentEl = document.getElementById('progressPercent');
    const progressBarEl = document.getElementById('progressBar');
    const submitBtn = document.getElementById('submitBtn');
    
    if (answeredCountEl) answeredCountEl.textContent = answered;
    if (navAnsweredEl) navAnsweredEl.textContent = answered;
    if (minAnswersEl) minAnswersEl.textContent = answered;
    if (progressPercentEl) progressPercentEl.textContent = percent + '%';
    if (progressBarEl) progressBarEl.style.width = percent + '%';
    
    if (submitBtn) {
        if (answered >= 40) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

function updateGrid() {
    for (let i = 1; i <= 50; i++) {
        const btn = document.getElementById(`grid-${i}`);
        if (btn) {
            btn.className = 'grid-number';
            
            if (i === quizState.currentQuestion) {
                btn.classList.add('current');
            } else if (quizState.answers[i] !== undefined) {
                btn.classList.add('answered');
            } else {
                btn.classList.add('pending');
            }
        }
    }
}

function exitQuiz() {
    if (confirm('¿Estás seguro de que quieres salir? Se perderá tu progreso.')) {
        clearInterval(quizState.timerInterval);
        showSection('dashboard');
    }
}

async function submitQuiz() {
    clearInterval(quizState.timerInterval);
    
    const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    // Calcular respuestas correctas
    let correct = 0;
    for (let i = 1; i <= 50; i++) {
        if (quizState.answers[i] === quizQuestions[i - 1].correct) {
            correct++;
        }
    }
    
    const score = Math.round((correct / 50) * 100);
    
    // Enviar al servidor
    try {
        const response = await fetch('/api/whitelist/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser,
                answers: quizState.answers,
                score: score,
                correct: correct,
                time: elapsed,
                timestamp: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            showToast('Éxito', 'Whitelist enviada correctamente', 'success');
            showSection('dashboard');
            loadUserApplications();
        } else {
            showToast('Error', 'Error al enviar whitelist', 'error');
        }
    } catch (err) {
        showToast('Error', 'Error de conexión', 'error');
    }
}

// Normativas
function loadRules() {
    const grid = document.getElementById('rulesGrid');
    const countBadge = document.getElementById('rulesCountBadge');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    rulesData.forEach(rule => {
        const card = createRuleCard(rule);
        grid.appendChild(card);
    });
    
    if (countBadge) countBadge.textContent = rulesData.length;
}

function createRuleCard(rule) {
    const div = document.createElement('div');
    div.className = 'glass rounded-xl p-6 border border-white/10 hover:border-red-500/30 transition';
    div.dataset.category = rule.category;
    div.dataset.title = rule.title.toLowerCase();
    div.dataset.description = rule.description.toLowerCase();
    
    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <span class="text-xs bg-red-500/20 text-blue-400 px-2 py-1 rounded-full">${rule.category}</span>
            <span class="text-xs text-gray-500">#${rule.id}</span>
        </div>
        <h3 class="font-semibold text-lg mb-2">${rule.title}</h3>
        <p class="text-sm text-gray-400 leading-relaxed">${rule.description}</p>
    `;
    
    return div;
}

function filterRules() {
    const search = document.getElementById('rulesSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('rulesCategory')?.value || '';
    const cards = document.querySelectorAll('#rulesGrid > div');
    let visible = 0;
    
    cards.forEach(card => {
        const matchSearch = !search || 
            card.dataset.title.includes(search) || 
            card.dataset.description.includes(search);
        const matchCategory = !category || card.dataset.category === category;
        
        if (matchSearch && matchCategory) {
            card.classList.remove('hidden');
            visible++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    const emptyEl = document.getElementById('rulesEmpty');
    if (emptyEl) emptyEl.classList.toggle('hidden', visible > 0);
}

// Cargar aplicaciones del usuario
async function loadUserApplications() {
    try {
        const response = await fetch(`/api/user-applications?user=${currentUser}`);
        if (response.ok) {
            const apps = await response.json();
            updateApplicationsList(apps);
        }
    } catch (err) {
        console.log('Error cargando aplicaciones:', err);
    }
}

function updateApplicationsList(apps) {
    const appCountEl = document.getElementById('appCount');
    const pendingCountEl = document.getElementById('pendingCount');
    const approvedCountEl = document.getElementById('approvedCount');
    const listEl = document.getElementById('applicationsList');
    const emptyEl = document.getElementById('emptyState');
    
    if (appCountEl) appCountEl.textContent = apps.length;
    
    const pending = apps.filter(a => a.status === 'pending').length;
    const approved = apps.filter(a => a.status === 'approved').length;
    
    if (pendingCountEl) pendingCountEl.textContent = pending;
    if (approvedCountEl) approvedCountEl.textContent = approved;
    
    // Actualizar estado de whitelist
    const statusBadge = document.getElementById('whitelistStatusBadge');
    const statusText = document.getElementById('whitelistStatusText');
    
    if (apps.length === 0) {
        if (statusBadge) {
            statusBadge.textContent = 'Sin Solicitar';
            statusBadge.className = 'text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full';
        }
        if (statusText) statusText.textContent = 'Estado actual';
    } else {
        const latest = apps[apps.length - 1];
        if (statusBadge) {
            statusBadge.textContent = latest.status === 'approved' ? 'Aprobado' : latest.status === 'pending' ? 'Pendiente' : 'Rechazado';
            statusBadge.className = `text-xs px-2 py-1 rounded-full ${latest.status === 'approved' ? 'bg-green-500/20 text-green-400' : latest.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`;
        }
        if (statusText) statusText.textContent = latest.status === 'approved' ? 'Aprobado' : latest.status === 'pending' ? 'En revisión' : 'Rechazado';
    }
    
    if (listEl) {
        if (apps.length === 0) {
            listEl.classList.add('hidden');
            if (emptyEl) emptyEl.classList.remove('hidden');
        } else {
            listEl.classList.remove('hidden');
            if (emptyEl) emptyEl.classList.add('hidden');
            
            listEl.innerHTML = apps.slice(-3).reverse().map(app => `
                <div class="glass p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                        <p class="font-semibold">Aplicación #${app.id}</p>
                        <p class="text-sm text-gray-400">${new Date(app.date).toLocaleDateString()}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm ${app.status === 'approved' ? 'bg-green-500/20 text-green-400' : app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}">
                        ${app.status === 'approved' ? 'Aprobado' : app.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                </div>
            `).join('');
        }
    }
}

// Chat
function toggleChat() {
    const widget = document.getElementById('chatWidget');
    const toggle = document.getElementById('chatToggle');
    
    if (widget.classList.contains('translate-y-[120%]')) {
        widget.classList.remove('translate-y-[120%]');
        toggle.classList.add('scale-0');
    } else {
        widget.classList.add('translate-y-[120%]');
        toggle.classList.remove('scale-0');
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    showTyping();
    
    setTimeout(() => {
        removeTyping();
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1500);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'flex gap-3 ' + (sender === 'user' ? 'flex-row-reverse' : '');
    
    if (sender === 'user') {
        div.innerHTML = `
            <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold">${currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div class="chat-user p-3 max-w-[80%]">
                <p class="text-sm">${text}</p>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold">IA</span>
            </div>
            <div class="chat-bot p-3 max-w-[80%]">
                <p class="text-sm">${text}</p>
            </div>
        `;
    }
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'flex gap-3';
    div.innerHTML = `
        <div class="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold">IA</span>
        </div>
        <div class="chat-bot p-3">
            <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function generateAIResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hola') || lowerMsg.includes('buenas')) {
        return '¡Hola! 👋 Soy Burlau IA, tu asistente virtual de Flow Factory RP. ¿En qué puedo ayudarte hoy? Puedo resolver dudas sobre normativas, el sistema de whitelist o cualquier otra consulta sobre el servidor.';
    }
    else if (lowerMsg.includes('whitelist') || lowerMsg.includes('formulario')) {
        return 'Para acceder al servidor debes completar el formulario de whitelist con 50 preguntas sobre normativas. Necesitas acertar al menos 40 (80%) para pasar. El sistema es: 95%+ = Aprobado automático, 84-94% = Aprobado automático, 77-83% = Revisión manual. ¿Quieres que te explique alguna norma específica?';
    }
    else if (lowerMsg.includes('norma') || lowerMsg.includes('regla')) {
        return 'Tenemos 53 normativas divididas en categorías: Conceptos Básicos (Power Gaming, Meta Gaming, VDM, RDM, FRP), Zonas Seguras, Sistema de Muerte (NLR), Normas Policiales, Normas EMS, Gangas, y Sanciones Graves. ¿Sobre cuál categoría necesitas información?';
    }
    else if (lowerMsg.includes('power gaming') || lowerMsg.includes('powergaming')) {
        return 'Power Gaming es realizar acciones que no serían posibles en la vida real o que no dan tiempo de reacción a otros jugadores. Ejemplo: /me rompe el cuello al policía sin darle chance de reaccionar, o conducir a 100km/h con ruedas pinchadas.';
    }
    else if (lowerMsg.includes('meta gaming') || lowerMsg.includes('metagaming')) {
        return 'Meta Gaming es usar información obtenida fuera del juego (Discord, streams, WhatsApp) dentro de tu personaje. Ejemplo: ver en Discord que hay un robo en una ubicación y tu personaje "casualmente" llega allí. Sanción: 400 comunitarias.';
    }
    else if (lowerMsg.includes('vdm')) {
        return 'VDM (Vehicle Deathmatch) es usar vehículos como arma para atropellar intencionalmente a otros jugadores sin motivo de rol. Está prohibido salvo que sea accidental en una persecución con rol previo.';
    }
    else if (lowerMsg.includes('rdm')) {
        return 'RDM (Random Deathmatch) es atacar o matar a otros jugadores sin una razón válida de rol previa. Siempre debe haber una interacción previa y motivación clara para usar violencia. Sanción: 300-350 comunitarias.';
    }
    else if (lowerMsg.includes('nlr')) {
        return 'NLR (New Life Rule) significa que al morir, tu personaje olvida los eventos que llevaron a su muerte. No puedes regresar a la zona de tu muerte durante 15 minutos ni buscar venganza (Revenge Kill).';
    }
    else if (lowerMsg.includes('fear rp') || lowerMsg.includes('frp')) {
        return 'Fear Roleplay (FRP) significa que debes valorar tu vida en todo momento. Si te apuntan con un arma, levanta las manos y coopera. No actúes como si fueras inmortal. Sanción: 500 comunitarias.';
    }
    else if (lowerMsg.includes('zona segura')) {
        return 'Las zonas seguras incluyen: Hospital, Comisaría, Talleres mecánicos, Tiendas de ropa, y Negocios de comida. En estas zonas está prohibido robar, secuestrar o iniciar violencia. Sanción: 150-850 comunitarias.';
    }
    else if (lowerMsg.includes('gracias') || lowerMsg.includes('thank')) {
        return '¡De nada! 😊 Si tienes más dudas, aquí estoy para ayudarte. ¡Mucha suerte con tu whitelist y bienvenido a Flow Factory RP!';
    }
    else {
        return 'Entiendo tu consulta. Para información más detallada sobre normativas, te recomiendo revisar la sección "Normativas" en el panel. ¿Hay algo más específico sobre el servidor en lo que pueda ayudarte?';
    }
}

// Toast notifications
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    if (!toast) return;
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    const icons = {
        success: '<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        error: '<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        info: '<svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };
    
    toastIcon.innerHTML = icons[type] || icons.info;
    
    toast.className = `toast fixed top-6 right-6 glass-panel px-6 py-4 rounded-xl border-l-4 z-[60] flex items-center gap-3 show`;
    toast.classList.add(type === 'success' ? 'border-green-500' : type === 'error' ? 'border-red-500' : 'border-red-500');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Event listeners
if (document.getElementById('rulesSearch')) {
    document.getElementById('rulesSearch').addEventListener('input', filterRules);
}
if (document.getElementById('rulesCategory')) {
    document.getElementById('rulesCategory').addEventListener('change', filterRules);
}

if (document.getElementById('toast')) {
    document.getElementById('toast').addEventListener('click', function() {
        this.classList.remove('show');
    });
}
