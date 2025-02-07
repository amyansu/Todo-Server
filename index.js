import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { todosTable } from './db/schema.js';
import express from 'express';
import cors from 'cors';
import { desc, eq } from 'drizzle-orm';

const app = express();
const port = 3001

app.use(cors())
app.use(express.json())

const db = drizzle(process.env.DATABASE_URL);

app.get('/todos', async (req, res) => {
    const todo = await db.select().from(todosTable).orderBy(desc(todosTable.id));
    res.json({ todo: todo });
})

app.post('/add', async (req, res) => {
    const todo = await db.insert(todosTable).values({
        title: req.body.title
    }).returning();
    res.json({ todo: todo })
})

app.put('/checkbox/:id', async (req, res) => {
    const id = req.params.id;
    const checkbox = await db.select({
        checkbox: todosTable.checkbox,
      }).from(todosTable).where(eq(todosTable.id, id));
    //   console.log(checkbox)
    //   console.log(checkbox[0].checkbox)
    const todo = await db.update(todosTable).set({checkbox:!checkbox[0].checkbox}).where(eq(todosTable.id, id)).returning({ id: todosTable.id });
    res.json({ id: todo[0].id })
});

app.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const todo = await db.delete(todosTable).where(eq(todosTable.id, id)).returning({ id: todosTable.id });
    res.json({ id: todo[0].id })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})