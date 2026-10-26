const prisma = require("../db/prisma");

// GET /api/menu
// ดึงรายการเมนูทั้งหมด พร้อม include: { type: true } และรองรับ query search keyword ตามชื่อเมนู
const getAllMenus = async (req, res) => {
  try {
    const { search, keyword, typeId } = req.query;
    const searchKeyword = search || keyword;

    const where = {};

    // ค้นหาตามชื่อเมนูด้วย keyword
    if (searchKeyword && typeof searchKeyword === "string" && searchKeyword.trim()) {
      where.name = {
        contains: searchKeyword.trim(),
      };
    }

    // กรองตามประเภทอาหารเพิ่มเติมได้ถ้ามีการส่ง query typeId มา
    if (typeId) {
      const parsedTypeId = Number(typeId);
      if (!isNaN(parsedTypeId)) {
        where.typeId = parsedTypeId;
      }
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        type: true,
      },
      orderBy: {
        menuId: "desc",
      },
    });

    return res.status(200).json(menus);
  } catch (error) {
    console.error("Error in getAllMenus:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนูอาหาร",
      error: error.message,
    });
  }
};

// GET /api/menu/:id
// ดึงข้อมูลเมนูตาม menuId พร้อม include type
const getMenuById = async (req, res) => {
  try {
    const menuId = Number(req.params.id);
    if (isNaN(menuId)) {
      return res.status(400).json({ message: "menuId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    const menuData = await prisma.menu.findUnique({
      where: { menuId },
      include: {
        type: true,
      },
    });

    if (!menuData) {
      return res.status(404).json({ message: "ไม่พบข้อมูลเมนูอาหารนี้" });
    }

    return res.status(200).json(menuData);
  } catch (error) {
    console.error("Error in getMenuById:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนูอาหาร",
      error: error.message,
    });
  }
};

// POST /api/menu
// รับ body { name, price, isBestSeller, typeId } และบันทึกลงฐานข้อมูล (แปลง typeId และ price เป็น number)
const createMenu = async (req, res) => {
  try {
    const { name, price, isBestSeller, typeId } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "กรุณาระบุชื่อเมนูอาหาร (name)" });
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({ message: "กรุณาระบุราคาอาหารที่ถูกต้อง (price)" });
    }

    if (typeId === undefined || typeId === null || isNaN(Number(typeId))) {
      return res.status(400).json({ message: "กรุณาระบุชนิดอาหารที่ถูกต้อง (typeId)" });
    }

    const parsedPrice = Number(price);
    const parsedTypeId = Number(typeId);
    const parsedIsBestSeller =
      isBestSeller === true ||
      isBestSeller === "true" ||
      isBestSeller === 1 ||
      isBestSeller === "1";

    // ตรวจสอบว่ามี typeId อยู่จริงหรือไม่
    const existingType = await prisma.type.findUnique({
      where: { typeId: parsedTypeId },
    });

    if (!existingType) {
      return res.status(404).json({ message: "ไม่พบชนิดอาหารที่ระบุ (typeId ไม่ถูกต้อง)" });
    }

    const newMenu = await prisma.menu.create({
      data: {
        name: name.trim(),
        price: parsedPrice,
        isBestSeller: parsedIsBestSeller,
        typeId: parsedTypeId,
      },
      include: {
        type: true,
      },
    });

    return res.status(201).json({
      message: "เพิ่มเมนูอาหารเรียบร้อยแล้ว",
      data: newMenu,
    });
  } catch (error) {
    console.error("Error in createMenu:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสร้างเมนูอาหาร",
      error: error.message,
    });
  }
};

// PUT /api/menu/:id
// อัปเดตเมนูตาม menuId
const updateMenu = async (req, res) => {
  try {
    const menuId = Number(req.params.id);
    if (isNaN(menuId)) {
      return res.status(400).json({ message: "menuId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    // ตรวจสอบว่ามีข้อมูลเดิมอยู่หรือไม่
    const existingMenu = await prisma.menu.findUnique({
      where: { menuId },
    });

    if (!existingMenu) {
      return res.status(404).json({ message: "ไม่พบข้อมูลเมนูอาหารที่ต้องการแก้ไข" });
    }

    const { name, price, isBestSeller, typeId } = req.body;
    const dataToUpdate = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "ชื่อเมนูอาหารไม่สามารถเป็นค่าว่างได้" });
      }
      dataToUpdate.name = name.trim();
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({ message: "ราคาอาหารต้องเป็นตัวเลขที่ถูกต้อง" });
      }
      dataToUpdate.price = parsedPrice;
    }

    if (isBestSeller !== undefined) {
      dataToUpdate.isBestSeller =
        isBestSeller === true ||
        isBestSeller === "true" ||
        isBestSeller === 1 ||
        isBestSeller === "1";
    }

    if (typeId !== undefined) {
      const parsedTypeId = Number(typeId);
      if (isNaN(parsedTypeId)) {
        return res.status(400).json({ message: "typeId ต้องเป็นตัวเลขที่ถูกต้อง" });
      }

      const existingType = await prisma.type.findUnique({
        where: { typeId: parsedTypeId },
      });

      if (!existingType) {
        return res.status(404).json({ message: "ไม่พบชนิดอาหารที่ระบุ (typeId ไม่ถูกต้อง)" });
      }

      dataToUpdate.typeId = parsedTypeId;
    }

    const updatedMenu = await prisma.menu.update({
      where: { menuId },
      data: dataToUpdate,
      include: {
        type: true,
      },
    });

    return res.status(200).json({
      message: "อัปเดตข้อมูลเมนูอาหารเรียบร้อยแล้ว",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Error in updateMenu:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการอัปเดตเมนูอาหาร",
      error: error.message,
    });
  }
};

// DELETE /api/menu/:id
// ลบเมนูตาม menuId
const deleteMenu = async (req, res) => {
  try {
    const menuId = Number(req.params.id);
    if (isNaN(menuId)) {
      return res.status(400).json({ message: "menuId ไม่ถูกต้อง ต้องเป็นตัวเลข" });
    }

    // ตรวจสอบว่ามีข้อมูลอยู่จริงหรือไม่
    const existingMenu = await prisma.menu.findUnique({
      where: { menuId },
    });

    if (!existingMenu) {
      return res.status(404).json({ message: "ไม่พบข้อมูลเมนูอาหารที่ต้องการลบ" });
    }

    await prisma.menu.delete({
      where: { menuId },
    });

    return res.status(200).json({
      message: "ลบเมนูอาหารเรียบร้อยแล้ว",
      menuId,
    });
  } catch (error) {
    console.error("Error in deleteMenu:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการลบเมนูอาหาร",
      error: error.message,
    });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
