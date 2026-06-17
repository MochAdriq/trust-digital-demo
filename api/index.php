<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Vercel Serverless: Remap storage and cache to /tmp because Vercel is read-only
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    mkdir($storagePath.'/framework/views', 0777, true);
    mkdir($storagePath.'/framework/cache/data', 0777, true);
    mkdir($storagePath.'/framework/sessions', 0777, true);
    mkdir($storagePath.'/logs', 0777, true);
    mkdir($storagePath.'/bootstrap/cache', 0777, true);
}

// Redirect cache files to /tmp
$_ENV['APP_SERVICES_CACHE'] = $storagePath.'/bootstrap/cache/services.php';
$_ENV['APP_PACKAGES_CACHE'] = $storagePath.'/bootstrap/cache/packages.php';
$_ENV['APP_CONFIG_CACHE'] = $storagePath.'/bootstrap/cache/config.php';
$_ENV['APP_ROUTES_CACHE'] = $storagePath.'/bootstrap/cache/routes-v7.php';
$_ENV['APP_EVENTS_CACHE'] = $storagePath.'/bootstrap/cache/events.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->useStoragePath($storagePath);

$app->handleRequest(Request::capture());
