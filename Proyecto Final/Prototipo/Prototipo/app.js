const pages = {
  inicio: "Inicio",
  captura: "Captura de paciente",
  consulta: "Consulta de expedientes",
  validacion: "Validación",
  reportes: "Reportes",
  usuarios: "Usuarios y roles"
};

const pageTitle = document.querySelector("#pageTitle");
const loginScreen = document.querySelector("#loginScreen");
const appShell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");
const logoutButton = document.querySelector("#logoutButton");
const profileRole = document.querySelector("#profileRole");
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pageSections = Array.from(document.querySelectorAll(".page"));
const toast = document.querySelector("#toast");
const consentPage = document.querySelector("#captura");
const consentCheck = document.querySelector("#consentCheck");
const saveConsent = document.querySelector("#saveConsent");
const captureStatus = document.querySelector("#captureStatus");
const backToConsent = document.querySelector("#backToConsent");
const questionnaireTitle = document.querySelector("#questionnaireTitle");
const questionnaireHint = document.querySelector("#questionnaireHint");
const questionnaireFields = document.querySelector("#questionnaireFields");
const questionnaireProgress = document.querySelector("#questionnaireProgress");
const prevQuestionStep = document.querySelector("#prevQuestionStep");
const nextQuestionStep = document.querySelector("#nextQuestionStep");
const stepCounter = document.querySelector("#stepCounter");
const currentSectionName = document.querySelector("#currentSectionName");
const signatureFile = document.querySelector("#signatureFile");
const signatureFileName = document.querySelector("#signatureFileName");

let currentQuestionStep = 0;
let captureFinished = false;
let currentRole = "alumno";
const patientAnswers = {};

const demoUsers = {
  alumno: {
    password: "alumno",
    label: "Alumno",
    home: "inicio",
    pages: ["inicio", "captura", "consulta"]
  },
  profesor: {
    password: "profesor",
    label: "Profesor",
    home: "reportes",
    pages: ["inicio", "consulta", "validacion", "reportes"]
  },
  admin: {
    password: "admin",
    label: "Administrador",
    home: "inicio",
    pages: ["inicio", "captura", "consulta", "validacion", "reportes", "usuarios"]
  }
};

