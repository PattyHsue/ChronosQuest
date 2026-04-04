from PIL import Image
import os

assets_dir = r'd:\AntiG\GAG_test2026\assets'
boss_files = ['forest_boss.png', 'desert_boss.png', 'ocean_boss.png']

for filename in boss_files:
    file_path = os.path.join(assets_dir, filename)
    if os.path.exists(file_path):
        img = Image.open(file_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Check if the pixel is near white (greater than 240 in all channels)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0)) # Make it transparent
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(file_path, "PNG")
        print(f"Processed: {filename}")
    else:
        print(f"Not found: {filename}")
