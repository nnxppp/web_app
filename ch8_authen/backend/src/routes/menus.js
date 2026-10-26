const router = require('express').Router();
const prisma = require('../lib/prisma');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
router.get('/', async (req, res, next) => { try {
  const menus = await prisma.menu.findMany({ include: { ratings: { select: { value: true } } }, orderBy: { id: 'asc' } });
  res.json(menus.map((menu) => ({ ...menu, price: Number(menu.price), averageRating: menu.ratings.length ? Number((menu.ratings.reduce((sum, item) => sum + item.value, 0) / menu.ratings.length).toFixed(1)) : null, ratingCount: menu.ratings.length, ratings: undefined })));
} catch (err) { next(err); } });
router.post('/', requireAuth, requireAdmin, async (req, res, next) => { try { const { name, price, isBestSeller } = req.body; if (!name?.trim() || Number.isNaN(Number(price))) return res.status(400).json({ message: 'กรุณาระบุชื่อเมนูและราคาที่ถูกต้อง' }); const menu = await prisma.menu.create({ data: { name: name.trim(), price: Number(price), isBestSeller: Boolean(isBestSeller) } }); res.status(201).json(menu); } catch (err) { next(err); } });
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const id = Number(req.params.id); const current = await prisma.menu.findUnique({ where: { id } }); if (!current) return res.status(404).json({ message: 'ไม่พบเมนู' }); const data = {}; if (req.body.name !== undefined) data.name = req.body.name.trim(); if (req.body.price !== undefined) data.price = Number(req.body.price); if (req.body.isBestSeller !== undefined) data.isBestSeller = Boolean(req.body.isBestSeller); res.json(await prisma.menu.update({ where: { id }, data })); } catch (err) { next(err); } });
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const id = Number(req.params.id); await prisma.menu.delete({ where: { id } }); res.json({ message: 'ลบเมนูแล้ว' }); } catch (err) { next(err); } });
router.put('/:id/rating', requireAuth, async (req, res, next) => { try { const menuId = Number(req.params.id), value = Number(req.body.value); if (!Number.isInteger(value) || value < 1 || value > 5) return res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5' }); const rating = await prisma.rating.upsert({ where: { userId_menuId: { userId: req.user.userId, menuId } }, update: { value }, create: { value, userId: req.user.userId, menuId } }); res.json(rating); } catch (err) { next(err); } });
module.exports = router;
