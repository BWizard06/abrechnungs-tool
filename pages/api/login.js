import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { username, password } = req.body;

  if (
    (username === process.env.USER1_USERNAME && password === process.env.USER1_PASSWORD) ||
    (username === process.env.USER2_USERNAME && password === process.env.USER2_PASSWORD)
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
  }
}
