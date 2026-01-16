<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('901.twig');

echo $template->render();

?>