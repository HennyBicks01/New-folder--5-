import os
from PIL import Image

# Set the input and output directories
input_dir = "LetterImages"
output_dir = "ProcessedLetterImages"

# Create the output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Process each PNG file in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith(".png"):
        input_path = os.path.join(input_dir, filename)
        
        # Open the image
        with Image.open(input_path) as img:
            # Rotate the image 90 degrees counterclockwise
            rotated_img = img.rotate(90, expand=True)
            
            # Crop 30 pixels from the bottom
            width, height = rotated_img.size
            cropped_img = rotated_img.crop((0, 0, width, height - 30))
            
            # Calculate the middle point
            mid_point = width // 2
            
            # Split the image into two halves
            left_half = cropped_img.crop((0, 0, mid_point, height - 30))
            right_half = cropped_img.crop((mid_point, 0, width, height - 30))
            
            # Save the two halves
            base_name = os.path.splitext(filename)[0]
            left_half.save(os.path.join(output_dir, f"{base_name}_left.png"))
            right_half.save(os.path.join(output_dir, f"{base_name}_right.png"))
        
        print(f"Processed {filename}")

print("Processing complete!")