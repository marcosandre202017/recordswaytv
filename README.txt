RECORDS WAY — WEB PLAYER DEMONSTRATIVO

ARQUIVOS
- index.html
- styles.css
- app.js

COMO ABRIR
1. Extraia o arquivo ZIP.
2. Abra index.html no navegador.
3. Para publicar, envie os três arquivos para GitHub Pages, Cloudflare Pages ou sua hospedagem.

COMO TROCAR OS LINKS DE VÍDEO
1. Abra app.js em um editor de texto.
2. Localize a constante catalog.
3. Troque o valor do campo stream pelo seu link HLS/M3U8 autorizado.

EXEMPLO
stream: "https://seu-servidor.com/canal/playlist.m3u8"

IMPORTANTE
- O servidor de vídeo deve permitir reprodução no navegador e liberar CORS.
- Links protegidos por DRM, autenticação específica ou bloqueio de origem podem exigir integração adicional no servidor.
- Utilize apenas conteúdos próprios ou devidamente licenciados.
- O link incluído no projeto é um stream público de teste, usado apenas para demonstração técnica.
