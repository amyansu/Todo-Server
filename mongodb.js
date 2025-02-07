const express = require('express')
const app = express()
var cors = require('cors')
const mongoose = require('mongoose');
const port = 3001

app.use(cors())
app.use(express.json())

//define mongoose schema
const todoSchema = new mongoose.Schema({
    title: String,
    checkbox: Boolean
})

//define mongoose model
const Todo = mongoose.model('Todo', todoSchema)

//connect to mongodb
mongoose.connect('mongodb+srv://amyansutripathy:RZmeUbUKooeIKRra@cluster0.xfa6t.mongodb.net/todo-list')
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.get('/todos', async (req, res) => {
    const todo = await Todo.find({});
    res.json({ todo: todo });
})

app.post('/add', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        checkbox: false,
        id: Math.floor(Math.random() * 1000000)
    })
    await todo.save();
    res.json({ todo: todo })
})

app.put('/checkbox/:id', async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findById(id)
    todo.checkbox = !todo.checkbox
    await todo.save();
    res.json({ id: todo._id })
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    const todo = await Todo.findByIdAndDelete(id)
    res.json({ id: todo._id })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})