<?php
$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$token = json_decode(file_get_contents($tokenFile), true)['access_token'];

echo "=== Inventory API: current state of NJD-W034 offer ===\n";
$ch = curl_init("https://api.ebay.com/sell/inventory/v1/offer?sku=NJD-W034");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$r = curl_exec($ch);
$data = json_decode($r, true);
curl_close($ch);

foreach ($data['offers'] ?? [] as $o) {
    echo "offerId: {$o['offerId']}\n";
    echo "status: {$o['status']}\n";
    echo "fulfillmentPolicyId: " . ($o['listingPolicies']['fulfillmentPolicyId'] ?? 'NONE') . "\n";
    echo "marketplaceId: {$o['marketplaceId']}\n";
}

echo "\n=== Trading API: current state of itemID 358466102517 ===\n";
$xml = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials><eBayAuthToken>$token</eBayAuthToken></RequesterCredentials>
  <ItemID>358466102517</ItemID>
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
$r2 = curl_exec($ch);
curl_close($ch);

preg_match('/<ShippingProfileID>(\d+)<\/ShippingProfileID>/', $r2, $m1);
preg_match('/<ShippingProfileName>([^<]+)<\/ShippingProfileName>/', $r2, $m2);
echo "ShippingProfileID: " . ($m1[1] ?? 'NONE') . "\n";
echo "ShippingProfileName: " . ($m2[1] ?? 'NONE') . "\n";
