<?php

require_once 'includes/functions.php';

$twig = getTwigInstance();

$template = $twig->load('quiz.twig');

echo $template->render();