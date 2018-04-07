const fs = require('fs');
const DB_FILENAME = "quizzes.json";

let quizzes = [
    {
        question: "Capital de Italia",
        answer: "Roma"
    },
    {
        question: "Capital de Francia",
        answer: "Paris"
    },
    {
        question: "Capital de España",
        answer: "Madrid"
    },
    {
        question: "Capital de Portugal",
        answer: "Lisboa"
    }
];

const save = () => {
    fs.writeFile(DB_FILENAME,
        JSON.stringify(quizzes),
        err => {
            if (err) throw err;
        });
};

const load = () => {
    fs.readFile(DB_FILENAME, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                save();
                return;
            }
            throw err;
        }
        let json = JSON.parse(data);
        if (json) {
            quizzes = json;
        }
    });
};

exports.count = () => quizzes.length;

exports.add = (question, answer) => {
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};

exports.update = (id, question, answer) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id=${id} no es válido.`);
    }
    quizzes.splice(1, id, {
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};

exports.getAll = () => JSON.parse(JSON.stringify(quizzes));


exports.getByIndex = (id) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id=${id} no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};


exports.deleteByIndex = (id) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id=${id} no es válido.`);
    }
    quizzes.splice(id, 1);
    save();
};

load();

