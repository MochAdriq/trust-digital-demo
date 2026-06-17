<?php
try { 
    $pdo = new PDO('pgsql:host=aws-0-ap-southeast-1.pooler.supabase.com;port=6543;dbname=postgres', 'postgres.thncjlucmsezwkubgjue', 'databaseTrustdigita'); 
    echo 'SUCCESS_AP_SOUTHEAST_1'; 
} catch (Exception $e) { 
    try {
        $pdo = new PDO('pgsql:host=aws-0-ap-southeast-2.pooler.supabase.com;port=6543;dbname=postgres', 'postgres.thncjlucmsezwkubgjue', 'databaseTrustdigita'); 
        echo 'SUCCESS_AP_SOUTHEAST_2';
    } catch (Exception $e2) {
        echo 'FAILED';
    }
}
