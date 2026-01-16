<?php

require_once 'includes/functions.php';

// Initialisation de Twig
$twig = getTwigInstance();

$template = $twig->load('index.twig');

$modelData = [
    1964 => [
        'name' => 'Porsche 911 Classic',
        'year' => 1964,
        'description' => 'La première génération de la Porsche 911, un modèle légendaire.',
        'images' => ['images/911_classic_1.jpg', 'images/911_classic_2.jpg'],
    ],
    1973 => [
        'name' => 'Porsche 911 Carrera RS',
        'year' => 1973,
        'description' => 'Le modèle Carrera RS, célèbre pour sa performance.',
        'images' => ['images/911_carrera_rs_1.jpg', 'images/911_carrera_rs_2.jpg'],
    ],
    1988 => [
        'name' => 'Porsche 911 Turbo (964)',
        'year' => 1988,
        'description' => 'La version Turbo avec une nouvelle ère pour la 911.',
        'images' => ['images/911_turbo_1.jpg', 'images/911_turbo_2.jpg'],
    ],
    1998 => [
        'name' => 'Porsche 911 GT3',
        'year' => 1998,
        'description' => 'Un modèle axé sur la performance inspiré du sport automobile.',
        'images' => ['images/911_gt3_1.jpg', 'images/911_gt3_2.jpg'],
    ],
    // Ajoute d'autres modèles selon les années...
];

// Récupérer l'année à afficher depuis l'URL, sinon par défaut 1964
$year = isset($_GET['year']) ? (int)$_GET['year'] : 1964;

// Vérifier si l'année demandée existe dans les données, sinon afficher 1964 par défaut
$selectedModel = $modelData[$year] ?? $modelData[1964];

// Convertir les modèles en un tableau indexé pour une utilisation plus facile en Twig
$events = array_values($modelData);

// Rendu du template avec toutes les données nécessaires
echo $template->render([
    'title' => 'Histoire',
    'modelData' => $modelData, // Ajout pour permettre une boucle dans Twig
    'events' => $events,
    'selected_year' => $year,
    'selected_model' => $selectedModel,
]);

?>
