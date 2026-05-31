# encoding: utf-8
path = "/home/u991230906/domains/api.newjapandeals.com/public_html/api/moltbot/receive.php"
with open(path) as f:
    content = f.read()

patches = []

# PATCH A — Authentic Japanese Timepiece header
old_a = """  <div style="color:#888;font-size:13px;margin-top:5px;">Authentic Japanese Timepiece</div>
</div>';"""
new_a = """  <div style="color:#888;font-size:13px;margin-top:5px;">' . (!empty($cameraType) ? 'Authentic Japanese Camera/Item' : 'Authentic Japanese Timepiece') . '</div>
</div>';"""
patches.append(("PATCH_A", old_a, new_a))

# PATCH B — About This Watch label
old_b = """  <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">✨ About This Watch</div>"""
new_b = """  <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">✨ About This ' . (!empty($cameraType) ? 'Item' : 'Watch') . '</div>"""
patches.append(("PATCH_B", old_b, new_b))

# PATCH C — authentic Japanese timepieces
old_c = """    <strong>New Japan Deals</strong> - Your direct source for authentic Japanese timepieces.<br><br>"""
new_c = """    <strong>New Japan Deals</strong> - Your direct source for authentic Japanese ' . (!empty($cameraType) ? 'cameras and collectibles' : 'timepieces') . '.<br><br>"""
patches.append(("PATCH_C", old_c, new_c))

# PATCH D — How we check our watches paragraph
old_d = """    <strong>How we check our watches:</strong><br>
    Repair costs in Japan are expensive. We prefer to sell watches as-is without opening the back cover. For quartz watches, we replace the battery only when time permits. For automatic and hand-winding watches, we check by shaking or winding - if the hands move, we call it "running." We do not measure accuracy or water resistance. We are sellers, not watch repair professionals.<br><br>"""
new_d = """    <strong>' . (!empty($cameraType) ? 'How we check our cameras and items' : 'How we check our watches') . ':</strong><br>
    ' . (!empty($cameraType) ? 'Repair costs in Japan are expensive. We prefer to sell items as-is without disassembly. For cameras and lenses, we check basic operation only - shutter click, power on, focus engagement. For mechanical items, we test brief operation. We do not test image quality, light meter accuracy, sensor health, or perform internal cleaning. We are sellers, not professional repair technicians.' : 'Repair costs in Japan are expensive. We prefer to sell watches as-is without opening the back cover. For quartz watches, we replace the battery only when time permits. For automatic and hand-winding watches, we check by shaking or winding - if the hands move, we call it "running." We do not measure accuracy or water resistance. We are sellers, not watch repair professionals.') . '<br><br>"""
patches.append(("PATCH_D", old_d, new_d))

failed = False
for name, old, new in patches:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"{name}: REPLACED")
    else:
        print(f"{name}: NOT FOUND — STOPPING")
        print(f"Searched (first 120 chars): {repr(old[:120])}")
        failed = True
        break

if not failed:
    with open(path, "w") as f:
        f.write(content)
    print("File written.")
else:
    print("File NOT written.")
