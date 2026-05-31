<?php
$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$token = json_decode(file_get_contents($tokenFile), true)['access_token'];

$xml = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>$token</eBayAuthToken>
  </RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination>
      <EntriesPerPage>200</EntriesPerPage>
      <PageNumber>1</PageNumber>
    </Pagination>
  </ActiveList>
</GetMyeBaySellingRequest>
XML;

$ch = curl_init('https://api.ebay.com/ws/api.dll');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-EBAY-API-COMPATIBILITY-LEVEL: 1193',
    'X-EBAY-API-CALL-NAME: GetMyeBaySelling',
    'X-EBAY-API-SITEID: 0',
    'Content-Type: text/xml',
]);
$resp = curl_exec($ch);
curl_close($ch);

preg_match('/<TotalNumberOfEntries>(\d+)<\/TotalNumberOfEntries>/', $resp, $total);
preg_match_all('/<Item>.*?<ItemID>(\d+)<\/ItemID>.*?(?:<SKU>([^<]*)<\/SKU>)?.*?<\/Item>/s', $resp, $items, PREG_SET_ORDER);

echo "Total active listings (Trading API): " . ($total[1] ?? 'unknown') . "\n";
echo "First 10 items found:\n";
foreach (array_slice($items, 0, 10) as $i) {
    $sku = isset($i[2]) ? $i[2] : '(no SKU)';
    echo "  ItemID: {$i[1]}  SKU: $sku\n";
}

file_put_contents('/tmp/trading_api_response.xml', $resp);
echo "\nFull response saved to /tmp/trading_api_response.xml\n";
echo "Size: " . strlen($resp) . " bytes\n";
