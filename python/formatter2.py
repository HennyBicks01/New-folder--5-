import os
from PIL import Image

# Set the input and output directories
input_dir = "Letters"
output_dir = "LettersFormatted"

# Create the output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Process each PNG file in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith(".png"):
        input_path = os.path.join(input_dir, filename)
        
        # Open the image
        with Image.open(input_path) as img:
            # Convert the image to RGBA mode (if it's not already)
            img = img.convert("RGBA")
            
            # Get the dimensions of the image
            width, height = img.size
            
            # Crop 20 pixels from each side
            cropped_img = img.crop((20, 20, width - 20, height - 20))
            
            # Create a new image with transparent background
            new_img = Image.new("RGBA", cropped_img.size, (0, 0, 0, 0))
            
            # Paste the cropped image onto the transparent background
            for x in range(cropped_img.width):
                for y in range(cropped_img.height):
                    pixel = cropped_img.getpixel((x, y))
                    if pixel[3] != 0:  # If the pixel is not fully transparent
                        new_img.putpixel((x, y), pixel)
            
            # Save the processed image
            output_path = os.path.join(output_dir, filename)
            new_img.save(output_path, "PNG")
        
        print(f"Processed {filename}")

print("Processing complete!")