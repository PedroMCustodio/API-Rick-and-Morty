const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios' });
  }

  const exists = users.find(u => u.username === username);
  if (exists) return res.status(409).json({ error: 'Usuário já existe' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, favorites: [] });
  res.status(201).json({ message: 'Usuário registrado com sucesso' });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { register, login, users };
