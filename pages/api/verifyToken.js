import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
}
