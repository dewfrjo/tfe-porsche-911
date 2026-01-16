<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('competition.twig');

echo $template->render();

?>
