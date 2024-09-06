import os
from pdf2image import convert_from_path

def pdf_to_png(pdf_path, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Convert PDF to images
    images = convert_from_path(pdf_path)

    # Save each page as a separate PNG
    for i, image in enumerate(images):
        output_path = os.path.join(output_folder, f"page_{i+1}.png")
        image.save(output_path, "PNG")
        print(f"Saved page {i+1} as {output_path}")

# Usage
pdf_file = "shape+poems.pdf"  # Replace with your PDF file name
output_folder = "pdf_pages"  # The folder where PNG files will be saved

pdf_to_png(pdf_file, output_folder)

print("Conversion complete!")