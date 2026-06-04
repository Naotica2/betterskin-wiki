# Custom 3D Geometry (Blockbench)

Want a skin that looks like a robot, a dinosaur, or has wings? You can create custom 3D models using Blockbench!

> ⚠️ Note: For custom geometry, you must use the **Advanced Way** (Method 2 from [Create Your Own Skin Packs](create-your-own-skin-packs.md)).

## Step 1: Create the Model in Blockbench
1. Open [Blockbench](https://www.blockbench.net/) and create a new **Bedrock Entity** model.
2. Build your custom model and paint the texture.
3. Export the Geometry: `File → Export → Export Bedrock Geometry` (Save as `geometry.json`).
4. Export the Texture: Save as a `.png` file.

## Step 2: Add it to your Skin Pack
Put the `geometry.json` and texture `.png` inside your skin pack folder:
```
.minecraft/skin_packs/My3DPack/
├── skins.json
├── geometry.json
└── dino_texture.png
```

## Step 3: Link it in `skins.json`
Open the `geometry.json` file you exported. Look for the `"identifier"` value (e.g., `"geometry.dino_model"`).
Copy that identifier and put it in your `skins.json`:
```json
{
  "serialize_name": "My3DPack",
  "localization_name": "My 3D Pack",
  "skins": [
    {
      "localization_name": "Dinosaur Skin",
      "geometry": "geometry.dino_model",
      "texture": "dino_texture.png",
      "type": "free"
    }
  ]
}
```

## Multiple 3D Models in One Pack
If your skins use different 3D models, you can either:
- Export them into **separate files** (e.g., `knight.json`, `ninja.json`) and put them all in your folder. The mod reads all `.json` files automatically!
- Or put multiple geometries into a **single** `geometry.json`. Both work perfectly.
