path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/moltbot/receive.php"
with open(path) as f:
    content = f.read()

patches = []

# PATCH 1 - camera-aware plain-text disclaimers
patches.append((
    "PATCH1",
    '    $descParts[] = "1. Sold As-Is: Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a watch appears running in photos, battery condition may change during shipping.";\n    $descParts[] = "2. Battery Shipping Notice: Due to international shipping regulations, parcels containing batteries may need to be shipped by sea instead of air to certain countries. We may contact you to confirm whether you prefer to receive the product with or without the battery.";\n    $descParts[] = "3. Cleaning: Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.";\n    $descParts[] = "4. Measurements: Measurements (band size, case size, etc.) are taken manually and may have minor inaccuracies.";\n    $descParts[] = "5. Quartz/Solar/Eco-Drive Batteries: Any battery included is for testing purposes only. Buyers should expect to replace the battery after purchase.";\n    $descParts[] = "6. Solar & Eco-Drive: Solar and Eco-Drive batteries undergo limited testing only. Buyers may need to replace or recharge if performance is weak.";\n    $descParts[] = "7. Mechanical Watches: Automatic and hand-winding watches are tested by brief shaking/winding to confirm basic operation. No timekeeping accuracy or power reserve testing. Consider professional servicing.";\n    $descParts[] = "8. Water Resistance: Ratings reflect manufacturer\'s original specification only. We do not test water resistance.";\n    $descParts[] = "9. Internal Condition: Products are generally not opened for inspection. We cannot guarantee previous owners have not made modifications.";',
    '    if (!empty($cameraType)) {\n        $descParts[] = "1. Sold As-Is: Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a camera/item appears working in photos, condition may change during shipping.";\n        $descParts[] = "2. Battery Shipping Notice: Due to international shipping regulations, parcels containing batteries may need to be shipped by sea instead of air to certain countries. We may contact you to confirm whether you prefer to receive the product with or without the battery.";\n        $descParts[] = "3. Cleaning: Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.";\n        $descParts[] = "4. Measurements: Measurements (size, weight, etc.) are taken manually and may have minor inaccuracies.";\n        $descParts[] = "5. Camera Operation: Cameras and lenses are tested only for basic operation (power on, shutter click, focus). We do not test image quality, autofocus accuracy, light meter, or shutter speed accuracy.";\n        $descParts[] = "6. Sensor & Optics: We do not perform sensor cleaning, lens cleaning, or fungus inspection. Buyers should expect to clean or service before professional use.";\n        $descParts[] = "7. Batteries & Chargers: If included, batteries are for testing only and may not hold charge. Original chargers may or may not be included — check description carefully.";\n        $descParts[] = "8. Film Cameras: For film cameras, light seals, meters, and shutter speeds may need servicing. Sold as collectible / for restoration.";\n        $descParts[] = "9. Internal Condition: Products are generally not opened for inspection. We cannot guarantee previous owners have not made modifications.";\n    } else {\n        $descParts[] = "1. Sold As-Is: Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a watch appears running in photos, battery condition may change during shipping.";\n        $descParts[] = "2. Battery Shipping Notice: Due to international shipping regulations, parcels containing batteries may need to be shipped by sea instead of air to certain countries. We may contact you to confirm whether you prefer to receive the product with or without the battery.";\n        $descParts[] = "3. Cleaning: Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.";\n        $descParts[] = "4. Measurements: Measurements (band size, case size, etc.) are taken manually and may have minor inaccuracies.";\n        $descParts[] = "5. Quartz/Solar/Eco-Drive Batteries: Any battery included is for testing purposes only. Buyers should expect to replace the battery after purchase.";\n        $descParts[] = "6. Solar & Eco-Drive: Solar and Eco-Drive batteries undergo limited testing only. Buyers may need to replace or recharge if performance is weak.";\n        $descParts[] = "7. Mechanical Watches: Automatic and hand-winding watches are tested by brief shaking/winding to confirm basic operation. No timekeeping accuracy or power reserve testing. Consider professional servicing.";\n        $descParts[] = "8. Water Resistance: Ratings reflect manufacturer\'s original specification only. We do not test water resistance.";\n        $descParts[] = "9. Internal Condition: Products are generally not opened for inspection. We cannot guarantee previous owners have not made modifications.";\n    }'
))

# PATCH 2 - remove standalone "Type:" line from camera descParts
patches.append((
    "PATCH2",
    '        if (!empty($cameraType)) {\n            $descParts[] = "Type: {$cameraType}";\n            if ($features) $descParts[] = "Features: {$features}";\n            if ($accessories) $descParts[] = "Accessories: {$accessories}";\n            $descParts[] = "Country of Origin: {$countryOrigin}";\n        } else {',
    '        if (!empty($cameraType)) {\n            if ($features) $descParts[] = "Features: {$features}";\n            if ($accessories) $descParts[] = "Accessories: {$accessories}";\n            $descParts[] = "Country of Origin: {$countryOrigin}";\n        } else {'
))

failed = False
for name, old, new in patches:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"{name}: REPLACED")
    else:
        print(f"{name}: NOT FOUND — STOPPING")
        failed = True
        break

if not failed:
    with open(path, "w") as f:
        f.write(content)
    print("File written.")
else:
    print("File NOT written.")
