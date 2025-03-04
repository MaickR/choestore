<?php
// csrf.php

/**
 * Valida que el token recibido coincida con el almacenado en la sesión.
 *
 * @param string $token El token recibido en la petición.
 * @return bool True si el token es válido, false en caso contrario.
 */
function validate_csrf_token($token) {
    if (isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token)) {
        return true;
    }
    return false;
}
