import os
import json
import re
from PyPDF2 import PdfReader
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(base_dir, 'data')

os.makedirs(data_dir, exist_ok=True)

courses_path = os.path.join(data_dir, 'C and C++.pdf')

def extract_chapters_from_pdf(pdf_path):
    """
    Extracts entire chapters from a PDF file based on chapter markers.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        dict: A dictionary with chapter titles as keys and their content as values.
    """
    # Check if the file exists
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    # Load the PDF file
    reader = PdfReader(pdf_path)
    all_text = ""
    
    # Combine all pages' text into a single string
    for page in reader.pages:
        all_text += page.extract_text() + "\n"
    
    # Define a regex pattern to identify chapter titles (e.g., "Chapter 1", "Chapter 2")
    chapter_pattern = r"(Chapter\s\d+|CHAPTER\s\d+|CHAPTER [A-Z]+)"
    
    # Split text into chapters based on the pattern
    chapters = re.split(chapter_pattern, all_text, flags=re.IGNORECASE)
    
    # Clean up and structure chapters
    chapter_data = {}
    for i in range(1, len(chapters), 2):  # Skip non-chapter content
        title = chapters[i].strip()  # Chapter title
        content = chapters[i + 1].strip() if i + 1 < len(chapters) else ""
        chapter_data[title] = content
    
    return chapter_data

def save_to_json(data, output_path):
    """
    Saves the extracted chapters into a JSON file.

    Args:
        data (dict): Extracted chapter data.
        output_path (str): Path to save the JSON file.
    """
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

# Example Usage
if __name__ == "__main__":
    pdf_file = courses_path  # Replace with your PDF file
    output_file = "chapters.json"  # Output JSON file

    try:
        chapters = extract_chapters_from_pdf(pdf_file)
        save_to_json(chapters, output_file)
        print(f"Extracted chapters saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")
