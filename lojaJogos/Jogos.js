const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

const db = require('./db');

app.use(express.json());

app.get('/jogosAPI', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jogos');
    res.json(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar jogos.');
  }
});

app.get('/jogosAPI/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send('ID inválido.');
  try {
    const [rows] = await db.query('SELECT * FROM jogos WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Jogo não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao buscar jogo.');
  }
});


app.post('/jogosAPI', async (req, res) => {
  const { nome, genero } = req.body;
  if (!nome || !genero) return res.status(400).send('Nome e gênero são obrigatórios.');
  try {
    const [result] = await db.query('INSERT INTO jogos (nome, genero) VALUES (?, ?)', [nome, genero]);
    res.status(201).json({ id: result.insertId, nome, genero });
  } catch (error) {
    res.status(500).send('Erro ao adicionar jogo.');
  }
});


app.put('/jogosAPI/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, genero } = req.body;
  if (isNaN(id) || !nome || !genero) return res.status(400).send('Dados inválidos.');
  try {
    const [result] = await db.query('UPDATE jogos SET nome = ?, genero = ? WHERE id = ?', [nome, genero, id]);
    if (result.affectedRows > 0) {
      const [updated] = await db.query('SELECT * FROM jogos WHERE id = ?', [id]);
      res.json(updated[0]);
    } else {
      res.status(404).send('Jogo não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao atualizar jogo.');
  }
});


app.patch('/jogosAPI/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, genero } = req.body;
  if (isNaN(id)) return res.status(400).send('ID inválido.');
  try {
    const [exist] = await db.query('SELECT * FROM jogos WHERE id = ?', [id]);
    if (exist.length === 0) return res.status(404).send('Jogo não encontrado.');

    let fields = [];
    let values = [];
    if (nome !== undefined) {
      fields.push('nome = ?');
      values.push(nome);
    }
    if (genero !== undefined) {
      fields.push('genero = ?');
      values.push(genero);
    }
    if (fields.length === 0) return res.status(400).send('Nenhum campo fornecido.');

    values.push(id);
    const query = `UPDATE jogos SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [updated] = await db.query('SELECT * FROM jogos WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).send('Erro ao atualizar parcialmente.');
  }
});


app.delete('/jogosAPI/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send('ID inválido.');
  try {
    const [result] = await db.query('DELETE FROM jogos WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send('Jogo não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao excluir jogo.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});