import os
import json
import re
from PyPDF2 import PdfReader

def extract_chapters_from_pdf(pdf_path):
    """
    Extracts chapters from PDF with improved chapter detection and content organization
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    reader = PdfReader(pdf_path)
    all_text = ""
    
    # Extract text with better formatting preservation
    for page in reader.pages:
        text = page.extract_text()
        # Normalize whitespace while preserving paragraph breaks
        text = re.sub(r'\s+', ' ', text)
        all_text += text + "\n"
    
    # Enhanced chapter pattern matching
    chapter_patterns = [
        r'Chapter\s+\d+[\s:]+([^\n]+)',
        r'CHAPTER\s+\d+[\s:]+([^\n]+)',
        r'CHAPTER\s+[A-Z]+[\s:]+([^\n]+)'
    ]
    
    chapters = {}
    current_chapter = None
    current_content = []
    
    # Process text line by line
    for line in all_text.split('\n'):
        is_chapter_header = False
        
        # Check for chapter headers
        for pattern in chapter_patterns:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                # Save previous chapter if exists
                if current_chapter:
                    chapters[current_chapter] = '\n'.join(current_content).strip()
                
                current_chapter = line.strip()
                current_content = []
                is_chapter_header = True
                break
        
        # Add line to current chapter content
        if not is_chapter_header and current_chapter:
            current_content.append(line.strip())
    
    # Save the last chapter
    if current_chapter:
        chapters[current_chapter] = '\n'.join(current_content).strip()
    
    return chapters

def save_to_json(data, output_path):
    """
    Saves extracted chapters to JSON with proper formatting
    """
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    pdf_path = os.path.join(data_dir, 'pythonqt.pdf')
    output_file = os.path.join(data_dir, 'chapters.json')
    
    try:
        chapters = extract_chapters_from_pdf(pdf_path)
        save_to_json(chapters, output_file)
        print(f"Successfully extracted {len(chapters)} chapters to {output_file}")
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    main()
