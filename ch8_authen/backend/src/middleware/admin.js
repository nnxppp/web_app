module.exports = function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'หน้านี้สำหรับผู้ดูแลระบบเท่านั้น' });
  next();
};
