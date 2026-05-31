# encoding: utf-8
pm_path = "/home/u991230906/domains/api.newjapandeals.com/public_html/admin/product-manager.html"

with open(pm_path, encoding='utf-8') as f:
    pm = f.read()

pm_patches = []

# PATCH 1 — replace single Category dropdown with Primary Category
old1 = """                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select id="editCategory" class="w-full border rounded-lg px-3 py-2">
                                <option value="">— Not set —</option>
                                <option value="watches">⌚ Watches</option>
                                <option value="diecast-toys">🚗 Die-cast &amp; Toys</option>
                                <option value="camera-accessories">📷 Camera Accessories</option>
                                <option value="other">📦 Other</option>
                            </select>
                        </div>"""
new1 = """                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Primary Category</label>
                            <select id="editPrimaryCategory" class="w-full border rounded-lg px-3 py-2">
                                <option value="watches">⌚ Watches</option>
                                <option value="antique">🏺 Antique / Vintage</option>
                                <option value="cameras">📷 Cameras &amp; Photo</option>
                                <option value="electronics">🔌 Electronics</option>
                                <option value="games">🎮 Games &amp; Consoles</option>
                                <option value="miniatures">🚗 Diecast &amp; Miniatures</option>
                                <option value="fashion">👔 Fashion &amp; Accessories</option>
                                <option value="souvenirs">🎁 Souvenirs</option>
                            </select>
                        </div>"""
pm_patches.append(("PATCH_1", old1, new1))

# PATCH 2 — insert Secondary Categories + Gender before Description
old2 = """                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="editDescription" rows="4" class="w-full border rounded-lg px-3 py-2"></textarea>
                    </div>"""
new2 = """                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Secondary Categories (optional, click to toggle)</label>
                        <div id="editSecondaryCategoriesGrid" class="flex flex-wrap gap-2 p-2 border rounded-lg bg-gray-50"></div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select id="editGender" class="w-full border rounded-lg px-3 py-2">
                            <option value="na">— Not applicable —</option>
                            <option value="mens">Men's</option>
                            <option value="womens">Women's</option>
                            <option value="unisex">Unisex</option>
                            <option value="kids">Kids</option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="editDescription" rows="4" class="w-full border rounded-lg px-3 py-2"></textarea>
                    </div>"""
pm_patches.append(("PATCH_2", old2, new2))

# PATCH 3 — rewrite editProduct() — exact text from file (no typo, correct spacing)
old3 = """        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;

            document.getElementById('editId').value          = product.id;
            document.getElementById('editTitle').value       = product.title_en || product.title || product.name || '';
            document.getElementById('editBrand').value       = product.brand || '';
            document.getElementById('editModel').value       = product.model || '';
            document.getElementById('editCategory').value    = product.category || '';
            document.getElementById('editCondition').value   = product.condition || '';
            document.getElementById('editPriceJpy').value    = product.price_jpy || 0;
            document.getElementById('editStatus').value      = product.status || 'draft';
            document.getElementById('editDescription').value = product.description || product.description_en || '';
            document.getElementById('editMercariUrl').value  = product.mercari_url || '';

            document.getElementById('editModal').classList.remove('hidden');
        }"""
new3 = """        // 8 categories for multi-category editing
        const ALL_CATEGORIES = [
            { slug: 'watches',     label: '⌚ Watches' },
            { slug: 'antique',     label: '🏺 Antique' },
            { slug: 'cameras',     label: '📷 Cameras' },
            { slug: 'electronics', label: '🔌 Electronics' },
            { slug: 'games',       label: '🎮 Games' },
            { slug: 'miniatures',  label: '🚗 Miniatures' },
            { slug: 'fashion',     label: '👔 Fashion' },
            { slug: 'souvenirs',   label: '🎁 Souvenirs' }
        ];

        let editSelectedSecondary = new Set();

        function renderEditSecondaryChips() {
            const grid = document.getElementById('editSecondaryCategoriesGrid');
            if (!grid) return;
            const primary = document.getElementById('editPrimaryCategory').value;
            grid.innerHTML = '';
            ALL_CATEGORIES.filter(c => c.slug !== primary).forEach(c => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = c.label;
                btn.className = editSelectedSecondary.has(c.slug)
                    ? 'px-3 py-1 text-xs rounded-full bg-teal-500 text-white border border-teal-500'
                    : 'px-3 py-1 text-xs rounded-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-100';
                btn.onclick = () => {
                    if (editSelectedSecondary.has(c.slug)) editSelectedSecondary.delete(c.slug);
                    else editSelectedSecondary.add(c.slug);
                    renderEditSecondaryChips();
                };
                grid.appendChild(btn);
            });
        }

        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;

            document.getElementById('editId').value          = product.id;
            document.getElementById('editTitle').value       = product.title_en || product.title || product.name || '';
            document.getElementById('editBrand').value       = product.brand || '';
            document.getElementById('editModel').value       = product.model || '';

            // Load multi-category data
            const slugs = Array.isArray(product.category_slugs) ? product.category_slugs : ['watches'];
            const primarySlug = slugs[0] || 'watches';
            document.getElementById('editPrimaryCategory').value = primarySlug;
            editSelectedSecondary = new Set(slugs.slice(1));
            renderEditSecondaryChips();

            document.getElementById('editGender').value      = product.gender || 'na';
            document.getElementById('editCondition').value   = product.condition || '';
            document.getElementById('editPriceJpy').value    = product.price_jpy || 0;
            document.getElementById('editStatus').value      = product.status || 'draft';
            document.getElementById('editDescription').value = product.description || product.description_en || '';
            document.getElementById('editMercariUrl').value  = product.mercari_url || '';

            document.getElementById('editModal').classList.remove('hidden');
        }

        // Re-render secondary chips when primary category changes
        document.addEventListener('DOMContentLoaded', () => {
            const primarySel = document.getElementById('editPrimaryCategory');
            if (primarySel) {
                primarySel.addEventListener('change', () => {
                    editSelectedSecondary.delete(primarySel.value);
                    renderEditSecondaryChips();
                });
            }
        });"""
pm_patches.append(("PATCH_3", old3, new3))

# PATCH 4 — update submit data object to send category_slugs + gender
old4 = "                category:        document.getElementById('editCategory').value,"
new4 = """                category_slugs: [document.getElementById('editPrimaryCategory').value, ...Array.from(editSelectedSecondary)],
                gender:          document.getElementById('editGender').value,"""
pm_patches.append(("PATCH_4", old4, new4))

pm_failed = False
for name, old, new in pm_patches:
    if old in pm:
        pm = pm.replace(old, new, 1)
        print(f"{name}: REPLACED")
    else:
        print(f"{name}: NOT FOUND")
        print(f"  Searched (first 120 chars): {repr(old[:120])}")
        pm_failed = True
        break

if not pm_failed:
    with open(pm_path, 'w', encoding='utf-8') as f:
        f.write(pm)
    print("product-manager.html written.")
else:
    print("product-manager.html NOT written.")
