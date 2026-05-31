<?php
$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$token = json_decode(file_get_contents($tokenFile), true)['access_token'];

$itemId = '358466102517';
$sku = 'NJD-W034';

echo "=== TEST 1: GET inventory item by SKU (no encoding) ===\n";
$url = "https://api.ebay.com/sell/inventory/v1/inventory_item/$sku";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json",
    "Content-Language: en-US"
]);
$r = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $http\n";
echo substr($r, 0, 500) . "\n\n";

echo "=== TEST 2: GET offers list filtered by SKU ===\n";
$url = "https://api.ebay.com/sell/inventory/v1/offer?sku=" . urlencode($sku);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$r = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $http\n";
echo substr($r, 0, 800) . "\n\n";

echo "=== TEST 3: GET offer by listing ID ===\n";
$url = "https://api.ebay.com/sell/inventory/v1/offer?marketplace_id=EBAY_US&sku=" . urlencode($sku);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$r = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $http\n";
echo substr($r, 0, 800) . "\n\n";

echo "=== TEST 4: Different SKU formats (try variants) ===\n";
$variants = ['NJD-W034', 'NJDW034', 'W034', 'njd-w034', 'NJD_W034'];
foreach ($variants as $v) {
    $url = "https://api.ebay.com/sell/inventory/v1/inventory_item/" . urlencode($v);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Accept: application/json"
    ]);
    $r = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo "  SKU '$v': HTTP $http";
    if ($http === 200) {
        $data = json_decode($r, true);
        echo " ✓ FOUND";
    }
    echo "\n";
}

echo "\n=== TEST 5: List ALL inventory items (no filter) ===\n";
$url = "https://api.ebay.com/sell/inventory/v1/inventory_item?limit=5&offset=0";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$r = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $http\n";
echo substr($r, 0, 1500) . "\n";

echo "\n=== TEST 6: Trading API GetItem to see if it confirms IsItemEMS/Inventory-managed ===\n";
$xml = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>$token</eBayAuthToken></RequesterCredentials>
  <ItemID>$itemId</ItemID>
  <DetailLevel>ReturnAll</DetailLevel>
  <IncludeItemSpecifics>false</IncludeItemSpecifics>
</GetItemRequest>
XML;
$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-EBAY-API-COMPATIBILITY-LEVEL: 1193',
    'X-EBAY-API-CALL-NAME: GetItem',
    'X-EBAY-API-SITEID: 0',
    'Content-Type: text/xml',
]);
$r = curl_exec($ch);
curl_close($ch);
preg_match('/<SKU>([^<]+)<\/SKU>/', $r, $sku_m);
preg_match('/<ListingType>([^<]+)<\/ListingType>/', $r, $type_m);
preg_match('/<ListingDuration>([^<]+)<\/ListingDuration>/', $r, $dur_m);
preg_match('/<InventoryTrackingMethod>([^<]+)<\/InventoryTrackingMethod>/', $r, $inv_m);
echo "SKU from Trading API: " . ($sku_m[1] ?? 'NOT FOUND') . "\n";
echo "ListingType: " . ($type_m[1] ?? 'unknown') . "\n";
echo "Duration: " . ($dur_m[1] ?? 'unknown') . "\n";
echo "InventoryTrackingMethod: " . ($inv_m[1] ?? 'unknown') . "\n";
