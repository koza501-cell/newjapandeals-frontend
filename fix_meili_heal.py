# encoding: utf-8
path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/meili-reindex.php"
with open(path) as f:
    content = f.read()

# Insert the ensureMeiliSettings function + call BEFORE the existing settings PATCH
old = "// Update index settings\nmeiliCall('/indexes/products/settings', 'PATCH', ["

new = """// Auto-heal: ensure filterable attributes are intact
function ensureMeiliSettings(string $meiliHost, string $masterKey): bool {
    $required = ['availability','brand','categories','category','condition',
                 'featured','gender','in_stock','movement_type','price_jpy','status'];

    // Check current settings
    $ch = curl_init("$meiliHost/indexes/products/settings");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $masterKey"]);
    $resp = curl_exec($ch);
    curl_close($ch);

    $current = json_decode($resp, true);
    $currentFilters = $current['filterableAttributes'] ?? [];

    $missing = array_diff($required, $currentFilters);
    if (empty($missing)) {
        error_log("[meili-heal] All filterable attributes present, no patch needed");
        return true;
    }

    error_log("[meili-heal] Missing: " . implode(',', $missing) . " — patching now");

    $ch = curl_init("$meiliHost/indexes/products/settings");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $masterKey",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'filterableAttributes' => $required
    ]));
    $patchResp = curl_exec($ch);
    curl_close($ch);
    $taskInfo = json_decode($patchResp, true);

    $taskUid = $taskInfo['taskUid'] ?? null;
    if ($taskUid === null) {
        error_log("[meili-heal] No taskUid returned from PATCH");
        return false;
    }

    // Poll for up to 30s
    for ($i = 0; $i < 30; $i++) {
        sleep(1);
        $ch = curl_init("$meiliHost/tasks/$taskUid");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $masterKey"]);
        $taskResp = curl_exec($ch);
        curl_close($ch);
        $task = json_decode($taskResp, true);
        $status = $task['status'] ?? '';
        if ($status === 'succeeded') {
            error_log("[meili-heal] Settings PATCH succeeded (task $taskUid)");
            return true;
        }
        if ($status === 'failed') {
            error_log("[meili-heal] Settings PATCH FAILED (task $taskUid): " . json_encode($task));
            return false;
        }
    }

    error_log("[meili-heal] Settings PATCH timed out after 30s (task $taskUid)");
    return false;
}

// Run auto-heal before any document operations
if (!ensureMeiliSettings($MEILI_URL, $MEILI_KEY)) {
    error_log("[meili-reindex] Settings heal failed — proceeding anyway");
}

// Update index settings
meiliCall('/indexes/products/settings', 'PATCH', ["""

if old in content:
    content = content.replace(old, new, 1)
    print("PATCH: REPLACED")
else:
    print("PATCH: NOT FOUND")
    print(repr(old))
    exit(1)

with open(path, "w") as f:
    f.write(content)
print("File written.")
