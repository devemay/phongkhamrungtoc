const CACHE_NAME = "aa-app-shell-v2";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Chỉ lấy từ cache khi ĐANG MỞ TRANG (navigate) và không có mạng.
// Mọi request khác (gọi API backend, CDN thư viện xuất Excel...) luôn ưu tiên mạng thật,
// để dữ liệu bệnh nhân không bao giờ bị lấy nhầm từ bản cũ trong cache.
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
  }
});
