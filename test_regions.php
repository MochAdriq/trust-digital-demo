<?php
$regions = [
    'ap-southeast-1', // Singapore (Most common for ID)
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'us-east-1',
    'us-west-1',
    'eu-west-1',
    'eu-central-1',
    'eu-west-2',
    'eu-west-3',
    'ca-central-1',
    'sa-east-1'
];

$user = 'postgres.thncjlucmsezwkubgjue';
$pass = 'databaseTrustdigita';
$db = 'postgres';

echo "Testing regions...\n";

foreach ($regions as $region) {
    $host = "aws-0-{$region}.pooler.supabase.com";
    try {
        $pdo = new PDO("pgsql:host=$host;port=6543;dbname=$db;connect_timeout=3", $user, $pass);
        echo "SUCCESS: $host\n";
        exit(0);
    } catch (Exception $e) {
        $msg = $e->getMessage();
        if (strpos($msg, 'could not translate host name') === false && strpos($msg, 'timeout') === false) {
             // If we get an auth error, we found the server!
             echo "FOUND (Auth error): $host - $msg\n";
        }
    }
}
echo "FAILED_ALL\n";
