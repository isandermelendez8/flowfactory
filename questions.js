// ==================== PREGUNTAS DE WHITELIST FLOW FACTORY RP ====================
// 45 preguntas basadas en las normativas del servidor

const whitelistQuestions = [
    // === CONCEPTOS BÁSICOS (1-15) ===
    {
        id: 1,
        category: 'Conceptos Básicos',
        question: '¿Qué significa IC?',
        options: [
            'In Character - Todo lo que hace tu personaje dentro del rol',
            'In Chat - Chat dentro del juego',
            'In Community - Dentro de la comunidad',
            'In Control - Control dentro del juego'
        ],
        correct: 'In Character - Todo lo que hace tu personaje dentro del rol'
    },
    {
        id: 2,
        category: 'Conceptos Básicos',
        question: '¿Qué significa OOC?',
        options: [
            'Out Of Character - Todo lo fuera del personaje (vida real / Discord)',
            'Out Of Control - Fuera de control',
            'Out Of Chat - Fuera del chat',
            'Out Of Community - Fuera de la comunidad'
        ],
        correct: 'Out Of Character - Todo lo fuera del personaje (vida real / Discord)'
    },
    {
        id: 3,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Meta Gaming (MG)?',
        options: [
            'Usar información de fuera del juego (Discord, streams) para beneficiarse en el rol',
            'Jugar muchas horas seguidas',
            'Usar mods o cheats en el juego',
            'Hacer roleplay de un personaje muy poderoso'
        ],
        correct: 'Usar información de fuera del juego (Discord, streams) para beneficiarse en el rol'
    },
    {
        id: 4,
        category: 'Conceptos Básicos',
        question: '¿Está permitido el Meta Gaming?',
        options: [
            'No, está totalmente prohibido',
            'Sí, si es para ayudar a amigos',
            'Sí, en situaciones de emergencia',
            'Solo si nadie se da cuenta'
        ],
        correct: 'No, está totalmente prohibido'
    },
    {
        id: 5,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Power Gaming (PG)?',
        options: [
            'Realizar acciones irreales o forzadas sin dar oportunidad de reacción',
            'Tener mucho poder en el juego',
            'Usar armas poderosas',
            'Ser admin del servidor'
        ],
        correct: 'Realizar acciones irreales o forzadas sin dar oportunidad de reacción'
    },
    {
        id: 6,
        category: 'Conceptos Básicos',
        question: '¿Está permitido conducir a 100 km/h con las 4 ruedas pinchadas?',
        options: [
            'No, es Power Gaming',
            'Sí, si el coche es deportivo',
            'Sí, si estoy huyendo de la policía',
            'Solo en carreteras'
        ],
        correct: 'No, es Power Gaming'
    },
    {
        id: 7,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Fear Roleplay (FRP)?',
        options: [
            'Valorar tu vida en todo momento y actuar realista ante amenazas',
            'Tener miedo a rolear',
            'Rol de terror o miedo',
            'No hacer roleplay si hay peligro'
        ],
        correct: 'Valorar tu vida en todo momento y actuar realista ante amenazas'
    },
    {
        id: 8,
        category: 'Conceptos Básicos',
        question: 'Si te apuntan con un arma, ¿qué debes hacer según Fear RP?',
        options: [
            'Cooperar y levantar las manos',
            'Intentar correr',
            'Sacar tu arma y disparar',
            'Llamar a la policía por teléfono'
        ],
        correct: 'Cooperar y levantar las manos'
    },
    {
        id: 9,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Deathmatch (DM)?',
        options: [
            'Atacar o matar sin razón de rol válida',
            'Matar en el juego',
            'Un modo de juego especial',
            'Pelear con otros jugadores'
        ],
        correct: 'Atacar o matar sin razón de rol válida'
    },
    {
        id: 10,
        category: 'Conceptos Básicos',
        question: '¿Se puede matar a alguien sin interacción previa?',
        options: [
            'No, siempre debe haber historia o interacción previa',
            'Sí, si me cae mal',
            'Sí, en zonas peligrosas',
            'Solo si es de noche'
        ],
        correct: 'No, siempre debe haber historia o interacción previa'
    },
    {
        id: 11,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Revenge Kill (RK)?',
        options: [
            'Volver a matar por venganza después de haber muerto',
            'Matar a alguien que te robó',
            'Vengarse de un enemigo',
            'Matar en defensa propia'
        ],
        correct: 'Volver a matar por venganza después de haber muerto'
    },
    {
        id: 12,
        category: 'Conceptos Básicos',
        question: '¿Está permitido el Revenge Kill?',
        options: [
            'No, está totalmente prohibido',
            'Sí, al día siguiente',
            'Sí, si no te vio',
            'Solo si tienes testigos'
        ],
        correct: 'No, está totalmente prohibido'
    },
    {
        id: 13,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Vehicle Deathmatch (VDM)?',
        options: [
            'Usar vehículos como arma contra jugadores sin justificación',
            'Chocar coches intencionalmente',
            'Hacer carreras ilegales',
            'Usar coches deportivos'
        ],
        correct: 'Usar vehículos como arma contra jugadores sin justificación'
    },
    {
        id: 14,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Character Kill (CK)?',
        options: [
            'Muerte definitiva del personaje con ticket previo y motivos de peso',
            'Cerrar el juego',
            'Eliminar el personaje del menú',
            'Morir en el hospital'
        ],
        correct: 'Muerte definitiva del personaje con ticket previo y motivos de peso'
    },
    {
        id: 15,
        category: 'Conceptos Básicos',
        question: '¿Qué es el Partial Kill (PK)?',
        options: [
            'Olvidar los últimos eventos tras ser reanimado',
            'Matar parcialmente a alguien',
            'Herir gravemente',
            'Dejar inconsciente'
        ],
        correct: 'Olvidar los últimos eventos tras ser reanimado'
    },
    
    // === ZONAS SEGURAS (16-20) ===
    {
        id: 16,
        category: 'Zonas Seguras',
        question: '¿Qué son las Zonas Seguras?',
        options: [
            'Áreas donde está prohibida cualquier violencia o rol agresivo',
            'Zonas con más policías',
            'Áreas iluminadas del mapa',
            'Zonas para nuevos jugadores'
        ],
        correct: 'Áreas donde está prohibida cualquier violencia o rol agresivo'
    },
    {
        id: 17,
        category: 'Zonas Seguras',
        question: '¿El hospital es una Zona Segura?',
        options: [
            'Sí, neutralidad absoluta',
            'Solo durante el día',
            'No, se puede rolear violencia',
            'Solo la entrada'
        ],
        correct: 'Sí, neutralidad absoluta'
    },
    {
        id: 18,
        category: 'Zonas Seguras',
        question: '¿La comisaría es una Zona Segura?',
        options: [
            'Sí, se prohíbe cualquier rol agresivo',
            'No, se puede atacar',
            'Solo los fines de semana',
            'Depende del horario'
        ],
        correct: 'Sí, se prohíbe cualquier rol agresivo'
    },
    {
        id: 19,
        category: 'Zonas Seguras',
        question: '¿Puedes sacar un arma en una Zona Segura?',
        options: [
            'No, está prohibido mostrar armas',
            'Sí, si es escondida',
            'Sí, para defensa personal',
            'Solo si nadie ve'
        ],
        correct: 'No, está prohibido mostrar armas'
    },
    {
        id: 20,
        category: 'Zonas Seguras',
        question: '¿Qué sanción tiene violar una Zona Segura?',
        options: [
            '150-850 comunitarias según la infracción',
            'Advertencia verbal',
            'Solo kick',
            'Ninguna si es la primera vez'
        ],
        correct: '150-850 comunitarias según la infracción'
    },
    
    // === SISTEMA DE MUERTE (21-25) ===
    {
        id: 21,
        category: 'Sistema de Muerte',
        question: '¿Qué puedes hacer en Fase 1 (Herido)?',
        options: [
            'Arrastrarte, hablar, usar radio y responder llamadas',
            'Nada, estás muerto',
            'Caminar normalmente',
            'Conducir al hospital'
        ],
        correct: 'Arrastrarte, hablar, usar radio y responder llamadas'
    },
    {
        id: 22,
        category: 'Sistema de Muerte',
        question: '¿Puedes usar radio en Fase 2 (Desangrándose)?',
        options: [
            'No, está prohibido',
            'Sí, de emergencia',
            'Solo para pedir ayuda',
            'Sí, pero susurrando'
        ],
        correct: 'No, está prohibido'
    },
    {
        id: 23,
        category: 'Sistema de Muerte',
        question: '¿Qué pasa en Fase 3 (Inconsciente)?',
        options: [
            'Sin comunicación ni interacción posible',
            'Puedes hablar bajito',
            'Puedes enviar mensajes OOC',
            'Puedes llamar por teléfono'
        ],
        correct: 'Sin comunicación ni interacción posible'
    },
    {
        id: 24,
        category: 'Sistema de Muerte',
        question: 'Si llega el EMS estando inconsciente, ¿qué pasa?',
        options: [
            '100% PK obligatorio',
            'Puedes recordar todo',
            'Te curas completamente',
            'Nada especial'
        ],
        correct: '100% PK obligatorio'
    },
    {
        id: 25,
        category: 'Sistema de Muerte',
        question: '¿Cuánto cuesta irte con María?',
        options: [
            '$300 USD',
            '$100 USD',
            'Es gratis',
            '$500 USD'
        ],
        correct: '$300 USD'
    },
    
    // === NORMAS POLICIALES (26-28) ===
    {
        id: 26,
        category: 'Normas Policiales',
        question: '¿Está permitida la corrupción policial?',
        options: [
            'No, totalmente prohibida sin aprobación de administración',
            'Sí, si es poca',
            'Solo entre policías',
            'Sí, en situaciones especiales'
        ],
        correct: 'No, totalmente prohibida sin aprobación de administración'
    },
    {
        id: 27,
        category: 'Normas Policiales',
        question: '¿Puede un policía usar vehículos personales en servicio?',
        options: [
            'No, está prohibido',
            'Sí, si son deportivos',
            'Solo en emergencias',
            'Sí, a cualquier hora'
        ],
        correct: 'No, está prohibido'
    },
    {
        id: 28,
        category: 'Normas Policiales',
        question: '¿Qué pasa si un policía rompe los términos de una negociación?',
        options: [
            'Es sancionable gravemente',
            'Nada',
            'Solo advertencia',
            'Pierde su rango'
        ],
        correct: 'Es sancionable gravemente'
    },
    
    // === NORMAS EMS (29-31) ===
    {
        id: 29,
        category: 'Normas EMS',
        question: '¿Puede el EMS vender banditas o medkits?',
        options: [
            'No, está totalmente prohibido',
            'Sí, a precio justo',
            'Solo a policías',
            'Sí, si hay escasez'
        ],
        correct: 'No, está totalmente prohibido'
    },
    {
        id: 30,
        category: 'Normas EMS',
        question: '¿El EMS debe ser neutral?',
        options: [
            'Sí, completamente neutral',
            'No, puede elegir bando',
            'Solo en ciertas zonas',
            'Depende de la situación'
        ],
        correct: 'Sí, completamente neutral'
    },
    {
        id: 31,
        category: 'Normas EMS',
        question: '¿Puede el EMS entrar a zonas activas sin autorización policial?',
        options: [
            'No, debe esperar autorización',
            'Sí, si es urgente',
            'Sí, siempre',
            'Solo de noche'
        ],
        correct: 'No, debe esperar autorización'
    },
    
    // === GANGAS (32-34) ===
    {
        id: 32,
        category: 'Gangas',
        question: '¿Quién debe aprobar una ganga?',
        options: [
            'La administración del servidor',
            'Cualquier admin',
            'Los líderes de otras gangas',
            'No necesita aprobación'
        ],
        correct: 'La administración del servidor'
    },
    {
        id: 33,
        category: 'Gangas',
        question: '¿Puede una ganga atacar sin previo aviso?',
        options: [
            'No, debe existir motivo IC previo',
            'Sí, si son más fuertes',
            'Sí, en su territorio',
            'Solo los fines de semana'
        ],
        correct: 'No, debe existir motivo IC previo'
    },
    {
        id: 34,
        category: 'Gangas',
        question: '¿Puede hacerse un atraco sin policías en servicio?',
        options: [
            'No, debe haber policías',
            'Sí, si es rápido',
            'Sí, de noche',
            'Solo en ciertas zonas'
        ],
        correct: 'No, debe haber policías'
    },
    
    // === CONDUCTA GENERAL (35-40) ===
    {
        id: 35,
        category: 'Conducta',
        question: '¿Está permitido hacer Bunny Jumping (saltar repetidamente)?',
        options: [
            'No, está prohibido como mecánica de movimiento',
            'Sí, para moverse rápido',
            'Solo en persecuciones',
            'Sí, si nadie se da cuenta'
        ],
        correct: 'No, está prohibido como mecánica de movimiento'
    },
    {
        id: 36,
        category: 'Conducta',
        question: '¿Qué es el Cop Baiting?',
        options: [
            'Provocar a la policía sin motivo de rol sólido',
            'Pescar policías',
            'Seguir a la policía',
            'Pedir ayuda a la policía'
        ],
        correct: 'Provocar a la policía sin motivo de rol sólido'
    },
    {
        id: 37,
        category: 'Conducta',
        question: '¿Qué sanción tiene usar F8/ALT+F4 durante rol activo?',
        options: [
            '700 comunitarias o 24h de BAN',
            'Solo advertencia',
            'Kick temporal',
            'Nada si es accidente'
        ],
        correct: '700 comunitarias o 24h de BAN'
    },
    {
        id: 38,
        category: 'Conducta',
        question: '¿Puedes usar información de streams de otros jugadores?',
        options: [
            'No, es Stream Sniping y está prohibido',
            'Sí, si son públicos',
            'Solo para encontrar amigos',
            'Sí, si están en tu ganga'
        ],
        correct: 'No, es Stream Sniping y está prohibido'
    },
    {
        id: 39,
        category: 'Conducta',
        question: '¿Están permitidas las multicuentas?',
        options: [
            'No, están prohibidas',
            'Sí, si son tuyas',
            'Sí, una por facción',
            'Solo si tienes whitelist'
        ],
        correct: 'No, están prohibidas'
    },
    {
        id: 40,
        category: 'Conducta',
        question: 'Si tu personaje principal es policía, ¿qué puede hacer tu segundo slot?',
        options: [
            'No puede estar vinculado a actividades criminales',
            'Puede ser criminal',
            'Puede ser de cualquier facción',
            'No hay restricciones'
        ],
        correct: 'No puede estar vinculado a actividades criminales'
    },
    
    // === COMANDOS Y ROL (41-45) ===
    {
        id: 41,
        category: 'Comandos',
        question: '¿Para qué sirve /me?',
        options: [
            'Para describir acciones físicas de tu personaje',
            'Para hablar por radio',
            'Para enviar mensajes privados',
            'Para reportar bugs'
        ],
        correct: 'Para describir acciones físicas de tu personaje'
    },
    {
        id: 42,
        category: 'Comandos',
        question: '¿Para qué sirve /do?',
        options: [
            'Para describir el estado visible del entorno',
            'Para hacer preguntas al staff',
            'Para donar dinero',
            'Para usar animaciones'
        ],
        correct: 'Para describir el estado visible del entorno'
    },
    {
        id: 43,
        category: 'Normas',
        question: '¿Cuál es la edad mínima de un personaje?',
        options: [
            '18 años',
            '16 años',
            '21 años',
            'No hay mínimo'
        ],
        correct: '18 años'
    },
    {
        id: 44,
        category: 'Normas',
        question: '¿Qué pasa si proporcionas información falsa en un ticket?',
        options: [
            'Puedes recibir ban o eliminación de whitelist',
            'Solo advertencia',
            'Nada grave',
            'Kick temporal'
        ],
        correct: 'Puedes recibir ban o eliminación de whitelist'
    },
    {
        id: 45,
        category: 'Normas',
        question: '¿Cuántos intentos de whitelist tienes cada 24 horas?',
        options: [
            'Solo UNO',
            'Dos',
            'Tres',
            'Ilimitados'
        ],
        correct: 'Solo UNO'
    }
];

module.exports = { whitelistQuestions };
