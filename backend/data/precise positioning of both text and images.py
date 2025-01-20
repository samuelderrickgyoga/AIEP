import os
import json
import re
from PyPDF2 import PdfReader
import fitz
from PIL import Image
import io

def extract_structured_content(pdf_path):
    """
    Extracts chapters, text blocks and images with positional information
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    doc = fitz.open(pdf_path)
    structured_content = []
    
    # Create images directory at the start
    image_dir = os.path.join(os.path.dirname(pdf_path), 'images')
    os.makedirs(image_dir, exist_ok=True)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        page_dict = page.get_text("dict")
        
        # Extract text blocks with positions
        text_blocks = []
        for block in page_dict["blocks"]:
            if block["type"] == 0:
                text_blocks.append({
                    'text': ' '.join([line['spans'][0]['text'] for line in block['lines']]),
                    'bbox': block['bbox']
                })
        
        # Enhanced image extraction with validation
        images = []
        for img_index, img in enumerate(page.get_images(), start=1):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                if "image" not in base_image or "ext" not in base_image:
                    print(f"Skipping invalid image on page {page_num + 1}, xref {xref}")
                    continue
                
                image_bytes = base_image["image"]
                image_filename = f'image_p{page_num + 1}_{img_index}.{base_image["ext"]}'
                image_path = os.path.join(image_dir, image_filename)
                
                # Validate image data before saving
                try:
                    Image.open(io.BytesIO(image_bytes))
                    with open(image_path, 'wb') as img_file:
                        img_file.write(image_bytes)
                    
                    bbox = page.get_image_bbox(xref)
                    images.append({
                        'file_path': image_filename,
                        'bbox': bbox,
                        'format': base_image["ext"]
                    })
                except Exception as img_error:
                    print(f"Invalid image data on page {page_num + 1}: {img_error}")
                    continue
                    
            except Exception as extract_error:
                print(f"Error extracting image from page {page_num + 1}: {extract_error}")
                continue
        
        # Combine and sort content
        combined_content = []
        all_elements = (
            [(block, 'text') for block in text_blocks] +
            [(img, 'image') for img in images]
        )
        
        all_elements.sort(key=lambda x: x[0]['bbox'][1])
        
        for element, elem_type in all_elements:
            if elem_type == 'text':
                combined_content.append({
                    'type': 'text',
                    'content': element['text'],
                    'position': element['bbox']
                })
            else:
                combined_content.append({
                    'type': 'image',
                    'path': element['file_path'],
                    'position': element['bbox']
                })
        
        structured_content.append({
            'page_number': page_num + 1,
            'content': combined_content
        })
    
    doc.close()
    return structured_content

    """
    Extracts chapters, text blocks and images with positional information
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    
    doc = fitz.open(pdf_path)
    structured_content = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        page_dict = page.get_text("dict")
        
        # Extract text blocks with positions
        text_blocks = []
        for block in page_dict["blocks"]:
            if block["type"] == 0:  # Text block
                text_blocks.append({
                    'text': ' '.join([line['spans'][0]['text'] for line in block['lines']]),
                    'bbox': block['bbox']
                })
        
        # Extract images with positions
        images = []
        for img_index, img in enumerate(page.get_images()):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            bbox = page.get_image_bbox(xref)
            
            # Save image
            image_filename = f'image_p{page_num + 1}_{img_index + 1}.{base_image["ext"]}'
            image_path = os.path.join(os.path.dirname(pdf_path), 'images', image_filename)
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            
            with open(image_path, 'wb') as img_file:
                img_file.write(image_bytes)
            
            images.append({
                'file_path': image_filename,
                'bbox': bbox,
                'format': base_image["ext"]
            })
        
        # Combine text and images based on vertical position
        combined_content = []
        all_elements = (
            [(block, 'text') for block in text_blocks] +
            [(img, 'image') for img in images]
        )
        
        # Sort by vertical position (y-coordinate)
        all_elements.sort(key=lambda x: x[0]['bbox'][1])
        
        for element, elem_type in all_elements:
            if elem_type == 'text':
                combined_content.append({
                    'type': 'text',
                    'content': element['text'],
                    'position': element['bbox']
                })
            else:
                combined_content.append({
                    'type': 'image',
                    'path': element['file_path'],
                    'position': element['bbox']
                })
        
        structured_content.append({
            'page_number': page_num + 1,
            'content': combined_content
        })
    
    doc.close()
    return structured_content
def save_to_json(data, output_path):
    """
    Saves extracted chapters to JSON with proper formatting
    """
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
def generate_html_output(structured_content, output_dir):
    """
    Generates HTML with properly positioned text and images
    """
    html_content = ['<!DOCTYPE html><html><body>']
    
    for page in structured_content:
        html_content.append(f'<div class="page" id="page-{page["page_number"]}">')
        
        for element in page['content']:
            if element['type'] == 'text':
                html_content.append(f'<p>{element["content"]}</p>')
            else:
                html_content.append(
                    f'<img src="images/{element["path"]}" style="max-width:100%;">'
                )
        
        html_content.append('</div>')
    
    html_content.append('</body></html>')
    
    html_path = os.path.join(output_dir, 'output.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html_content))

# Add this at the beginning of your main() function
def main():
    # Get the correct path to your PDF file
    current_dir = os.getcwd()
    pdf_path = os.path.join(current_dir, 'data', 'pythonqt.pdf')
    output_dir = os.path.join(current_dir, 'output')
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'structured_content.json')
    
    try:
        content = extract_structured_content(pdf_path)
        save_to_json(content, output_file)
        generate_html_output(content, output_dir)
        print(f"Successfully processed PDF with positional information")
        print(f"JSON output saved to: {output_file}")
        print(f"HTML output saved to: {os.path.join(output_dir, 'output.html')}")
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")


if __name__ == "__main__":
    main()
