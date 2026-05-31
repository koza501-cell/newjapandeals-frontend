path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/moltbot/receive.php"
with open(path) as f:
    content = f.read()

# PATCH 3 - two-step:
# Step A: replace the <ol>...(9 items)...</ol> block inside the single-quoted string
#         with a break-out: ' . $disclaimerItems . '
# Step B: insert the $disclaimerItems variable before the $html .= ' at line ~1027

old_ol = (
    '<ol style="font-size:15px;line-height:2.0;color:#333;">\n'
    '<li><strong style="color:#d84315;">Sold As-Is:</strong> Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a watch appears running in photos, battery condition may change during shipping.</li>\n'
    '<li><strong style="color:#d84315;">Battery Shipping Notice:</strong> Due to international shipping regulations, parcels containing batteries (watches, gadgets, etc.) may need to be shipped by sea instead of air to certain countries. We may contact the buyer to confirm whether they prefer to receive the product with or without the battery.</li>\n'
    '<li><strong style="color:#d84315;">Cleaning:</strong> Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.</li>\n'
    '<li><strong style="color:#d84315;">Measurements:</strong> Measurements (band size, case size, etc.) are taken manually and may have minor inaccuracies.</li>\n'
    '<li><strong style="color:#d84315;">Quartz/Solar/Eco-Drive Batteries:</strong> Any battery included is for testing purposes only. Buyers should expect to replace the battery after purchase.</li>\n'
    '<li><strong style="color:#d84315;">Solar &amp; Eco-Drive:</strong> Solar and Eco-Drive batteries undergo limited testing only. Buyers may need to replace or recharge the battery if performance is weak.</li>\n'
    '<li><strong style="color:#d84315;">Mechanical Watches:</strong> Automatic and hand-winding watches are tested by shaking or winding for less than one minute to confirm basic operation. We do not measure timekeeping accuracy or power reserve. Buyers should consider professional servicing.</li>\n'
    "<li><strong style=\"color:#d84315;\">Water Resistance:</strong> Water resistance ratings in descriptions reflect the manufacturer\\'s original specification only. We do not test water resistance.</li>\n"
    '<li><strong style="color:#d84315;">Internal Condition:</strong> Products are generally not opened for internal inspection. We cannot guarantee that previous owners have not made internal modifications.</li>\n'
    '</ol>'
)

new_ol = (
    '<ol style="font-size:15px;line-height:2.0;color:#333;">\n'
    "' . \$disclaimerItems . '\n"
    '</ol>'
)

# Step B: the variable to insert before $html .= '\n</div>\n\n\n\n<div style="margin:20px 0
anchor = '    $html .= \'\n</div>\n\n\n\n<div style="margin:20px 0;padding:20px;background:#ff5252;'

watch_items = (
    '<li><strong style="color:#d84315;">Sold As-Is:</strong> Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a watch appears running in photos, battery condition may change during shipping.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Battery Shipping Notice:</strong> Due to international shipping regulations, parcels containing batteries (watches, gadgets, etc.) may need to be shipped by sea instead of air to certain countries. We may contact the buyer to confirm whether they prefer to receive the product with or without the battery.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Cleaning:</strong> Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Measurements:</strong> Measurements (band size, case size, etc.) are taken manually and may have minor inaccuracies.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Quartz/Solar/Eco-Drive Batteries:</strong> Any battery included is for testing purposes only. Buyers should expect to replace the battery after purchase.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Solar &amp; Eco-Drive:</strong> Solar and Eco-Drive batteries undergo limited testing only. Buyers may need to replace or recharge the battery if performance is weak.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Mechanical Watches:</strong> Automatic and hand-winding watches are tested by shaking or winding for less than one minute to confirm basic operation. We do not measure timekeeping accuracy or power reserve. Buyers should consider professional servicing.</li>' + "\n"
    + "<li><strong style=\"color:#d84315;\">Water Resistance:</strong> Water resistance ratings in descriptions reflect the manufacturer\\'s original specification only. We do not test water resistance.</li>" + "\n"
    + '<li><strong style="color:#d84315;">Internal Condition:</strong> Products are generally not opened for internal inspection. We cannot guarantee that previous owners have not made internal modifications.</li>'
)

camera_items = (
    '<li><strong style="color:#d84315;">Sold As-Is:</strong> Products are sourced directly from individual sellers in Japan and resold without professional repair or restoration. Even if a camera/item appears working in photos, condition may change during shipping.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Battery Shipping Notice:</strong> Due to international shipping regulations, parcels containing batteries may need to be shipped by sea instead of air to certain countries. We may contact the buyer to confirm whether they prefer to receive the product with or without the battery.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Cleaning:</strong> Products are wiped clean but not professionally cleaned. Some dust or residue may be present upon arrival.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Measurements:</strong> Measurements (size, weight, etc.) are taken manually and may have minor inaccuracies.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Camera Operation:</strong> Cameras and lenses are tested only for basic operation (power on, shutter click, focus). We do not test image quality, autofocus accuracy, light meter, or shutter speed accuracy.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Sensor &amp; Optics:</strong> We do not perform sensor cleaning, lens cleaning, or fungus inspection. Buyers should expect to clean or service before professional use.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Batteries &amp; Chargers:</strong> If included, batteries are for testing only and may not hold charge. Original chargers may or may not be included &mdash; check description carefully.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Film Cameras:</strong> For film cameras, light seals, meters, and shutter speeds may need servicing. Sold as collectible / for restoration.</li>' + "\n"
    + '<li><strong style="color:#d84315;">Internal Condition:</strong> Products are generally not opened for internal inspection. We cannot guarantee that previous owners have not made internal modifications.</li>'
)

# Build the disclaimer block PHP code to insert before the anchor
disclaimer_var = (
    "    if (!empty($cameraType)) {\n"
    "        $disclaimerItems = '" + camera_items + "';\n"
    "    } else {\n"
    "        $disclaimerItems = '" + watch_items + "';\n"
    "    }\n"
)

# Apply step A
if old_ol in content:
    content = content.replace(old_ol, new_ol, 1)
    print("PATCH3-A (ol block): REPLACED")
else:
    print("PATCH3-A (ol block): NOT FOUND")
    idx = content.find('<li><strong style="color:#d84315;">Water Resistance:')
    if idx >= 0:
        print("Found Water Resistance at", idx)
        print(repr(content[idx-20:idx+120]))
    exit(1)

# Apply step B
if anchor in content:
    content = content.replace(anchor, disclaimer_var + anchor, 1)
    print("PATCH3-B (disclaimer var insert): REPLACED")
else:
    print("PATCH3-B (anchor): NOT FOUND")
    print(repr(anchor[:80]))
    exit(1)

with open(path, "w") as f:
    f.write(content)
print("File written.")
