<?php
header('Content-Type: application/json');
require_once __DIR__.'/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = explode('/', $_GET['path'] ?? '');
$id = $path[1] ?? null;

try {
  switch($method) {
    case 'GET':
      if($id) {
        $stmt = $pdo->prepare("SELECT * FROM reviews WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
      } else {
        $stmt = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
      }
      break;

    case 'POST':
    case 'PUT':
      $input = json_decode(file_get_contents('php://input'), true);
      
      // Validar CSRF
      if(!hash_equals($_SESSION['csrf_token'], $input['csrf_token'])) {
        throw new Exception('Token CSRF inválido', 403);
      }

      // Validar reCAPTCHA solo para nuevos posts
      if($method === 'POST' && !validateRecaptcha($input['g-recaptcha-response'])) {
        throw new Exception('Validación reCAPTCHA fallida', 403);
      }

      // Sanitizar entradas
      $name = htmlspecialchars($input['user_name']);
      $email = filter_var($input['user_email'], FILTER_SANITIZE_EMAIL);
      $phone = preg_replace('/\D/', '', $input['user_phone']);
      $rating = (int)($input['rating'] ?? 0);
      $comment = htmlspecialchars($input['comment']);

      // Validaciones
      if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Correo electrónico inválido', 400);
      }

      if($rating < 1 || $rating > 5) {
        throw new Exception('Calificación inválida', 400);
      }

      // Generar Gravatar
      $gravatar = "https://www.gravatar.com/avatar/".md5(strtolower(trim($email)))."?s=40&d=mp";

      if($method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO reviews 
          (user_name, user_email, user_phone, user_photo, rating, comment) 
          VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $input['phone_prefix'].$phone, $gravatar, $rating, $comment]);
        echo json_encode(['id' => $pdo->lastInsertId()]);
      } else {
        $stmt = $pdo->prepare("UPDATE reviews SET
          user_name = ?, user_phone = ?, rating = ?, comment = ?, edited_at = NOW()
          WHERE id = ? AND user_email = ?");
        $stmt->execute([$name, $input['phone_prefix'].$phone, $rating, $comment, $id, $email]);
        echo json_encode(['updated' => $stmt->rowCount()]);
      }
      break;

    case 'DELETE':
      $input = json_decode(file_get_contents('php://input'), true);
      
      if(!hash_equals($_SESSION['csrf_token'], $input['csrf_token'])) {
        throw new Exception('Token CSRF inválido', 403);
      }

      $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ? AND user_email = ?");
      $stmt->execute([$id, $input['user_email']]);
      echo json_encode(['deleted' => $stmt->rowCount()]);
      break;

    default:
      throw new Exception('Método no permitido', 405);
  }
} catch(Exception $e) {
  http_response_code($e->getCode() ?: 500);
  echo json_encode(['error' => $e->getMessage()]);
}

function validateRecaptcha($response) {
  $secret = 'YOUR_RECAPTCHA_SECRET';
  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $data = ['secret' => $secret, 'response' => $response];
  
  $options = [
    'http' => [
      'header' => "Content-type: application/x-www-form-urlencoded\r\n",
      'method' => 'POST',
      'content' => http_build_query($data)
    ]
  ];
  
  $result = file_get_contents($url, false, stream_context_create($options));
  return json_decode($result)->success;
}