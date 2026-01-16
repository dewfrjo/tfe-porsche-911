<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('projet.twig');

echo $template->render();

?>