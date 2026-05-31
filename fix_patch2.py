path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/moltbot/receive.php"
with open(path) as f:
    content = f.read()

old = '    if (!empty($cameraType)) {\n        $descParts[] = "Type: {$cameraType}";\n        if ($features) $descParts[] = "Features: {$features}";\n        if ($accessories) $descParts[] = "Accessories: {$accessories}";\n        $descParts[] = "Country of Origin: {$countryOrigin}";\n    } else {'

new = '    if (!empty($cameraType)) {\n        if ($features) $descParts[] = "Features: {$features}";\n        if ($accessories) $descParts[] = "Accessories: {$accessories}";\n        $descParts[] = "Country of Origin: {$countryOrigin}";\n    } else {'

if old in content:
    content = content.replace(old, new, 1)
    with open(path, "w") as f:
        f.write(content)
    print("PATCH2: REPLACED — file written.")
else:
    print("PATCH2: NOT FOUND — file unchanged.")
    # Debug: show what's actually there
    idx = content.find('$descParts[] = "Type:')
    if idx >= 0:
        print("Found 'Type:' at char", idx)
        print(repr(content[idx-100:idx+200]))
