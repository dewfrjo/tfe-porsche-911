<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('history.twig');

echo $template->render();

?>
