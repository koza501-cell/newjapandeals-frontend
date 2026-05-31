<?php
header('Content-Type: application/json');

$key = $_GET['key'] ?? $_POST['key'] ?? '';
if ($key !== 'njd_moltbot_2026_secretkey') {
    http_response_code(403);
    exit(json_encode(['error' => 'forbidden']));
}

$action = $_GET['action'] ?? $_POST['action'] ?? 'preview';

$tokenFile = '/home/u991230906/domains/api.newjapandeals.com/public_html/api/data/ebay_token.json';
$tokenData = json_decode(file_get_contents($tokenFile), true);
$accessToken = $tokenData['access_token'] ?? '';

function pickPolicyByPrice($priceUsd) {
    if ($priceUsd < 30)     return ['id' => '394846753023', 'name' => 'NJD-USA-300g-A'];
    if ($priceUsd <= 60)    return ['id' => '394846774023', 'name' => 'NJD-USA-300g-B'];
    if ($priceUsd <= 100)   return ['id' => '394846799023', 'name' => 'NJD-USA-300g-C'];
    if ($priceUsd <= 200)   return ['id' => '394846819023', 'name' => 'NJD-USA-300g-D'];
    return null;
}

$ALL_POLICIES = [
    '391243398023' => 'NJD-Worldwide-500g',
    '391245519023' => 'NJD-Worldwide-1kg',
    '391246699023' => 'NJD-Worldwide-2kg',
    '394695958023' => 'NJD-WW-500g',
    '394695999023' => 'NJD-WW-1kg',
    '394696222023' => 'NJD-WW-2kg',
    '394846593023' => 'NJD-USA-100g-A',
    '394846596023' => 'NJD-USA-100g-B',
    '394846606023' => 'NJD-USA-100g-C',
    '394846625023' => 'NJD-USA-100g-D',
    '394846753023' => 'NJD-USA-300g-A',
    '394846774023' => 'NJD-USA-300g-B',
    '394846799023' => 'NJD-USA-300g-C',
    '394846819023' => 'NJD-USA-300g-D',
    '394828152023' => 'NJD-USA-500g-A',
    '394692243023' => 'NJD-USA-500g-B',
    '394693071023' => 'NJD-USA-500g-C',
    '394693379023' => 'NJD-USA-500g-D',
    '394693550023' => 'NJD-USA-1kg-A',
    '394693696023' => 'NJD-USA-1kg-B',
    '394693807023' => 'NJD-USA-1kg-C',
    '394693965023' => 'NJD-USA-1kg-D',
    '394694216023' => 'NJD-USA-2kg-A',
    '394694434023' => 'NJD-USA-2kg-B',
    '394699716023' => 'NJD-USA-2kg-C',
    '394695869023' => 'NJD-USA-2kg-D',
];

$LEGACY_POLICY_IDS = ['391243398023', '391245519023', '391246699023',
                       '394695958023', '394695999023', '394696222023'];

function tradingApiCall($callName, $bodyXml, $token) {
    $envelope = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<{$callName}Request xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>$token</eBayAuthToken>
  </RequesterCredentials>
  $bodyXml
</{$callName}Request>
XML;
    $ch = curl_init('https://api.ebay.com/ws/api.dll');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $envelope);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-EBAY-API-COMPATIBILITY-LEVEL: 1193',
        "X-EBAY-API-CALL-NAME: $callName",
        'X-EBAY-API-SITEID: 0',
        'Content-Type: text/xml',
    ]);
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['http' => $http, 'body' => $resp];
}

function inventoryApi($endpoint, $method, $token, $body = null) {
    $url = "https://api.ebay.com$endpoint";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Content-Type: application/json",
        "Accept: application/json",
        "Content-Language: en-US",
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $resp = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['http' => $http, 'body' => json_decode($resp, true), 'raw' => $resp];
}

