require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

app.use(express.json());

app.use(requestLogger);

app.use(cors());

app.use(express.static("build"));

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
};

app.post("/api/notes", (request, response) => {
    const body = request.body;

    if (body.content === undefined) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    });
});

app.get("/api/notes", (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    });
});

app.delete("/api/notes/:id", (request, response) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note);
    });
});

app.put("/api/notes/:id", (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important,
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const myUrl = process.env.MONGODB_URL;

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
