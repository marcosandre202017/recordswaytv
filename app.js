const demoStream = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

const catalog = [
  { id: "destaque", title: "RECORDS WAY LIVE", type: "live", category: "Destaque", description: "Experiência demonstrativa de transmissão HLS no navegador.", stream: demoStream, art: "linear-gradient(130deg,#5b0006,#e50914 48%,#090909)" },
  { id: "live-1", title: "Arena Sports", type: "live", category: "Esportes", description: "Canal demonstrativo para eventos esportivos licenciados.", stream: demoStream, art: "linear-gradient(135deg,#111,#8d0008 55%,#e50914)" },
  { id: "live-2", title: "Cinema Max", type: "live", category: "Filmes", description: "Programação demonstrativa de filmes e especiais.", stream: demoStream, art: "linear-gradient(135deg,#020024,#31004f,#8a0012)" },
  { id: "live-3", title: "News 24", type: "live", category: "Notícias", description: "Canal demonstrativo de notícias 24 horas.", stream: demoStream, art: "linear-gradient(135deg,#051937,#004d7a,#e50914)" },
  { id: "live-4", title: "Kids Play", type: "live", category: "Infantil", description: "Conteúdo infantil autorizado para toda a família.", stream: demoStream, art: "linear-gradient(135deg,#5f2c82,#49a09d,#e50914)" },
  { id: "live-5", title: "Mundo Doc", type: "live", category: "Documentários", description: "Natureza, ciência e histórias reais.", stream: demoStream, art: "linear-gradient(135deg,#0f2027,#2c5364,#8c1b20)" },
  { id: "movie-1", title: "Última Rota", type: "movie", category: "Ação • 2026", description: "Uma missão de alto risco transforma uma fuga em uma corrida contra o tempo.", stream: demoStream, art: "linear-gradient(135deg,#0a0a0a,#4b0005,#e50914)" },
  { id: "movie-2", title: "Código Vermelho", type: "movie", category: "Suspense • 2026", description: "Um analista descobre uma ameaça escondida dentro do próprio sistema.", stream: demoStream, art: "linear-gradient(135deg,#1f1c2c,#3b0d18,#e50914)" },
  { id: "movie-3", title: "Depois da Meia-Noite", type: "movie", category: "Drama • 2025", description: "Segredos antigos voltam à tona durante uma noite inesperada.", stream: demoStream, art: "linear-gradient(135deg,#141e30,#243b55,#8b0008)" },
  { id: "movie-4", title: "Linha de Frente", type: "movie", category: "Ação • 2026", description: "Um grupo precisa proteger a cidade antes do amanhecer.", stream: demoStream, art: "linear-gradient(135deg,#200122,#6f0000,#111)" },
  { id: "movie-5", title: "Horizonte Final", type: "movie", category: "Ficção • 2026", description: "Uma expedição espacial recebe um sinal impossível de ignorar.", stream: demoStream, art: "linear-gradient(135deg,#000428,#004e92,#8a0012)" },
  { id: "series-1", title: "Distrito 9", type: "series", category: "Série • 2 temporadas", description: "Investigadores encaram crimes que ninguém mais consegue explicar.", stream: demoStream, art: "linear-gradient(135deg,#232526,#414345,#a4000a)" },
  { id: "series-2", title: "A Firma", type: "series", category: "Série • 1 temporada", description: "Poder, ambição e segredos nos bastidores de um grande império.", stream: demoStream, art: "linear-gradient(135deg,#0f0c29,#302b63,#780009)" },
  { id: "series-3", title: "Zona Restrita", type: "series", category: "Série • 3 temporadas", description: "Uma equipe especial enfrenta ameaças além dos limites conhecidos.", stream: demoStream, art: "linear-gradient(135deg,#000,#434343,#9d0008)" },
  { id: "series-4", title: "Ponto Cego", type: "series", category: "Série • 1 temporada", description: "Cada pista revela uma verdade mais perigosa que a anterior.", stream: demoStream, art: "linear-gradient(135deg,#16222a,#3a6073,#a00009)" },
  { id: "series-5", title: "Recomeço", type: "series", category: "Série • 2 temporadas", description: "Uma história sobre escolhas, perdas e novas oportunidades.", stream: demoStream, art: "linear-gradient(135deg,#42275a,#734b6d,#a30009)" }
];

let hls = null;
let currentInfoId = null;
const favorites = new Set(JSON.parse(localStorage.getItem("rw-favorites") || "[]"));

const byId = (id) => document.getElementById(id);
const playerModal = byId("playerModal");
const infoModal = byId("infoModal");
const video = byId("videoPlayer");

