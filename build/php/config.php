<?php
// config.php
// Configuración de la conexión a la base de datos y cabeceras de seguridad

// Iniciar sesión para manejo de CSRF
session_start();

// --- Configuración CORS ---
// Permite solicitudes solo desde tu dominio (reemplaza "https://yourdomain.com" por el tuyo)
header("Access-Control-Allow-Origin: https://choestore.com/");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// --- Configuración CSP ---
// Ajusta según tus necesidades: permite scripts de self y de cdnjs, y las imágenes de dominios permitidos
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://flagcdn.com https://www.gravatar.com;");

// --- Configuración de la Base de Datos ---
define('DB_HOST', 'localhost');
define('DB_NAME', 'reviews_db');
define('DB_USER', 'root');      
define('DB_PASS', 'root');      

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error conectando a la base de datos.']);
    exit;
}

// --- CSRF Token ---
// Genera un token CSRF si no existe en la sesión
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// En config.php
$_SESSION['last_request'] = $_SESSION['last_request'] ?? 0;
if(time() - $_SESSION['last_request'] < 2) {
    http_response_code(429);
    die(json_encode(['error' => 'Demasiadas solicitudes']));
}
$_SESSION['last_request'] = time();