// ─────────────────────────────────────────────────────────
// ACTION: preview
// ─────────────────────────────────────────────────────────
if ($action === 'preview') {
    $allItems = [];
    $page = 1;
    while (true) {
        $bodyXml = <<<XML
<ActiveList>
  <Include>true</Include>
  <Pagination>
    <EntriesPerPage>200</EntriesPerPage>
    <PageNumber>$page</PageNumber>
  </Pagination>
</ActiveList>
XML;
        $r = tradingApiCall('GetMyeBaySelling', $bodyXml, $accessToken);
        if ($r['http'] !== 200) break;
        if (!preg_match_all('/<Item>(.*?)<\/Item>/s', $r['body'], $blocks)) break;
        if (empty($blocks[1])) break;

        foreach ($blocks[1] as $block) {
            $item = [];
            if (preg_match('/<ItemID>(\d+)<\/ItemID>/', $block, $m)) $item['itemId'] = $m[1];
            if (preg_match('/<SKU>([^<]+)<\/SKU>/', $block, $m)) $item['sku'] = $m[1];
            if (preg_match('/<Title>([^<]+)<\/Title>/', $block, $m)) $item['title'] = $m[1];
            if (preg_match('/<CurrentPrice[^>]*>([\d.]+)<\/CurrentPrice>/', $block, $m)) $item['price'] = floatval($m[1]);
            if (preg_match('/<ShippingProfileID>(\d+)<\/ShippingProfileID>/', $block, $m)) $item['shippingPolicyId'] = $m[1];
            $allItems[] = $item;
        }

        if (preg_match('/<HasMoreItems>(\w+)<\/HasMoreItems>/', $r['body'], $m)) {
            if (strtolower($m[1]) === 'false') break;
        }
        $page++;
        if ($page > 5) break;
    }

    global $ALL_POLICIES, $LEGACY_POLICY_IDS;
    $result = [
        'total_listings' => count($allItems),
        'migration_candidates' => [],
        'skip_high_price' => [],
        'already_gen3' => 0,
        'missing_sku' => 0,
        'missing_data' => 0,
    ];

    foreach ($allItems as $item) {
        if (empty($item['shippingPolicyId']) || !isset($item['price'])) {
            $result['missing_data']++;
            continue;
        }
        if (empty($item['sku'])) {
            $result['missing_sku']++;
            continue;
        }

        $currentPolicy = $item['shippingPolicyId'];
        if (!in_array($currentPolicy, $LEGACY_POLICY_IDS)) {
            $result['already_gen3']++;
            continue;
        }

        $newPolicy = pickPolicyByPrice($item['price']);
        $row = [
            'itemId' => $item['itemId'],
            'sku' => $item['sku'],
            'title' => substr($item['title'] ?? '', 0, 70),
            'price' => $item['price'],
            'old_policy_id' => $currentPolicy,
            'old_policy_name' => $ALL_POLICIES[$currentPolicy] ?? 'unknown',
        ];

        if ($newPolicy === null) {
            $row['action'] = 'SKIP';
            $row['reason'] = "Price \${$item['price']} > \$200";
            $result['skip_high_price'][] = $row;
        } else {
            $row['action'] = 'MIGRATE';
            $row['new_policy_id'] = $newPolicy['id'];
            $row['new_policy_name'] = $newPolicy['name'];
            $result['migration_candidates'][] = $row;
        }
    }

    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// ─────────────────────────────────────────────────────────
// ACTION: migrate-one — Inventory API path
// ─────────────────────────────────────────────────────────
if ($action === 'migrate-one') {
    $sku = $_POST['sku'] ?? '';
    $newPolicyId = $_POST['newPolicyId'] ?? '';

    if (!$sku || !$newPolicyId) {
        echo json_encode(['error' => 'missing sku or newPolicyId']);
        exit;
    }

    // STEP 1 — Find the offerId for this SKU
    $r1 = inventoryApi("/sell/inventory/v1/offer?sku=" . urlencode($sku), 'GET', $accessToken);
    if ($r1['http'] !== 200) {
        echo json_encode([
            'error' => 'Failed to find offer for SKU',
            'sku' => $sku,
            'http' => $r1['http'],
            'body' => $r1['body']
        ]);
        exit;
    }

    $offers = $r1['body']['offers'] ?? [];
    if (empty($offers)) {
        echo json_encode(['error' => 'No offers found for SKU', 'sku' => $sku]);
        exit;
    }

    $offer = null;
    foreach ($offers as $o) {
        if (($o['status'] ?? '') === 'PUBLISHED') {
            $offer = $o;
            break;
        }
    }
    if (!$offer) {
        echo json_encode(['error' => 'No PUBLISHED offer for SKU', 'sku' => $sku]);
        exit;
    }

    $offerId = $offer['offerId'];

    // STEP 2 — Modify fulfillment policy and PUT back
    $updated = $offer;
    if (!isset($updated['listingPolicies'])) $updated['listingPolicies'] = [];
    $updated['listingPolicies']['fulfillmentPolicyId'] = $newPolicyId;

    unset($updated['offerId']);
    unset($updated['status']);
    unset($updated['listing']);

    $r2 = inventoryApi("/sell/inventory/v1/offer/$offerId", 'PUT', $accessToken, $updated);

    if ($r2['http'] === 204 || $r2['http'] === 200) {
        echo json_encode([
            'success' => true,
            'sku' => $sku,
            'offerId' => $offerId,
            'newPolicy' => $newPolicyId,
            'http' => $r2['http']
        ]);
    } else {
        $errMsg = 'unknown';
        if (isset($r2['body']['errors'][0])) {
            $errCode = $r2['body']['errors'][0]['errorId'] ?? '';
            $errMsg = $r2['body']['errors'][0]['message'] ?? '';
            $errMsg = "[$errCode] $errMsg";
        }
        echo json_encode([
            'error' => 'PUT failed',
            'sku' => $sku,
            'offerId' => $offerId,
            'http' => $r2['http'],
            'errorMessage' => $errMsg,
            'fullBody' => $r2['body']
        ]);
    }
    exit;
}

echo json_encode(['error' => 'unknown action']);
