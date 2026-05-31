<?php
$ch = curl_init('https://api.newjapandeals.com/admin/migrate-policies.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'action' => 'migrate-one',
    'key' => 'njd_moltbot_2026_secretkey',
    'sku' => 'NJD-W034',
    'newPolicyId' => '394846753023'  // NJD-USA-300g-A
]));
$r = curl_exec($ch);
curl_close($ch);
echo $r;