const guideSections = [
  {
    title: "Datos descriptivos de la persona",
    hint: "Información general del menor y del informante.",
    questions: [
      { label: "Nombre", type: "text" },
      { label: "Edad", type: "text" },
      { label: "Fecha de nacimiento", type: "date" },
      { label: "Sexo", type: "radio", options: ["Masc", "Fem"] },
      { label: "Lugar de nacimiento", type: "text" },
      { label: "Domicilio", type: "text" },
      { label: "No. de hermanos", type: "text" },
      { label: "Lugar que ocupa en la familia", type: "text" },
      { label: "Escolaridad", type: "text" },
      { label: "Ocupación", type: "text" },
      { label: "Religión", type: "text" },
      { label: "Parentesco del informante", type: "text" },
      { label: "Fecha de ingreso", type: "date" },
      { label: "Institución", type: "text" }
    ]
  },
  {
    title: "Factores socioculturales",
    hint: "Condiciones de vivienda, convivencia y recursos familiares.",
    questions: [
      { label: "Residencia", type: "radio", options: ["Propia", "Prestada", "Rentada", "Otro"] },
      { label: "Material de construcción de la vivienda", type: "radio", options: ["Adobe", "Ladrillo", "Lámina", "Otros"] },
      { label: "Número de habitaciones", type: "text" },
      { label: "Número de dormitorios", type: "text" },
      { label: "Servicios básicos", type: "check", options: ["Agua", "Luz", "Drenaje", "Recolección de basura", "Alumbrado público", "Alcantarillado", "Pavimentación"] },
      { label: "Convivencia con la familia", type: "radio", options: ["Sí", "No", "En ocasiones"] },
      { label: "Dónde pasa la mayor parte del tiempo", type: "radio", options: ["Hogar", "Escuela/Guardería", "Abuelos", "Otro"] },
      { label: "Cómo considera la relación familiar", type: "radio", options: ["Buena", "Regular", "Mala"] },
      { label: "Ingreso económico familiar", type: "radio", options: ["Menos de 1 s.m.", "1-2 s.m.", "Más de 3 s.m."] }
    ]
  },
  {
    title: "Patrón de vida",
    hint: "Rol familiar, autocuidado e inmunizaciones.",
    questions: [
      { label: "Rol", type: "check", options: ["Hijo", "Hermano", "Padre/Madre"] },
      {
        label: "Qué hace para cuidar su salud",
        type: "frequency",
        options: [
          { label: "Baño", unit: "veces por semana" },
          { label: "Aseo de manos antes de comer y después de ir al baño", unit: "veces al día" },
          { label: "Aseo bucal", unit: "veces al día" },
          { label: "Cambio de ropa", unit: "veces por semana" }
        ]
      },
      { label: "Esquema de vacunación según edad", type: "radio", options: ["Completo", "Incompleto"] },
      { label: "Especificar esquema de vacunación", type: "text", showWhen: { label: "Esquema de vacunación según edad", includes: "Incompleto" } }
    ]
  },
  {
    title: "Estado y sistema de salud",
    hint: "Servicios médicos disponibles y motivos de atención.",
    questions: [
      { label: "Con qué servicios de salud cuenta", type: "check", options: ["IMSS", "ISSSTE", "ISEA", "Particular", "Seguro popular", "Otro"] },
      { label: "Especificar otro servicio", type: "text", showWhen: { label: "Con qué servicios de salud cuenta", includes: "Otro" } },
      { label: "Cuándo acude al servicio médico", type: "check", options: ["Llanto persistente", "Pérdida de apetito", "Se ve triste", "Dice tener dolor", "Signos y síntomas de enfermedad", "Control"] },
      { label: "Cuándo toma la decisión de llevar al niño a recibir atención", type: "textarea" },
      { label: "Causa por la que no asiste a los servicios de salud", type: "check", options: ["Falta de tiempo", "Falta de dinero", "Dificultad para el traslado", "Otro"] },
      { label: "Especifique causa", type: "text", showWhen: { label: "Causa por la que no asiste a los servicios de salud", includes: "Otro" } }
    ]
  },
  {
    title: "Universales: aporte de aire suficiente",
    hint: "Respiración, exposición al humo y signos de dificultad respiratoria.",
    questions: [
      { label: "Respira sin dificultad", type: "radio", options: ["Sí", "No"] },
      { label: "Presenta dificultad respiratoria", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar dificultad respiratoria", type: "text", showWhen: { label: "Presenta dificultad respiratoria", includes: "Sí" } },
      { label: "Presenta tos", type: "radio", options: ["Sí", "No"] },
      { label: "Tipo o frecuencia de tos", type: "text", showWhen: { label: "Presenta tos", includes: "Sí" } },
      { label: "Presenta secreciones nasales o flemas", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar secreciones", type: "text", showWhen: { label: "Presenta secreciones nasales o flemas", includes: "Sí" } },
      { label: "Convive con fumadores en casa", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar exposición al humo", type: "text", showWhen: { label: "Convive con fumadores en casa", includes: "Sí" } }
    ]
  },
  {
    title: "Universales: aporte de agua suficiente",
    hint: "Consumo de líquidos, acceso a agua potable y datos de hidratación.",
    questions: [
      { label: "Consume agua simple durante el día", type: "radio", options: ["Sí", "No"] },
      { label: "Cantidad aproximada de agua al día", type: "text", showWhen: { label: "Consume agua simple durante el día", includes: "Sí" } },
      { label: "El agua que consume es potable", type: "radio", options: ["Sí", "No"] },
      { label: "Consume bebidas azucaradas", type: "radio", options: ["Sí", "No"] },
      { label: "Frecuencia de bebidas azucaradas", type: "text", showWhen: { label: "Consume bebidas azucaradas", includes: "Sí" } },
      { label: "Presenta signos de deshidratación", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar signos de deshidratación", type: "text", showWhen: { label: "Presenta signos de deshidratación", includes: "Sí" } }
    ]
  },
  {
    title: "Universales: aporte de alimentos suficiente",
    hint: "Alimentación habitual, apetito y problemas para comer.",
    questions: [
      { label: "Número de comidas al día", type: "text" },
      { label: "Tiene apetito adecuado", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar cambios de apetito", type: "text", showWhen: { label: "Tiene apetito adecuado", includes: "No" } },
      { label: "Tipo de alimentación", type: "check", options: ["Lactancia materna", "Fórmula", "Dieta familiar", "Dieta especial"] },
      { label: "Especificar dieta especial", type: "text", showWhen: { label: "Tipo de alimentación", includes: "Dieta especial" } },
      { label: "Presenta alergias alimentarias", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar alergias alimentarias", type: "text", showWhen: { label: "Presenta alergias alimentarias", includes: "Sí" } },
      { label: "Presenta dificultad para masticar o deglutir", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar dificultad para alimentarse", type: "text", showWhen: { label: "Presenta dificultad para masticar o deglutir", includes: "Sí" } }
    ]
  },
  {
    title: "Universales: eliminación y excrementos",
    hint: "Micción, evacuación y control de esfínteres.",
    questions: [
      { label: "Evacuaciones al día", type: "text" },
      { label: "Características de evacuación", type: "check", options: ["Normal", "Estreñimiento", "Diarrea", "Dolor"] },
      { label: "Especificar alteración de evacuación", type: "text", showWhen: { label: "Características de evacuación", any: true, notIncludes: "Normal" } },
      { label: "Micciones al día", type: "text" },
      { label: "Presenta dolor o ardor al orinar", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar dolor o ardor al orinar", type: "text", showWhen: { label: "Presenta dolor o ardor al orinar", includes: "Sí" } },
      { label: "Control de esfínteres según edad", type: "radio", options: ["Sí", "No", "No aplica"] },
      { label: "Especificar control de esfínteres", type: "text", showWhen: { label: "Control de esfínteres según edad", includes: "No" } }
    ]
  },
  {
    title: "Universales: actividad, estímulos y reflejos",
    hint: "Actividad escolar, respuesta a estímulos y desarrollo motor temprano.",
    questions: [
      { label: "Actividad", type: "check", options: ["Acude a la guardería", "Kinder", "Primaria", "Secundaria", "Preparatoria", "Ninguna actividad"] },
      { label: "No. de horas / especifique actividad", type: "text", showWhen: { label: "Actividad", notIncludes: "Ninguna actividad" } },
      { label: "Respuesta a estímulos de 0 a 12 meses", type: "section" },
      { label: "Búsqueda", type: "radio", options: ["Presente", "Disminuido", "Ausente"] },
      { label: "Succión y deglución", type: "radio", options: ["Presente", "Disminuido", "Ausente"] },
      { label: "Marcha", type: "radio", options: ["Presente", "Disminuido", "Ausente"] },
      { label: "Presión", type: "radio", options: ["Presente", "Disminuido", "Ausente"] },
      { label: "Hitos del desarrollo", type: "check", options: ["Sostiene la cabeza", "Se sostiene sentado", "Localiza objetos con la mirada", "Reconoce voces", "Sujeta objetos", "Gatea", "Camina solo", "Con andadera", "Con ayuda"] },
      { label: "Especificar", type: "text" }
    ]
  },
  {
    title: "Universales: juego, deporte y redes",
    hint: "Uso de juegos electrónicos, actividades físicas y preferencias.",
    questions: [
      { label: "Gusta de los juegos electrónicos", type: "check", options: ["Sí", "No"] },
      { label: "Especificar juego y frecuencia", type: "text" },
      { label: "Practica algún deporte o actividad artística", type: "check", options: ["Sí", "No"] },
      { label: "Horas que juega", type: "text" },
      { label: "Preferencia por alguna actividad", type: "check", options: ["Sí", "No"] },
      { label: "Especifique actividad", type: "text" },
      { label: "Usa redes sociales", type: "check", options: ["Sí", "No"] }
    ]
  },
  {
    title: "Universales: equilibrio entre sociedad e interacción humana",
    hint: "Audición, visión y conductas observables.",
    questions: [
      { label: "Sistema auditivo: problemas auditivos", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar problema auditivo", type: "text", showWhen: { label: "Sistema auditivo: problemas auditivos", includes: "Sí" } },
      { label: "Utiliza apoyo para escuchar", type: "radio", options: ["Sí", "No"], showWhen: { label: "Sistema auditivo: problemas auditivos", includes: "Sí" } },
      { label: "Sistema ocular: problemas visuales", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar problema visual", type: "text", showWhen: { label: "Sistema ocular: problemas visuales", includes: "Sí" } },
      { label: "Utiliza lentes", type: "check", options: ["Armazón", "Contacto"], showWhen: { label: "Sistema ocular: problemas visuales", includes: "Sí" } },
      { label: "Tiempo de uso", type: "text", showWhen: { label: "Utiliza lentes", any: true } },
      { label: "Observar presencia de", type: "check", options: ["Seguridad", "Timidez", "Introversión", "Apatía", "Extroversión", "Agresividad", "Otros"] },
      { label: "Otros rasgos", type: "text", showWhen: { label: "Observar presencia de", includes: "Otros" } }
    ]
  },
  {
    title: "Universales: prevención de peligros",
    hint: "Riesgos del hogar y medidas de seguridad.",
    questions: [
      { label: "Conocimientos sobre prevención de accidentes en el hogar", type: "check", options: ["Sí", "No"] },
      { label: "Las sustancias tóxicas guardadas en el hogar están fuera del alcance de los niños", type: "check", options: ["Sí", "No"] },
      { label: "Los medicamentos están en resguardo", type: "check", options: ["Sí", "No"] },
      { label: "Acude a algún grupo de ayuda para su problema o enfermedad", type: "radio", options: ["Sí", "No"] },
      { label: "Especifique grupo de ayuda", type: "text", showWhen: { label: "Acude a algún grupo de ayuda para su problema o enfermedad", includes: "Sí" } }
    ]
  },
  {
    title: "Universales: promoción del funcionamiento humano",
    hint: "Problemas relevantes de salud y apoyo recibido.",
    questions: [
      { label: "Recuerda algún problema o aspecto relevante referente a la salud", type: "radio", options: ["Sí", "No"] },
      { label: "Especifique problema o aspecto relevante", type: "textarea", showWhen: { label: "Recuerda algún problema o aspecto relevante referente a la salud", includes: "Sí" } },
      { label: "Edad en la que se percató del problema", type: "text", showWhen: { label: "Recuerda algún problema o aspecto relevante referente a la salud", includes: "Sí" } },
      { label: "Acude a algún grupo de ayuda para su problema o enfermedad", type: "radio", options: ["Sí", "No"] },
      { label: "Especifique grupo", type: "text", showWhen: { label: "Acude a algún grupo de ayuda para su problema o enfermedad", includes: "Sí" } }
    ]
  },
  {
    title: "Desarrollo: vida intrauterina y neonatal",
    hint: "Antecedentes del embarazo, nacimiento y etapa neonatal.",
    questions: [
      { label: "No. embarazos", type: "text" },
      { label: "Control prenatal", type: "radio", options: ["Sí", "No"] },
      { label: "No. de veces", type: "text", showWhen: { label: "Control prenatal", includes: "Sí" } },
      { label: "Sufrimiento fetal", type: "radio", options: ["Sí", "No"] },
      { label: "Alteraciones/enfermedades durante el embarazo", type: "radio", options: ["Sí", "No"] },
      { label: "Especifique alteraciones/enfermedades", type: "text", showWhen: { label: "Alteraciones/enfermedades durante el embarazo", includes: "Sí" } },
      { label: "Toxicomanías durante el embarazo", type: "radio", options: ["Sí", "No"] },
      { label: "Prescripción de medicamentos", type: "radio", options: ["Sí", "No"] },
      { label: "Malformaciones congénitas", type: "radio", options: ["Sí", "No"] },
      { label: "Especifique malformaciones", type: "text", showWhen: { label: "Malformaciones congénitas", includes: "Sí" } },
      { label: "Semanas de gestación", type: "text" },
      { label: "Peso al nacer", type: "text" },
      { label: "Talla al nacer", type: "text" },
      { label: "Apgar al minuto", type: "text" },
      { label: "Apgar a los 5 minutos", type: "text" },
      { label: "Tipo de parto", type: "text" }
    ]
  },
  {
    title: "Desarrollo: infancia y adolescencia",
    hint: "Dentición, desarrollo sexual y ciclo menstrual.",
    questions: [
      { label: "Inicio de dentición", type: "text" },
      { label: "Presencia de caries", type: "check", options: ["Sí", "No"] },
      { label: "Usa aparatos de ortodoncia", type: "check", options: ["Sí", "No"] },
      { label: "Características sexuales secundarias: edad de aparición", type: "text" },
      { label: "Desarrollo", type: "radio", options: ["Normal", "Anormal"] },
      { label: "Especifique desarrollo", type: "text", showWhen: { label: "Desarrollo", includes: "Anormal" } },
      { label: "Características del ciclo menstrual", type: "check", options: ["Regular", "Irregular", "Dismenorrea", "Aún no lo presenta"], showWhen: { label: "Sexo", includes: "Fem" } },
      { label: "Duración", type: "text", showWhen: { label: "Características del ciclo menstrual", any: true, notIncludes: "Aún no lo presenta" } },
      { label: "Utiliza algún método de planificación familiar", type: "radio", options: ["Sí", "No"], showWhen: { label: "Sexo", includes: "Fem" } },
      { label: "Especifique método", type: "text", showWhen: { label: "Utiliza algún método de planificación familiar", includes: "Sí" } }
    ]
  },
  {
    title: "Riesgos, pérdidas y desviaciones de salud",
    hint: "Aspectos educativos, pérdidas, cambios y peligros ambientales.",
    questions: [
      { label: "Tiene problemas para el aprendizaje", type: "check", options: ["Sí", "No"] },
      { label: "Trabaja para aportar a los gastos familiares", type: "check", options: ["Sí", "No"] },
      { label: "Deficientes recursos económicos para asistir a la escuela", type: "check", options: ["Sí", "No"] },
      { label: "Ha vivido alguna pérdida importante", type: "radio", options: ["Sí", "No"] },
      { label: "Especificar pérdida y cuándo", type: "text", showWhen: { label: "Ha vivido alguna pérdida importante", includes: "Sí" } },
      { label: "Cómo fue la respuesta al duelo o pérdida", type: "textarea", showWhen: { label: "Ha vivido alguna pérdida importante", includes: "Sí" } },
      { label: "Cambios súbitos en condiciones de vida", type: "check", options: ["Cambio de residencia", "Casa", "Colegio/Escuela", "Familia", "Ingresos"] },
      { label: "Mala salud, condiciones de vida o incapacidad", type: "check", options: ["Se enferma con frecuencia", "Presenta problemas psicológicos", "Es autosuficiente", "Tiene enfermedad crónica", "Está consciente de su enfermedad", "Conoce los riesgos"] },
      { label: "Especificar enfermedad crónica", type: "text", showWhen: { label: "Mala salud, condiciones de vida o incapacidad", includes: "Tiene enfermedad crónica" } },
      { label: "Peligros ambientales: tiene contacto con", type: "check", options: ["No peligros", "Pesticidas", "Bióxido de carbono", "Zona insalubre", "Es adicto", "Convive con adictos", "Adicciones en su entorno o usuario"] },
      { label: "Especificar peligros ambientales", type: "text", showWhen: { label: "Peligros ambientales: tiene contacto con", any: true, notIncludes: "No peligros" } },
      { label: "Requiere cuidados específicos preventivos y reguladores", type: "radio", options: ["Sí", "No"] }
    ]
  }
];

function allowedPages() {
  return demoUsers[currentRole].pages;
}

function canOpenPage(pageId) {
  return allowedPages().includes(pageId);
}

function applyRoleAccess() {
  const pagesForRole = allowedPages();
  profileRole.textContent = demoUsers[currentRole].label;

  navItems.forEach((item) => {
    const allowed = pagesForRole.includes(item.dataset.page);
    item.classList.toggle("is-hidden", !allowed);
  });

  document.querySelectorAll("[data-roles]").forEach((element) => {
    const allowedRoles = element.dataset.roles.split(" ");
    element.classList.toggle("is-hidden", !allowedRoles.includes(currentRole));
  });
}

function showPage(pageId) {
  if (!canOpenPage(pageId)) {
    pageId = demoUsers[currentRole].home;
  }

  pageSections.forEach((page) => page.classList.toggle("active", page.id === pageId));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.page === pageId));
  pageTitle.textContent = pages[pageId] || "Prototipo";
  window.location.hash = pageId;
}

function showToast() {
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function showApp() {
  loginScreen.classList.add("is-hidden");
  appShell.classList.remove("is-hidden");
  applyRoleAccess();
}

function showLogin() {
  appShell.classList.add("is-hidden");
  loginScreen.classList.remove("is-hidden");
  loginPassword.value = "";
  loginError.classList.remove("show");
  loginUser.focus();
}

function setToastMessage(message) {
  toast.textContent = message;
  showToast();
}

function fieldId(stepIndex, questionIndex) {
  return `q-${stepIndex}-${questionIndex}`;
}

function clearPatientAnswers() {
  Object.keys(patientAnswers).forEach((key) => delete patientAnswers[key]);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getQuestionAnswer(stepIndex, questionIndex) {
  return patientAnswers[fieldId(stepIndex, questionIndex)];
}

function answerValues(label) {
  const answer = findAnswerByLabel(label);
  if (!answer) {
    return [];
  }

  return Array.isArray(answer.value) ? answer.value : [answer.value];
}

function isQuestionVisible(question) {
  if (!question.showWhen) {
    return true;
  }

  const rule = question.showWhen;
  const values = answerValues(rule.label);
  if (rule.includes && !values.includes(rule.includes)) {
    return false;
  }

  if (rule.notIncludes && values.includes(rule.notIncludes)) {
    return false;
  }

  if (rule.any && values.length === 0) {
    return false;
  }

  return true;
}

function normalizeTextField(field) {
  const lowered = field.value.toLowerCase();
  if (field.value === lowered) {
    return;
  }

  const start = field.selectionStart;
  const end = field.selectionEnd;
  field.value = lowered;
  if (typeof field.setSelectionRange === "function" && start !== null && end !== null) {
    field.setSelectionRange(start, end);
  }
}

function fileNameFromSignature() {
  return signatureFile.files.length ? signatureFile.files[0].name : "";
}

function optionLabelFromStoredValue(value) {
  return String(value).split(":")[0];
}

function frequencyCountFromStoredValue(value) {
  if (String(value).includes("sin especificar")) {
    return "";
  }

  const match = String(value).match(/: ([^ ]+)/);
  return match ? match[1] : "";
}

function saveCurrentAnswers() {
  const section = guideSections[currentQuestionStep];
  section.questions.forEach((question, questionIndex) => {
    if (question.type === "section") {
      return;
    }

    const id = fieldId(currentQuestionStep, questionIndex);
    if (!isQuestionVisible(question)) {
      delete patientAnswers[id];
      return;
    }

    let value = "";
    if (question.type === "radio" || question.type === "check") {
      value = Array.from(questionnaireFields.querySelectorAll(`input[name="${id}"]:checked`)).map((input) => input.value);
    } else if (question.type === "frequency") {
      value = Array.from(questionnaireFields.querySelectorAll(`input[name="${id}"]:checked`)).map((input) => {
        const countField = questionnaireFields.querySelector(`[name="${id}-${input.dataset.optionIndex}-count"]`);
        const option = question.options[Number(input.dataset.optionIndex)];
        const count = countField && countField.value ? countField.value : "sin especificar";
        return `${option.label}: ${count} ${option.unit}`;
      });
    } else {
      const field = questionnaireFields.querySelector(`[name="${id}"]`);
      value = field ? field.value.trim() : "";
    }

    patientAnswers[id] = {
      section: section.title,
      label: question.label,
      type: question.type,
      value
    };
  });
}

function answerText(answer) {
  if (!answer) {
    return "";
  }

  return Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
}

function findAnswerByLabel(label) {
  return Object.values(patientAnswers).reverse().find((answer) => answer.label === label);
}

function renderSummaryList(items, emptyText) {
  if (!items.length) {
    return `<p class="summary-empty">${emptyText}</p>`;
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function buildPatientSummary() {
  const profileLabels = ["Nombre", "Edad", "Sexo", "Escolaridad", "Institución"];
  const profile = profileLabels
    .map((label) => {
      const value = answerText(findAnswerByLabel(label));
      return value ? `<span><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>` : "";
    })
    .filter(Boolean);

  const riskLabels = [
    "Sistema auditivo: problemas auditivos",
    "Sistema ocular: problemas visuales",
    "Recuerda algún problema o aspecto relevante referente a la salud",
    "Sufrimiento fetal",
    "Alteraciones/enfermedades durante el embarazo",
    "Toxicomanías durante el embarazo",
    "Malformaciones congénitas",
    "Presencia de caries",
    "Usa aparatos de ortodoncia",
    "Tiene problemas para el aprendizaje",
    "Trabaja para aportar a los gastos familiares",
    "Deficientes recursos económicos para asistir a la escuela",
    "Ha vivido alguna pérdida importante",
    "Requiere cuidados específicos preventivos y reguladores"
  ];
  const riskOptions = ["Incompleto", "Regular", "Mala", "Disminuido", "Ausente", "Anormal", "Irregular", "Dismenorrea", "Falta de tiempo", "Falta de dinero", "Dificultad para el traslado", "Cambio de residencia", "Casa", "Colegio/Escuela", "Familia", "Ingresos", "Se enferma con frecuencia", "Presenta problemas psicológicos", "Tiene enfermedad crónica", "Pesticidas", "Bióxido de carbono", "Zona insalubre", "Es adicto", "Convive con adictos", "Adicciones en su entorno o usuario"];
  const protectiveNoLabels = [
    "Control prenatal",
    "Conocimientos sobre prevención de accidentes en el hogar",
    "Las sustancias tóxicas guardadas en el hogar están fuera del alcance de los niños",
    "Los medicamentos están en resguardo"
  ];
  const importantPoints = [];

  Object.values(patientAnswers).forEach((answer) => {
    const values = Array.isArray(answer.value) ? answer.value : [];
    if (riskLabels.includes(answer.label) && values.includes("Sí")) {
      importantPoints.push(`<strong>${escapeHtml(answer.section)}:</strong> ${escapeHtml(answer.label)} - Sí`);
    }

    const selectedRiskOptions = values.filter((value) => riskOptions.includes(value));
    if (selectedRiskOptions.length) {
      importantPoints.push(`<strong>${escapeHtml(answer.section)}:</strong> ${escapeHtml(answer.label)} - ${escapeHtml(selectedRiskOptions.join(", "))}`);
    }

    if (protectiveNoLabels.includes(answer.label) && values.includes("No")) {
      importantPoints.push(`<strong>${escapeHtml(answer.section)}:</strong> ${escapeHtml(answer.label)} - No`);
    }
  });

  const notes = Object.values(patientAnswers)
    .filter((answer) => !Array.isArray(answer.value) && answer.value)
    .filter((answer) => /especific|otro|causa|problema|pérdida|enfermedad|grupo|actividad|método|duelo/i.test(answer.label))
    .map((answer) => `<strong>${escapeHtml(answer.label)}:</strong> ${escapeHtml(answer.value)}`);

  return `
    <section class="summary-card">
      <h3>Datos principales</h3>
      <div class="summary-profile">
        ${profile.length ? profile.join("") : "<span>Sin datos descriptivos capturados.</span>"}
      </div>
    </section>
    <section class="summary-card alert">
      <h3>Puntos que requieren atención</h3>
      ${renderSummaryList(importantPoints, "No se marcaron alertas principales en las respuestas capturadas.")}
    </section>
    <section class="summary-card">
      <h3>Notas y especificaciones</h3>
      ${renderSummaryList(notes, "No se agregaron especificaciones abiertas.")}
    </section>
  `;
}

function renderQuestion(question, stepIndex, questionIndex) {
  if (!isQuestionVisible(question)) {
    return "";
  }

  if (question.type === "section") {
    return `<div class="question-card section-note"><strong>${escapeHtml(question.label)}</strong></div>`;
  }

  const id = fieldId(stepIndex, questionIndex);
  const savedAnswer = getQuestionAnswer(stepIndex, questionIndex);
  if (question.type === "radio" || question.type === "check") {
    const inputType = question.type === "radio" ? "radio" : "checkbox";
    const savedValues = savedAnswer && Array.isArray(savedAnswer.value) ? savedAnswer.value : [];
    const options = question.options.map((option) => `
      <label>
        <input type="${inputType}" name="${id}" value="${escapeHtml(option)}" ${savedValues.includes(option) ? "checked" : ""}>
        ${escapeHtml(option)}
      </label>
    `).join("");

    return `
      <div class="question-card">
        <strong>${escapeHtml(question.label)}</strong>
        <div class="option-row">${options}</div>
      </div>
    `;
  }

  if (question.type === "frequency") {
    const savedValues = savedAnswer && Array.isArray(savedAnswer.value) ? savedAnswer.value : [];
    const options = question.options.map((option, optionIndex) => {
      const storedValue = savedValues.find((value) => optionLabelFromStoredValue(value) === option.label);
      const isChecked = Boolean(storedValue);
      const count = storedValue ? frequencyCountFromStoredValue(storedValue) : "";

      return `
        <label class="frequency-option">
          <span>
            <input type="checkbox" name="${id}" value="${escapeHtml(option.label)}" data-option-index="${optionIndex}" ${isChecked ? "checked" : ""}>
            ${escapeHtml(option.label)}
          </span>
          <input type="number" min="0" inputmode="numeric" name="${id}-${optionIndex}-count" value="${escapeHtml(count)}" placeholder="0" ${isChecked ? "" : "disabled"}>
          <small>${escapeHtml(option.unit)}</small>
        </label>
      `;
    }).join("");

    return `
      <div class="question-card">
        <strong>${escapeHtml(question.label)}</strong>
        <div class="frequency-grid">${options}</div>
      </div>
    `;
  }

  if (question.type === "textarea") {
    return `
      <label class="question-card">
        <strong>${escapeHtml(question.label)}</strong>
        <textarea rows="3" name="${id}" placeholder="Escriba la respuesta">${savedAnswer ? escapeHtml(savedAnswer.value) : ""}</textarea>
      </label>
    `;
  }

  return `
    <label class="question-card">
      <strong>${escapeHtml(question.label)}</strong>
      <input type="${question.type === "date" ? "date" : "text"}" name="${id}" value="${savedAnswer ? escapeHtml(savedAnswer.value) : ""}" placeholder="Respuesta">
    </label>
  `;
}

function syncExclusiveOptions(changedInput) {
  const exclusiveValues = ["Normal", "No peligros", "Aún no lo presenta"];
  const group = Array.from(questionnaireFields.querySelectorAll(`input[name="${changedInput.name}"]`));
  if (!changedInput.checked) {
    return;
  }

  if (exclusiveValues.includes(changedInput.value)) {
    group.forEach((input) => {
      if (input !== changedInput) {
        input.checked = false;
      }
    });
    return;
  }

  group.forEach((input) => {
    if (exclusiveValues.includes(input.value)) {
      input.checked = false;
    }
  });
}

function bindQuestionEvents() {
  questionnaireFields.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      syncExclusiveOptions(input);
      if (input.dataset.optionIndex !== undefined) {
        const countField = questionnaireFields.querySelector(`[name="${input.name}-${input.dataset.optionIndex}-count"]`);
        if (countField) {
          countField.disabled = !input.checked;
          if (!input.checked) {
            countField.value = "";
          } else {
            countField.focus();
          }
        }
      }

      saveCurrentAnswers();
      renderQuestionStep();
    });
  });
}

function renderQuestionStep() {
  captureFinished = false;
  const section = guideSections[currentQuestionStep];
  questionnaireTitle.textContent = section.title;
  questionnaireHint.textContent = section.hint;
  currentSectionName.textContent = section.title;
  stepCounter.textContent = `${currentQuestionStep + 1} de ${guideSections.length}`;
  questionnaireProgress.style.width = `${((currentQuestionStep + 1) / guideSections.length) * 100}%`;
  questionnaireFields.innerHTML = section.questions.map((question, questionIndex) => renderQuestion(question, currentQuestionStep, questionIndex)).join("");
  bindQuestionEvents();
  prevQuestionStep.disabled = currentQuestionStep === 0;
  prevQuestionStep.textContent = "Anterior";
  nextQuestionStep.textContent = currentQuestionStep === guideSections.length - 1 ? "Guardar datos del paciente" : "Seguir";
}

function renderPatientSummary() {
  captureFinished = true;
  questionnaireTitle.textContent = "Resumen inmedíato del paciente";
  questionnaireHint.textContent = "Revisión automatica de los datos relevantes capturados en la guia.";
  currentSectionName.textContent = "Resumen final";
  stepCounter.textContent = "Completo";
  questionnaireProgress.style.width = "100%";
  questionnaireFields.innerHTML = buildPatientSummary();
  prevQuestionStep.disabled = false;
  prevQuestionStep.textContent = "Editar respuestas";
  nextQuestionStep.textContent = "Guardar expediente";
}

function changeQuestionStep(direction) {
  if (captureFinished) {
    if (direction < 0) {
      currentQuestionStep = guideSections.length - 1;
      renderQuestionStep();
      consentPage.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setToastMessage("Resumen y expediente guardados en el cascaron del prototipo.");
    return;
  }

  saveCurrentAnswers();

  if (direction > 0 && currentQuestionStep === guideSections.length - 1) {
    renderPatientSummary();
    setToastMessage("Resumen inmedíato generado.");
    return;
  }

  currentQuestionStep = Math.min(Math.max(currentQuestionStep + direction, 0), guideSections.length - 1);
  renderQuestionStep();
  consentPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.closest("#captura") && !captureFinished) {
      saveCurrentAnswers();
    }

    setToastMessage("Datos guardados en el cascaron del prototipo.");
  });
});

consentPage.addEventListener("input", (event) => {
  const field = event.target;
  const isTextInput = field.matches('input[type="text"], input:not([type]), textarea');
  if (isTextInput) {
    normalizeTextField(field);
  }
});

if (signatureFile) {
  signatureFile.addEventListener("change", () => {
    const fileName = fileNameFromSignature();
    signatureFileName.textContent = fileName ? `Firma adjunta: ${fileName}` : "Adjuntar imagen de firma digital del tutor";
  });
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = loginUser.value.trim().toLowerCase();
  const password = loginPassword.value.trim().toLowerCase();
  const account = demoUsers[user];

  if (account && password === account.password) {
    currentRole = user;
    loginError.classList.remove("show");
    showApp();
    showPage(account.home);
    setToastMessage(`Bienvenido, ${account.label.toLowerCase()}.`);
    return;
  }

  loginError.classList.add("show");
});

logoutButton.addEventListener("click", () => {
  showLogin();
});

saveConsent.addEventListener("click", () => {
  if (!consentCheck.checked) {
    setToastMessage("Marca la autorización del tutor para continuar.");
    return;
  }

  consentPage.classList.add("consent-ready");
  clearPatientAnswers();
  currentQuestionStep = 0;
  captureFinished = false;
  renderQuestionStep();
  captureStatus.textContent = "Folio automatico";
  captureStatus.classList.remove("red");
  consentPage.scrollIntoView({ behavior: "smooth", block: "start" });
  setToastMessage("Consentimiento guardado. Ya puedes capturar los datos del paciente.");
});

backToConsent.addEventListener("click", () => {
  consentPage.classList.remove("consent-ready");
  captureStatus.textContent = "Bloqueado";
  consentPage.scrollIntoView({ behavior: "smooth", block: "start" });
});

prevQuestionStep.addEventListener("click", () => changeQuestionStep(-1));
nextQuestionStep.addEventListener("click", () => changeQuestionStep(1));

const initialPage = window.location.hash.replace("#", "");
if (pages[initialPage]) {
  showPage(initialPage);
}

renderQuestionStep();
showLogin();

