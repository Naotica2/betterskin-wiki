# Download & Install Skin Packs

Don't want to make your own? No problem! You can download ready-made Skin Packs that contain hundreds of amazing skins and use them immediately.

## 📥 Recommended Skin Pack

We highly recommend downloading **Bedrock Skin Packs** from Modrinth. It contains a massive collection of official Bedrock Edition skins that are fully compatible with Better Skin!

👉 **[Download Bedrock Skin Packs on Modrinth](https://modrinth.com/resourcepack/bedrock-skin-packs)**

## How to Install a Downloaded Skin Pack

It depends on what type of file you downloaded. 

💡 **How to know which one you have?**
Open the `.zip` file you just downloaded and look inside:
- If you see a file named `pack.mcmeta`, it is a **Resource Pack** (Type A).
- If you see `skins.json` or just images, it is a **Standard Skin Pack** (Type B).

### Type A: Resource Packs (Like the "Bedrock Skin Packs" from Modrinth)
Some massive skin packs are packaged as Minecraft Resource Packs. 
1. Download the `.zip` file.
2. Put the `.zip` file inside your `.minecraft/resourcepacks/` folder.
3. Open Minecraft, go to **Options -> Resource Packs**, and **Enable** the pack.
4. The skins will now magically appear in the Better Skin Download Packs tab!

### Type B: Standard Skin Packs (Community Made)
If a friend sent you a skin pack, or you downloaded a standard one, it goes into the mod's dedicated folder.
1. Download the `.zip` file and extract it.
2. Find your Minecraft folder and open the `skin_packs` folder (`.minecraft/skin_packs/`).
   *(If the folder doesn't exist yet, create it!)*
3. Place the extracted folder inside `skin_packs`. 
   Make sure the result looks like this:
```
.minecraft/skin_packs/SomeSkinPack/
├── skins.json
├── geometry.json
├── skin1.png
├── skin2.png
└── ...
```

> ⚠️ **Common Mistake:** Make sure `skins.json` is NOT nested inside an extra folder! 
> - ✅ Correct: `.minecraft/skin_packs/MyPack/skins.json`
> - ❌ Wrong: `.minecraft/skin_packs/MyPack/MyPack/skins.json`

**Step 5:** Restart Minecraft (or re-open the Better Skin menu). Your new skins will appear in the list! 🎉
