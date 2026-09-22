const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const root = __dirname;
const mime = {
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function sendFile(res, file) {
  fs.readFile(path.join(root, file), (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 ไม่พบไฟล์");
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    });
    res.end(data);
  });
}

function escapeHtml(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host}`).pathname,
    );
    const item = pathname.match(/^\/item\/([^/]+)\/price\/([^/]+)$/);
    if (pathname === "/" || pathname === "/home")
      return sendFile(res, "index.htm");
    if (pathname === "/menu") return sendFile(res, "info/menu.htm");
    if (pathname === "/order") return sendFile(res, "info/order.htm");
    if (pathname.startsWith("/public/"))
      return sendFile(res, pathname.slice(1));
    if (item) {
      const name = escapeHtml(item[1]);
      const price = escapeHtml(item[2]);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(
        `<!doctype html><html lang="th"><head><meta charset="UTF-8"><link rel="stylesheet" href="/public/css/style.css"><title>รายละเอียดเมนู</title></head><body><main class="result"><h1>${name}</h1><h2>ราคา ${price} บาท</h2><a href="/menu">กลับไปหน้าเมนู</a></main></body></html>`,
      );
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 ไม่พบหน้าเว็บ");
  })
  .listen(PORT, () => console.log(`Open http://localhost:${PORT}/home`));
