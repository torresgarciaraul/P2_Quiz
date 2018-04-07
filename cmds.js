const model = require('./model');
const {colorize, log, biglog, errorlog} = require('./out');


exports.helpCmd = (rl) => {
    log("Comandos:");
    log(" h|help - Muestra esta ayuda.");
    log(" list - Listar los quizzes existentes.");
    log(" show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log(" add - Añadir un nuevo quiz interactivamente.");
    log(" delete <id> - Borrar el quiz indicado.");
    log(" edit <id> - Editar el quiz indicado.");
    log(" test <id> - Probar el quiz indicado.");
    log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("credits - Créditos.");
    log("q|quit - Salir del programa.");
    rl.prompt();
};

exports.quitCmd = (rl) => {
    rl.close();
    rl.prompt();
};

exports.addCmd = (rl) => {
    rl.question(colorize('Introduce una pregunta: ', 'red'), question => {
        rl.question(colorize('Introduce una respuesta: ', 'red'), answer => {
            model.add(question, answer);
            log(`${colorize('Se ha añadido ', 'magenta')} ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

exports.listCmd = (rl) => {
    model.getAll().forEach((quiz, id) => {
        log(`[${colorize(id,'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};

exports.showCmd = (id, rl) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
}
;

exports.testCmd = (id, rl) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`)
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(`${colorize(quiz.question +'? ', 'red')}`, answer => {
                if (answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
                    biglog('CORRECTO', 'green');
                    rl.prompt();
                } else {
                    biglog('INCORRECTO', 'red');
                    rl.prompt();
                }
            });
        }
        catch (error) {
            errorlog(error.message)
            rl.prompt();
        }
    }
};

exports.playCmd = (rl) => {
    let score = 0;
    let toBeResolved = [];
    const indices = model.count();
    for (let i = 0; i < indices; i++) {
        toBeResolved.push(model.getByIndex(i));
    }
    const playOne = () => {
        if (toBeResolved.length <= 0) {
            log("No hay nada más que preguntar.");
            log(`Fin del juego. Aciertos: ${score}`);
            biglog(`${score}`, 'magenta');
            rl.prompt();
        } else {
            try {
                let id = Math.floor(Math.random() * toBeResolved.length);
                let quiz = toBeResolved[id];
                toBeResolved.splice(id, 1);
                rl.question(colorize(quiz.question + '? ', 'red'), answer => {
                    if (answer.trim().toLowerCase() === quiz.answer.trim().toLowerCase()) {
                        score++;
                        log(`CORRECTO - Lleva ${score} aciertos.`);
                        playOne();
                    } else {
                        log('INCORRECTO');
                        log(`Fin del juego. Aciertos: ${score}`);
                        biglog(`${score}`, 'magenta');
                        rl.prompt();
                    }
                });
            } catch (error) {
                errorlog(error.message);
                rl.prompt();
            }
        }
    }
    playOne();
};

exports.deleteCmd = (id, rl) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.editCmd = (id, rl) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},1000);
            rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},1000);
                rl.question(colorize('Introduzca una respuesta: ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


exports.creditsCmd = (rl) => {
    log('RAUL');
    rl.prompt();
};