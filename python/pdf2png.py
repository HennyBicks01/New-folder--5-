import os
from pdf2image import convert_from_path

# Set the input and output directories
input_dir = "Letters"
output_dir = "LetterImages"

# Create the output directory if it doesn't exist
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Process each PDF file in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(input_dir, filename)
        
        # Convert PDF to image
        images = convert_from_path(pdf_path)
        
        # Save the first page as PNG
        output_filename = os.path.splitext(filename)[0] + ".png"
        output_path = os.path.join(output_dir, output_filename)
        images[0].save(output_path, "PNG")
        
        print(f"Converted {filename} to {output_filename}")

print("Conversion complete!")