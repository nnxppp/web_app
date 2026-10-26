const router = require('express').Router();
const prisma = require('../lib/prisma');
const requireAuth = require('../middleware/auth');
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try { const todos = await prisma.todo.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' } }); res.json(todos); } catch (err) { next(err); }
});
router.post('/', async (req, res, next) => {
  try { const title = req.body.title?.trim(); if (!title) return res.status(400).json({ message: 'กรุณาระบุรายการงาน' }); const todo = await prisma.todo.create({ data: { title, userId: req.user.userId } }); res.status(201).json(todo); } catch (err) { next(err); }
});
router.put('/:id', async (req, res, next) => {
  try { const id = Number(req.params.id); const current = await prisma.todo.findFirst({ where: { id, userId: req.user.userId } }); if (!current) return res.status(404).json({ message: 'ไม่พบรายการงาน' }); const data = {}; if (req.body.title !== undefined) { if (!req.body.title.trim()) return res.status(400).json({ message: 'รายการงานห้ามว่าง' }); data.title = req.body.title.trim(); } if (req.body.completed !== undefined) data.completed = Boolean(req.body.completed); const todo = await prisma.todo.update({ where: { id }, data }); res.json(todo); } catch (err) { next(err); }
});
router.delete('/:id', async (req, res, next) => {
  try { const id = Number(req.params.id); const current = await prisma.todo.findFirst({ where: { id, userId: req.user.userId } }); if (!current) return res.status(404).json({ message: 'ไม่พบรายการงาน' }); await prisma.todo.delete({ where: { id } }); res.json({ message: 'ลบรายการงานแล้ว' }); } catch (err) { next(err); }
});
module.exports = router;
