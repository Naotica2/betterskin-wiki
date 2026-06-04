# Create Your Own Skin Packs

There are two ways to create your own skins: The **Easy Way** (In-Game) and the **Advanced Way** (Folders & JSON).

## 🟢 Method 1: The Easy Way (Directly In-Game)
You can build a Skin Pack entirely inside Minecraft without touching any code!

1. Open the Better Skin menu in-game.
2. Click the **Create Skin Pack** (or Add Pack) button at the bottom. Give your new pack a cool name.
3. Once the pack is created, click the **Edit (Pencil)** icon next to it.
4. Click **Import Skin**. A file dialog will open on your computer.
5. Select your skin `.png` file from your computer (HD skins like 128x128 work too!).
6. Give your skin a name, and choose whether it uses the **Wide** (Steve) or **Slim** (Alex) model.
7. **(Optional)** You can also attach a **Custom Cape** image here!
8. Click **Confirm**, and the mod will automatically build the skin pack for you!

Want to add more skins to the same pack? Just repeat steps 3-8! You can add as many skins as you want to a single pack.

---

## 🔴 Method 2: The Advanced Way (Folders & JSON)
If you want to share your pack with others, or use **Custom 3D Geometry** from Blockbench, you need to build it manually.

All skin packs go inside: `👉 .minecraft/skin_packs/`

**Folder Structure Example:**
```
.minecraft/skin_packs/MyAwesomePack/
├── skins.json
├── my_hd_skin.png
└── my_custom_cape.png
```

**Writing `skins.json` (with multiple skins & capes):**
```json
{
  "serialize_name": "MyAwesomePack",
  "localization_name": "My Awesome Pack",
  "skins": [
    {
      "localization_name": "Blue Knight",
      "geometry": "geometry.humanoid.custom",
      "texture": "blue_knight.png",
      "type": "free"
    },
    {
      "localization_name": "Red Ninja",
      "geometry": "geometry.humanoid.customSlim",
      "texture": "red_ninja.png",
      "cape": "ninja_cape.png",
      "type": "free"
    }
  ]
}
```

**Important Notes:**
- Use `geometry.humanoid.custom` for **Wide (Steve)** model.
- Use `geometry.humanoid.customSlim` for **Slim (Alex)** model.
- The `"cape"` line is optional. If you remove it, the skin will use your official Mojang cape instead.
- Each skin must be separated by a comma `,` inside the `"skins": [ ... ]` array.

---

## 🤝 Sharing Your Skin Pack
Once your folder is ready and tested in-game:
1. Simply ZIP the entire folder (e.g., `MyAwesomePack.zip`).
2. Share it on Discord, Modrinth, or PlanetMinecraft.
3. Tell your friends to extract it into their `.minecraft/skin_packs/` folder!
