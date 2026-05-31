<?php
$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$token = json_decode(file_get_contents($tokenFile), true)['access_token'];

$itemId = '358466102517';
$newPolicyId = '394846753023';  // NJD-USA-300g-A

$envelope = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<ReviseItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>$token</eBayAuthToken>
  </RequesterCredentials>
  <Item>
    <ItemID>$itemId</ItemID>
    <SellerProfiles>
      <SellerShippingProfile>
        <ShippingProfileID>$newPolicyId</ShippingProfileID>
      </SellerShippingProfile>
    </SellerProfiles>
  </Item>
</ReviseItemRequest>
XML;

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $envelope);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-EBAY-API-COMPATIBILITY-LEVEL: 1193',
    'X-EBAY-API-CALL-NAME: ReviseItem',
    'X-EBAY-API-SITEID: 0',
    'Content-Type: text/xml',
]);
$resp = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP: $http\n\n";
echo "=== Raw eBay response ===\n";
echo $resp;
echo "\n\n=== Parsed errors ===\n";

preg_match('/<Ack>(\w+)<\/Ack>/', $resp, $ack);
echo "Ack: " . ($ack[1] ?? 'none') . "\n\n";

preg_match_all('/<Errors>(.*?)<\/Errors>/s', $resp, $errors);
foreach ($errors[1] ?? [] as $i => $err) {
    echo "Error #" . ($i+1) . ":\n";
    if (preg_match('/<ShortMessage>([^<]+)<\/ShortMessage>/', $err, $m)) echo "  Short: {$m[1]}\n";
    if (preg_match('/<LongMessage>([^<]+)<\/LongMessage>/', $err, $m)) echo "  Long: {$m[1]}\n";
    if (preg_match('/<ErrorCode>([^<]+)<\/ErrorCode>/', $err, $m)) echo "  Code: {$m[1]}\n";
    if (preg_match('/<SeverityCode>([^<]+)<\/SeverityCode>/', $err, $m)) echo "  Severity: {$m[1]}\n";
    echo "\n";
}
