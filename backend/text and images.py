import os
import json
import re
from PyPDF2 import PdfReader
import fitz  # PyMuPDF
from PIL import Image
import io

def extract_chapters_and_images(pdf_path):
    """
    Extracts chapters and images from PDF with improved detection and organization
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    # Text extraction using PyPDF2
    reader = PdfReader(pdf_path)
    all_text = ""
    
    for page in reader.pages:
        text = page.extract_text()
        text = re.sub(r'\s+', ' ', text)
        all_text += text + "\n"
    
    # Chapter pattern matching
    chapter_patterns = [
        r'Chapter\s+\d+[\s:]+([^\n]+)',
        r'CHAPTER\s+\d+[\s:]+([^\n]+)',
        r'CHAPTER\s+[A-Z]+[\s:]+([^\n]+)'
    ]
    
    chapters = {}
    current_chapter = None
    current_content = []
    
    for line in all_text.split('\n'):
        is_chapter_header = False
        
        for pattern in chapter_patterns:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                if current_chapter:
                    chapters[current_chapter] = '\n'.join(current_content).strip()
                
                current_chapter = line.strip()
                current_content = []
                is_chapter_header = True
                break
        
        if not is_chapter_header and current_chapter:
            current_content.append(line.strip())
    
    if current_chapter:
        chapters[current_chapter] = '\n'.join(current_content).strip()
    
    # Image extraction using PyMuPDF
    doc = fitz.open(pdf_path)
    images = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images()
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            
            # Convert to PIL Image for processing
            image = Image.open(io.BytesIO(image_bytes))
            
            # Create image info dictionary
            image_info = {
                'page_num': page_num + 1,
                'image_num': img_index + 1,
                'format': base_image["ext"],
                'width': image.width,
                'height': image.height
            }
            images.append(image_info)
            
            # Save image
            image_filename = f'image_p{page_num + 1}_{img_index + 1}.{base_image["ext"]}'
            image_path = os.path.join(os.path.dirname(pdf_path), 'images', image_filename)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            
            with open(image_path, 'wb') as img_file:
                img_file.write(image_bytes)
            image_info['file_path'] = image_filename
    
    doc.close()
    
    return {'chapters': chapters, 'images': images}

def save_to_json(data, output_path):
    """
    Saves extracted content to JSON with proper formatting
    """
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    pdf_path = os.path.join(data_dir, 'pythonqt.pdf')
    output_file = os.path.join(data_dir, 'content.json')
    
    try:
        content = extract_chapters_and_images(pdf_path)
        save_to_json(content, output_file)
        print(f"Successfully extracted {len(content['chapters'])} chapters and {len(content['images'])} images")
        print(f"Results saved to {output_file}")
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    main()
