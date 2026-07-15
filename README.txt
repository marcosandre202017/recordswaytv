RECORDS WAY WEB PLAYER — LOGIN POR DNS

1. Publique os arquivos em uma hospedagem HTTPS.
2. Abra index.html.
3. Informe DNS, usuário e senha de um servidor compatível com Xtream Codes.
4. As credenciais permanecem somente na memória da aba. Apenas a DNS pode ser lembrada, se marcado.

IMPORTANTE
- Use somente conteúdo próprio ou licenciado.
- O servidor precisa aceitar requisições do navegador (CORS) e reprodução HLS/MP4.
- Uma página HTTPS não consegue consumir uma DNS HTTP por bloqueio de conteúdo misto.
- GitHub Pages e Cloudflare Pages estático não executam proxy.php.
- Para usar proxy.php, publique em hospedagem PHP e configure $allowedHosts e a DNS fixa.
- Não deixe um proxy aberto para qualquer host.

API esperada: /player_api.php no padrão Xtream Codes.
