from PIL import Image
import os

png_path = r'C:\Users\paths\.gemini\antigravity\brain\7de8c7ba-b8cd-4138-b44d-4c1b904ae540\chronos_quest_icon_1775096787712.png'
ico_path = r'd:\AntiG\GAG_test2026\assets\icon.ico'

if os.path.exists(png_path):
    img = Image.open(png_path)
    # Windows icon sizes
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save(ico_path, sizes=icon_sizes)
    print(f"Successfully created icon: {ico_path}")
else:
    print(f"Error: PNG not found at {png_path}")
