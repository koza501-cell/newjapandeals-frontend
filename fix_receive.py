path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/moltbot/receive.php"
with open(path) as f:
    content = f.read()

patches = []

# PATCH 1 - createNjdProduct plain-text description
patches.append((
    "PATCH1",
    '    $descParts[] = "Brand: {$brandEn}";\n    if ($model) $descParts[] = "Model: {$model}";\n    if ($refNumber) $descParts[] = "Reference: {$refNumber}";\n    $descParts[] = "Movement: {$movementType}";\n    if ($caliber) $descParts[] = "Caliber: {$caliber}";\n    if ($module) $descParts[] = "Module: {$module}";\n    if ($features) $descParts[] = "Features: {$features}";\n    if ($caseSize) $descParts[] = "Case Size: {$caseSize}";\n    $caseMaterialEn = $MATERIAL_MAP[$caseMaterial] ?? $caseMaterial;\n    $bandTypeEn = $BAND_MAP[$bandType] ?? $bandType;\n    if ($caseMaterial) $descParts[] = "Case Material: {$caseMaterialEn}";\n    if ($bandType) $descParts[] = "Band: {$bandTypeEn}";\n    if ($bandSize) $descParts[] = "Band Size: {$bandSize}";\n    if ($accessories) $descParts[] = "Accessories: {$accessories}";\n    $descParts[] = "Country of Origin: {$countryOrigin}";\n    if ($colorEn) $descParts[] = "Dial Color: {$colorEn}";\n    if ($njdGender !== \'unisex\') $descParts[] = "Gender: {$njdGender}";',
    '    $descParts[] = "Brand: {$brandEn}";\n    if ($model) $descParts[] = "Model: {$model}";\n    if ($refNumber) $descParts[] = "Reference: {$refNumber}";\n    if (!empty($cameraType)) {\n        $descParts[] = "Type: {$cameraType}";\n        if ($features) $descParts[] = "Features: {$features}";\n        if ($accessories) $descParts[] = "Accessories: {$accessories}";\n        $descParts[] = "Country of Origin: {$countryOrigin}";\n    } else {\n        $descParts[] = "Movement: {$movementType}";\n        if ($caliber) $descParts[] = "Caliber: {$caliber}";\n        if ($module) $descParts[] = "Module: {$module}";\n        if ($features) $descParts[] = "Features: {$features}";\n        if ($caseSize) $descParts[] = "Case Size: {$caseSize}";\n        $caseMaterialEn = $MATERIAL_MAP[$caseMaterial] ?? $caseMaterial;\n        $bandTypeEn = $BAND_MAP[$bandType] ?? $bandType;\n        if ($caseMaterial) $descParts[] = "Case Material: {$caseMaterialEn}";\n        if ($bandType) $descParts[] = "Band: {$bandTypeEn}";\n        if ($bandSize) $descParts[] = "Band Size: {$bandSize}";\n        if ($accessories) $descParts[] = "Accessories: {$accessories}";\n        $descParts[] = "Country of Origin: {$countryOrigin}";\n        if ($colorEn) $descParts[] = "Dial Color: {$colorEn}";\n        if ($njdGender !== \'unisex\') $descParts[] = "Gender: {$njdGender}";\n    }'
))

# PATCH 2 - eBay aspects array
patches.append((
    "PATCH2",
    "    // Build aspects (item specifics)\n    $aspects = [\n        'Brand' => [$brandEn],\n        'Type' => ['Wristwatch'],\n        'Department' => [$genderEn],\n        'Movement' => [$movement],\n        'Country/Region of Manufacture' => [$countryEn],\n    ];\n    if ($model) $aspects['Model'] = [$model];\n    if ($refNumber) $aspects['Reference Number'] = [$refNumber];\n    if ($caliber) $aspects['Caliber'] = [$caliber];\n    if ($module) $aspects['Module Number'] = [$module];\n    if ($colorEn) $aspects['Dial Color'] = [$colorEn];\n    if ($caseSize) $aspects['Case Size'] = [$caseSize];\n    if ($materialEn) $aspects['Case Material'] = [$materialEn];\n    if ($bandEn) $aspects['Band Type'] = [$bandEn];\n    if ($featuresEn) $aspects[\"Features\"] = [substr($featuresEn, 0, 65)];\n    if ($bandSize) $aspects[\"Band Size\"] = [$bandSize];\n    // With Original Box/Packaging\n    $hasBox = (stripos($accessoriesEn, \"box\") !== false || stripos($accessoriesEn, \"full set\") !== false);\n    $aspects[\"With Original Box/Packaging\"] = [$hasBox ? \"Yes\" : \"No\"];\n    // With Papers\n    $hasPapers = (stripos($accessoriesEn, \"paper\") !== false || stripos($accessoriesEn, \"certificate\") !== false || stripos($accessoriesEn, \"full set\") !== false);\n    $aspects[\"With Papers\"] = [$hasPapers ? \"Yes\" : \"No\"];\n    $aspects[\"Customized\"] = [\"No\"];\n    $aspects[\"Style\"] = [\"Casual\"];\n    $displayType = (stripos($featuresEn, \"digital\") !== false) ? \"Digital\" : \"Analog\";\n    $aspects[\"Display\"] = [$displayType];",
    "    // Build aspects (item specifics)\n    $aspects = [\n        'Brand' => [$brandEn],\n        'Country/Region of Manufacture' => [$countryEn],\n    ];\n    if ($model) $aspects['Model'] = [$model];\n    if ($refNumber) $aspects['MPN'] = [$refNumber];\n    if ($featuresEn) $aspects[\"Features\"] = [substr($featuresEn, 0, 65)];\n\n    if (!empty($cameraType)) {\n        // Camera/photo aspects only\n        $aspects['Type'] = [$cameraType];\n    } else {\n        // Watch-specific aspects\n        $aspects['Type'] = ['Wristwatch'];\n        $aspects['Department'] = [$genderEn];\n        $aspects['Movement'] = [$movement];\n        if ($caliber) $aspects['Caliber'] = [$caliber];\n        if ($module) $aspects['Module Number'] = [$module];\n        if ($colorEn) $aspects['Dial Color'] = [$colorEn];\n        if ($caseSize) $aspects['Case Size'] = [$caseSize];\n        if ($materialEn) $aspects['Case Material'] = [$materialEn];\n        if ($bandEn) $aspects['Band Type'] = [$bandEn];\n        if ($bandSize) $aspects[\"Band Size\"] = [$bandSize];\n        // With Original Box/Packaging\n        $hasBox = (stripos($accessoriesEn, \"box\") !== false || stripos($accessoriesEn, \"full set\") !== false);\n        $aspects[\"With Original Box/Packaging\"] = [$hasBox ? \"Yes\" : \"No\"];\n        // With Papers\n        $hasPapers = (stripos($accessoriesEn, \"paper\") !== false || stripos($accessoriesEn, \"certificate\") !== false || stripos($accessoriesEn, \"full set\") !== false);\n        $aspects[\"With Papers\"] = [$hasPapers ? \"Yes\" : \"No\"];\n        $aspects[\"Customized\"] = [\"No\"];\n        $aspects[\"Style\"] = [\"Casual\"];\n        $displayType = (stripos($featuresEn, \"digital\") !== false) ? \"Digital\" : \"Analog\";\n        $aspects[\"Display\"] = [$displayType];\n    }"
))

