<?php
$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$token = json_decode(file_get_contents($tokenFile), true)['access_token'];

// GET current offer state
$ch = curl_init("https://api.ebay.com/sell/inventory/v1/offer?sku=NJD-W034");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", "Accept: application/json"]);
$r = curl_exec($ch);
curl_close($ch);

$offer = json_decode($r, true)['offers'][0] ?? null;
if (!$offer) { echo "No offer found!\n"; exit; }

$offerId = $offer['offerId'];
$currentPolicy = $offer['listingPolicies']['fulfillmentPolicyId'] ?? 'NONE';
echo "Found offer: $offerId\n";
echo "Current fulfillmentPolicyId: $currentPolicy\n\n";

// Build PUT body — same as migration script
$updated = $offer;
$updated['listingPolicies']['fulfillmentPolicyId'] = '394846753023'; // NJD-USA-300g-A
unset($updated['offerId']);
unset($updated['status']);
unset($updated['listing']);

echo "=== PUT body (listingPolicies section) ===\n";
echo json_encode($updated['listingPolicies'], JSON_PRETTY_PRINT) . "\n\n";

// Execute PUT
$ch = curl_init("https://api.ebay.com/sell/inventory/v1/offer/$offerId");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json",
    "Accept: application/json",
    "Content-Language: en-US",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updated));
$resp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "=== PUT response ===\n";
echo "HTTP: $http\n";
echo "Body: " . ($resp ?: '(empty — 204 No Content is success)') . "\n\n";

// Re-fetch to confirm actual stored state
sleep(2);
$ch = curl_init("https://api.ebay.com/sell/inventory/v1/offer?sku=NJD-W034");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", "Accept: application/json"]);
$r3 = curl_exec($ch);
curl_close($ch);

$postOffer = json_decode($r3, true)['offers'][0] ?? null;
echo "=== Post-PUT state ===\n";
echo "fulfillmentPolicyId now: " . ($postOffer['listingPolicies']['fulfillmentPolicyId'] ?? 'NONE') . "\n";
