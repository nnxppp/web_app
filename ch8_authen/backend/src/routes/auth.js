const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const requireAuth = require('../middleware/auth');

const safeUser = (user) => ({ id: user.id, username: user.username, email: user.email, role: user.role });
router.post('/register', async (req, res, next) => { try {
  const { username, email, password } = req.body;
  if (!username?.trim() || !email?.trim() || !password || password.length < 6) return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้ อีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษร' });
  const duplicate = await prisma.user.findFirst({ where: { OR: [{ username: username.trim() }, { email: email.trim().toLowerCase() }] } });
  if (duplicate) return res.status(409).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' });
  const role = (await prisma.user.count()) === 0 ? 'ADMIN' : 'USER';
  const user = await prisma.user.create({ data: { username: username.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 10), role } });
  res.status(201).json({ message: role === 'ADMIN' ? 'สมัครสมาชิกเรียบร้อยแล้ว คุณเป็นผู้ดูแลระบบคนแรก' : 'สมัครสมาชิกเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ' });
} catch (err) { next(err); } });
router.post('/login', async (req, res, next) => { try {
  const user = await prisma.user.findUnique({ where: { username: req.body.username?.trim() || '' } });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });
  res.json({ message: 'เข้าสู่ระบบสำเร็จ', token, user: safeUser(user) });
} catch (err) { next(err); } });
router.get('/me', requireAuth, async (req, res, next) => { try { const user = await prisma.user.findUnique({ where: { id: req.user.userId } }); if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' }); res.json({ user: safeUser(user) }); } catch (err) { next(err); } });
module.exports = router;