# PATCH 3 - buildDescriptionHtml signature
patches.append((
    "PATCH3",
    "function buildDescriptionHtml($brand, $model, $ref, $movement, $caliber, $module,\n    $features, $dial, $caseSize, $material, $band, $bandSize, $gender, $accessories,\n    $country, $conditionDesc, $specialNotes, $aboutProduct = ''",
    "function buildDescriptionHtml($brand, $model, $ref, $movement, $caliber, $module,\n    $features, $dial, $caseSize, $material, $band, $bandSize, $gender, $accessories,\n    $country, $conditionDesc, $specialNotes, $aboutProduct = '', $cameraType = ''"
))

# PATCH 4 - buildDescriptionHtml body $specs array
patches.append((
    "PATCH4",
    "    $specs = [];\n    $specs['Brand'] = $brand;\n    if ($model) $specs['Model'] = $model;\n    if ($ref) $specs['Reference'] = $ref;\n    $specs['Movement'] = $movement;\n    if ($caliber) $specs['Caliber'] = $caliber;\n    if ($module) $specs['Module'] = $module;\n    if ($features) $specs['Features'] = $features;\n    if ($dial) $specs['Dial Color'] = $dial;\n    if ($caseSize) $specs['Case Size'] = $caseSize;\n    if ($material) $specs['Case Material'] = $material;\n    if ($band) $specs['Band'] = $band;\n    if ($bandSize) $specs['Band Size'] = $bandSize;\n    $specs['Department'] = $gender;\n    if ($accessories && $accessories !== 'None') $specs['Accessories'] = $accessories;\n    $specs['Origin'] = $country;",
    "    $specs = [];\n    $specs['Brand'] = $brand;\n    if ($model) $specs['Model'] = $model;\n    if ($ref) $specs['Reference'] = $ref;\n    if (!empty($cameraType)) {\n        $specs['Type'] = $cameraType;\n        if ($features) $specs['Features'] = $features;\n        if ($accessories && $accessories !== 'None') $specs['Accessories'] = $accessories;\n        $specs['Country of Origin'] = $country;\n    } else {\n        $specs['Movement'] = $movement;\n        if ($caliber) $specs['Caliber'] = $caliber;\n        if ($module) $specs['Module'] = $module;\n        if ($features) $specs['Features'] = $features;\n        if ($dial) $specs['Dial Color'] = $dial;\n        if ($caseSize) $specs['Case Size'] = $caseSize;\n        if ($material) $specs['Case Material'] = $material;\n        if ($band) $specs['Band'] = $band;\n        if ($bandSize) $specs['Band Size'] = $bandSize;\n        $specs['Department'] = $gender;\n        if ($accessories && $accessories !== 'None') $specs['Accessories'] = $accessories;\n        $specs['Origin'] = $country;\n    }"
))

# PATCH 5 - buildDescriptionHtml call site
patches.append((
    "PATCH5",
    "    $descHtml = buildDescriptionHtml(\n        $brandEn, $model, $refNumber, $movement, $caliber, $module,\n        $featuresEn, $colorEn, $caseSize, $materialEn, $bandEn, $bandSize,\n        $genderEn, $accessoriesEn, $countryEn, $conditionDesc, $specialNotes, $aboutProduct\n    );",
    "    $descHtml = buildDescriptionHtml(\n        $brandEn, $model, $refNumber, $movement, $caliber, $module,\n        $featuresEn, $colorEn, $caseSize, $materialEn, $bandEn, $bandSize,\n        $genderEn, $accessoriesEn, $countryEn, $conditionDesc, $specialNotes, $aboutProduct, $cameraType\n    );"
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
    print("File NOT written — fix the failing patch first.")
