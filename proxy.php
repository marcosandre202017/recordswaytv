<?php
// Proxy opcional para contornar CORS. Defina abaixo os hosts permitidos.
$allowedHosts = ['SEU-SERVIDOR.com'];
$server = isset($_GET['server']) ? rtrim($_GET['server'], '/') : '';
if ($server === '') {
  // Alternativa mais segura: fixe a DNS aqui e remova o parâmetro server.
  $server = 'https://SEU-SERVIDOR.com:443';
}
$host = parse_url($server, PHP_URL_HOST);
if (!$host || !in_array($host, $allowedHosts, true)) { http_response_code(403); exit('Host não permitido'); }
$params = $_GET; unset($params['server']);
$url = $server . '/player_api.php?' . http_build_query($params);
$ch = curl_init($url);
curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>30,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_USERAGENT=>'RecordsWayWebPlayer/1.0']);
$response=curl_exec($ch);$code=curl_getinfo($ch,CURLINFO_HTTP_CODE);$type=curl_getinfo($ch,CURLINFO_CONTENT_TYPE) ?: 'application/json';curl_close($ch);
http_response_code($code ?: 502);header('Content-Type: '.$type);header('Access-Control-Allow-Origin: *');echo $response;
