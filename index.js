import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const { Pool } = pkg;

app.use(cors());

app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'diary',
    password: 'root',
    port: 5432
})

app.get('/entries', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM entries ORDER BY date DESC");
        console.log("Fetched entries: ", result.rows);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/entry/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM entries WHERE id = $1", [id]);
        console.log("Fetched entry: ", result.rows);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post('/entries', async (req, res) => {
    const { title, date, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO entries (title, date, content) VALUES ($1, $2, $3) RETURNING *',
            [title, date, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/entries/:id', async (req, res) => {
    const { id } = req.params;
    const { title, date, content } = req.body;
    try {
        const result = await pool.query(
            "UPDATE entries SET title = $1, date = $2, content = $3 WHERE id = $4 RETURNING *",
            [title, date, content, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Entry not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating entry:', err);  // Log error details
        res.status(500).send(`Error: ${err.message}`);
    }
});


app.delete('/entries/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM entries WHERE id = $1", [id]);
        res.json({message: "Entry deleted successfully"});
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});