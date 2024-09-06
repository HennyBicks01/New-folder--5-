import os

def rename_files(folder_path):
    # Ensure the folder path exists
    if not os.path.exists(folder_path):
        print(f"The folder '{folder_path}' does not exist.")
        return

    # Iterate through all files in the folder
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.mp3') and 'alphabet' in filename.lower():
            # Construct the full file path
            old_path = os.path.join(folder_path, filename)
            
            # Create the new filename by removing 'alphabet'
            new_filename = filename.lower().replace('alphabet', '').strip()
            new_filename = new_filename.replace('  ', ' ')  # Remove double spaces if any
            new_filename = new_filename.capitalize()  # Capitalize the first letter
            
            # Construct the new file path
            new_path = os.path.join(folder_path, new_filename)
            
            # Rename the file
            os.rename(old_path, new_path)
            print(f"Renamed: {filename} -> {new_filename}")

# Usage
folder_path = "Alphabet song"  # Replace with the actual path if different

rename_files(folder_path)

print("Renaming complete!")