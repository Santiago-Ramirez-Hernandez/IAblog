//--------------Declaración de variables con elementos HTML
const quizContainer = document.getElementById("quizContainer");
const quizSection = document.getElementById("quizC");
const quizQuestion = document.getElementById("quizQuestion");
const options = document.getElementsByName("quiz-answer");
const quizResultContainer = document.getElementById("quizResult");
const resultText = document.getElementById("resultText");
const resultBtn = document.getElementById("subirRespuesta");
let optLabels = [];
const opcA = document.getElementById("opcA");
optLabels.push(opcA);
const opcB = document.getElementById("opcB");
optLabels.push(opcB);
const opcC = document.getElementById("opcC");
optLabels.push(opcC);
const opcD = document.getElementById("opcD");
optLabels.push(opcD);

let quiz;

//---------Obtención de datos de la BD
//Obtener el id de el cuestionario
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');

// Función para cargar el cuestionario desde la base de datos usando el ID
async function getQuiz(quizId) {
    try {
        // Primero, obtener las preguntas del cuestionario
        const response = await fetch(`http://localhost:4000/api/questions/${quizId}`);
        if (!response.ok) {
            throw new Error('Error al cargar las preguntas');
        }
        const quizData = await response.json();
        console.log(quizData);
        
        // Crear un arreglo de promesas para obtener las respuestas de cada pregunta
        const questionsAnswers = await Promise.all(quizData.map(async (question) => {
            const response = await fetch(`http://localhost:4000/api/answers/${question.questionid}`);
            if (!response.ok) {
                throw new Error('Error al cargar las respuestas');
            }
            return await response.json(); // Devolver las respuestas
        }));
        
        console.log(questionsAnswers);
        
        return formatQuizData(quizData, questionsAnswers);
    } catch (error) {
        console.error('Error al cargar el cuestionario:', error);
        return null; // Retornar null en caso de error
    }
}

function formatQuizData(questions, answers) {
    // Crear un objeto para el quiz
    const quiz = {
        questions: []
    };

    // Iterar sobre cada pregunta
    questions.forEach((question) => {
        // Buscar las respuestas correspondientes a la pregunta actual
        const questionAnswers = answers[questions.indexOf(question)];

        // Crear un objeto para la pregunta en el formato deseado
        const quizQuestion = {
            question: question.questioncontent,
            options: {},
            answer: null,
            score: question.score
        };

        // Rellenar las opciones y determinar la respuesta correcta
        questionAnswers.forEach((answer, index) => {
            const optionKey = String.fromCharCode(97 + index); // 'a' es 97 en ASCII
            quizQuestion.options[optionKey] = answer.answercontent;

            if (answer.iscorrect) {
                quizQuestion.answer = index;
            }
        });

        quiz.questions.push(quizQuestion);
    });
    return quiz;
}

// Llamada a la función getQuiz y espera su resultado
getQuiz(quizId).then(data => {
    if (data) {
        quiz = data; // Solo asignar si data no es null
        console.log(quiz);
        generateQuestion(index); // Asegúrate de llamar a generateQuestion aquí
    } else {
        console.error("No se pudo obtener el cuestionario.");
    }
});

// Lógica de verificación de datos
const answers = [];
let index = 0;

// Agregar funcionamiento de radio buttons
for (const opt of options) {
    opt.addEventListener('click', saveAnswer);
}

// Agregar lógica de botones
const submitBtn = document.getElementById("submitBtn");

const lastBtn = document.getElementById("lastBtn");
lastBtn.addEventListener('click', () => {
    index = Math.max(index - 1, 0); // Asegurarse de que index no sea menor que 0
    generateQuestion(index);
    cleanAnswers();
});

const nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener('click', () => {
    if (quiz && index < quiz.questions.length - 1) {
        index++;
        generateQuestion(index);
        cleanAnswers();
    } else {
        console.log("Última pregunta");
    }
});

submitBtn.addEventListener('click', testResults);

// Funciones
function cleanAnswers() {
    if (answers[index] == null) {
        options.forEach(opt => { opt.checked = false });
    } else {
        options[answers[index]].checked = true;
    }
}

function saveAnswer() {
    let selected = "";
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selected = i;
            break; // Salir del bucle una vez encontrado
        }
    }
    if (selected !== "") {
        answers[index] = selected;
    }
}

function generateQuestion(index) {
    if (quiz) { // Verificar si quiz está definido
        quizQuestion.textContent = quiz.questions[index].question;
        opcA.textContent = quiz.questions[index].options.a;
        opcB.textContent = quiz.questions[index].options.b;
        opcC.textContent = quiz.questions[index].options.c;
        opcD.textContent = quiz.questions[index].options.d;
    }
}

function testResults() {
    let counter = 0;
    for (let i = 0; i < quiz.questions.length; i++) { 
        if (answers[i] == quiz.questions[i].answer) {
            counter++;
        }
    }
    quizSection.style.display = "none";
    resultText.innerText = counter + "/" + quiz.questions.length;
    quizResultContainer.style.display = "block";

    console.log("Resultados:", counter);
}

// Ejecución
const timer = setInterval(() => {
    if (quiz) { // Comprobar si quiz está definido
        // Comprobar límite de preguntas para activar o desactivar botones
        nextBtn.style.display = index === quiz.questions.length - 1 ? "none" : "block";
        lastBtn.style.display = index === 0 ? "none" : "block";

        //Comprobar preguntas respondidas para activar el botón de finalización
    let emptyanswers = 0;
    for (const answer of answers) {
        if (answer == null) {
            emptyanswers +=1;
        }
    }
    if(answers.length == quiz.questions.length && emptyanswers==0)
        submitBtn.disabled = false;
    }
}, 10);
