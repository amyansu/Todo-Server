const express = require('express')
const app = express()
var cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json())

let todos = [];

app.get('/todos', (req, res) => {
    res.json({ todo: todos });
})

app.post('/add', (req, res) => {
    const todo = {
        title: req.body.title,
        check: false,
        id: Math.floor(Math.random() * 1000000)
    }
    todos.push(todo);
    res.json({ todo: todo })
})

app.put('/checkbox/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.map((item) => {
        return item.id !== id ? item : { ...item, check: !item.check }
    })
    res.json({ id:id })
});

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.json({ id:id })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})