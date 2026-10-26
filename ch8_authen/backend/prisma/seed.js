const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const menus = [
  { name: 'cake', price: 35, isBestSeller: true },
  { name: 'bread', price: 25, isBestSeller: false },
  { name: 'milk', price: 15, isBestSeller: true },
  { name: 'donut', price: 45, isBestSeller: false },
  { name: 'cookie', price: 55, isBestSeller: true },
];
async function main() {
  for (const item of menus) {
    const existing = await prisma.menu.findFirst({ where: { name: item.name } });
    if (existing) await prisma.menu.update({ where: { id: existing.id }, data: item });
    else await prisma.menu.create({ data: item });
  }
  console.log('Seeded ' + menus.length + ' menu items');
}
main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma['$disconnect']());