function cardTemplate(item) {
  const isFav = favorites.has(item.id);
  return `
    <article class="card" data-title="${item.title.toLowerCase()}" style="--art:${item.art}">
      <div class="card-art"></div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <div class="card-meta">${item.type === "live" ? '<span class="status-dot"></span>AO VIVO • ' : ""}${item.category}</div>
        <div class="card-actions">
          <button class="mini-btn play" data-play-id="${item.id}" aria-label="Assistir ${item.title}">▶</button>
          <button class="mini-btn ${isFav ? "active" : ""}" data-favorite-id="${item.id}" aria-label="Adicionar à lista">${isFav ? "✓" : "+"}</button>
          <button class="mini-btn" data-info-id="${item.id}" aria-label="Mais informações">i</button>
        </div>
      </div>
    </article>`;
}

function renderCatalog() {
  byId("liveGrid").innerHTML = catalog.filter(i => i.type === "live" && i.id !== "destaque").map(cardTemplate).join("");
  byId("moviesGrid").innerHTML = catalog.filter(i => i.type === "movie").map(cardTemplate).join("");
  byId("seriesGrid").innerHTML = catalog.filter(i => i.type === "series").map(cardTemplate).join("");
  const favItems = catalog.filter(i => favorites.has(i.id));
  byId("favoritesGrid").innerHTML = favItems.map(cardTemplate).join("");
  byId("emptyList").style.display = favItems.length ? "none" : "grid";
}

function openPlayer(id) {
  const item = catalog.find(i => i.id === id);
  if (!item) return;

  byId("playerTitle").textContent = item.title;
  byId("playerDescription").textContent = item.description;
  byId("playerBadge").textContent = item.type === "live" ? "AO VIVO" : "VÍDEO";
  byId("videoStatus").style.display = "grid";
  byId("videoStatus").textContent = "Preparando transmissão...";
  playerModal.classList.add("open");
  playerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (hls) { hls.destroy(); hls = null; }
  video.removeAttribute("src");

  if (window.Hls && Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(item.stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      byId("videoStatus").style.display = "none";
      video.play().catch(() => {});
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) byId("videoStatus").textContent = "Não foi possível carregar esta transmissão.";
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = item.stream;
    video.addEventListener("loadedmetadata", () => {
      byId("videoStatus").style.display = "none";
      video.play().catch(() => {});
    }, { once: true });
  } else {
    byId("videoStatus").textContent = "Este navegador não oferece suporte a HLS.";
  }
}

function closePlayer() {
  playerModal.classList.remove("open");
  playerModal.setAttribute("aria-hidden", "true");
  video.pause();
  if (hls) { hls.destroy(); hls = null; }
  video.removeAttribute("src");
  document.body.style.overflow = "";
}

function openInfo(id) {
  const item = catalog.find(i => i.id === id);
  if (!item) return;
  currentInfoId = id;
  byId("infoType").textContent = item.type === "live" ? "CANAL AO VIVO" : item.type === "movie" ? "FILME" : "SÉRIE";
  byId("infoTitle").textContent = item.title;
  byId("infoDescription").textContent = item.description;
  byId("infoFavorite").textContent = favorites.has(id) ? "✓" : "+";
  byId("infoFavorite").classList.toggle("active", favorites.has(id));
  infoModal.classList.add("open");
  infoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeInfo() {
  infoModal.classList.remove("open");
  infoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  localStorage.setItem("rw-favorites", JSON.stringify([...favorites]));
  renderCatalog();
  if (currentInfoId === id && infoModal.classList.contains("open")) openInfo(id);
}

document.addEventListener("click", (event) => {
  const play = event.target.closest("[data-play-id]");
  const info = event.target.closest("[data-info-id]");
  const favorite = event.target.closest("[data-favorite-id]");
  const arrow = event.target.closest("[data-carousel]");

  if (play) openPlayer(play.dataset.playId);
  if (info) openInfo(info.dataset.infoId);
  if (favorite) toggleFavorite(favorite.dataset.favoriteId);
  if (arrow) {
    const row = byId(arrow.dataset.carousel);
    row.scrollBy({ left: Number(arrow.dataset.direction) * row.clientWidth * .8, behavior: "smooth" });
  }
  if (event.target.closest("[data-close-modal]")) closePlayer();
  if (event.target.closest("[data-close-info]")) closeInfo();
});

byId("infoPlay").addEventListener("click", () => {
  closeInfo();
  openPlayer(currentInfoId);
});
byId("infoFavorite").addEventListener("click", () => toggleFavorite(currentInfoId));

const searchPanel = byId("searchPanel");
byId("searchToggle").addEventListener("click", () => {
  searchPanel.classList.add("open");
  searchPanel.setAttribute("aria-hidden", "false");
  byId("searchInput").focus();
});
byId("closeSearch").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
  byId("searchInput").value = "";
  document.querySelectorAll(".card").forEach(card => card.style.display = "block");
});
byId("searchInput").addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = !term || card.dataset.title.includes(term) ? "block" : "none";
  });
});

window.addEventListener("scroll", () => byId("topbar").classList.toggle("scrolled", window.scrollY > 35));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { closePlayer(); closeInfo(); }
});

renderCatalog();
