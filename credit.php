<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('credit.twig');

echo $template->render();

?>