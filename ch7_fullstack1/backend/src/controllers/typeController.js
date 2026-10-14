const prisma = require("../db/prisma");

// GET /api/type
// ดึงชนิดทั้งหมด (สามารถ include เมนูที่อยู่ภายใต้ type ได้)
const getAllTypes = async (req, res) => {
  try {
    const { includeMenus } = req.query;
    // Default include menus, หรือกำหนดผ่าน query param ?includeMenus=false เพื่อปิด
    const shouldIncludeMenus = includeMenus !== "false";

    const types = await prisma.type.findMany({
      include: {
        menus: shouldIncludeMenus,
      },
      orderBy: {
        typeId: "asc",
      },
    });

    return res.status(200).json(types);
  } catch (error) {
    console.error("Error in getAllTypes:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลชนิดอาหาร",
      error: error.message,
    });
  }
};

// GET /api/type/:id
// ดึงชนิดอาหารตาม typeId
const getTypeById = async (req, res) => {
  try {
    const typeId = Number(req.params.id);
    if (isNaN(typeId)) {
      return res.status(400).json({ message: "typeId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    const typeData = await prisma.type.findUnique({
      where: { typeId },
      include: {
        menus: true,
      },
    });

    if (!typeData) {
      return res.status(404).json({ message: "ไม่พบข้อมูลชนิดอาหารนี้" });
    }

    return res.status(200).json(typeData);
  } catch (error) {
    console.error("Error in getTypeById:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลชนิดอาหาร",
      error: error.message,
    });
  }
};

// POST /api/type
// รับ body { name } เพื่อเพิ่มชนิดใหม่
const createType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "กรุณาระบุชื่อชนิดอาหาร (name)" });
    }

    const newType = await prisma.type.create({
      data: {
        name: name.trim(),
      },
    });

    return res.status(201).json({
      message: "เพิ่มชนิดอาหารเรียบร้อยแล้ว",
      data: newType,
    });
  } catch (error) {
    console.error("Error in createType:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการเพิ่มชนิดอาหาร",
      error: error.message,
    });
  }
};

// PUT /api/type/:id
// อัปเดตข้อมูลตาม typeId
const updateType = async (req, res) => {
  try {
    const typeId = Number(req.params.id);
    if (isNaN(typeId)) {
      return res.status(400).json({ message: "typeId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "กรุณาระบุชื่อชนิดอาหาร (name)" });
    }

    // ตรวจสอบว่ามีข้อมูลอยู่จริงหรือไม่
    const existingType = await prisma.type.findUnique({
      where: { typeId },
    });

    if (!existingType) {
      return res.status(404).json({ message: "ไม่พบข้อมูลชนิดอาหารที่ต้องการอัปเดต" });
    }

    const updatedType = await prisma.type.update({
      where: { typeId },
      data: {
        name: name.trim(),
      },
    });

    return res.status(200).json({
      message: "อัปเดตข้อมูลชนิดอาหารเรียบร้อยแล้ว",
      data: updatedType,
    });
  } catch (error) {
    console.error("Error in updateType:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการอัปเดตชนิดอาหาร",
      error: error.message,
    });
  }
};

// DELETE /api/type/:id
// ลบข้อมูลตาม typeId
const deleteType = async (req, res) => {
  try {
    const typeId = Number(req.params.id);
    if (isNaN(typeId)) {
      return res.status(400).json({ message: "typeId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    // ตรวจสอบว่ามีข้อมูลอยู่จริงหรือไม่
    const existingType = await prisma.type.findUnique({
      where: { typeId },
    });

    if (!existingType) {
      return res.status(404).json({ message: "ไม่พบข้อมูลชนิดอาหารที่ต้องการลบ" });
    }

    await prisma.type.delete({
      where: { typeId },
    });

    return res.status(200).json({
      message: "ลบชนิดอาหารเรียบร้อยแล้ว",
      typeId,
    });
  } catch (error) {
    console.error("Error in deleteType:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการลบชนิดอาหาร",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
};
