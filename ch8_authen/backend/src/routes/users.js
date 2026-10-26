const router = require('express').Router();
const prisma = require('../lib/prisma');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
router.use(requireAuth, requireAdmin);
router.get('/', async (req, res, next) => { try { res.json(await prisma.user.findMany({ select: { id: true, username: true, email: true, role: true }, orderBy: { id: 'asc' } })); } catch (err) { next(err); } });
router.put('/:id/role', async (req, res, next) => { try { const id = Number(req.params.id), role = req.body.role; if (!['USER', 'ADMIN'].includes(role)) return res.status(400).json({ message: 'role ไม่ถูกต้อง' }); if (id === req.user.userId && role !== 'ADMIN') return res.status(400).json({ message: 'ไม่สามารถลดสิทธิ์ของตนเองได้' }); const user = await prisma.user.update({ where: { id }, data: { role }, select: { id: true, username: true, email: true, role: true } }); res.json(user); } catch (err) { next(err); } });
module.exports = router;
