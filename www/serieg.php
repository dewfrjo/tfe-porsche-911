<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('serieg.twig');

echo $template->render();

?>