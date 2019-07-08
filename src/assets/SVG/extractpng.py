import sys
 
from base64 import b64decode
from lxml import etree 
 
 
 # We define the proper XML namespaces to query the SVG.
NS = {
     'svg': 'http://www.w3.org/2000/svg',
     'xlink': 'http://www.w3.org/1999/xlink',
 }
 
 
def print_help():
     print('./extract-images-svg.py SVG_FILE')
     print('This will extract the images included in b64 in the SVG.')
 
 
def extract_images_svg(file_name):
     # We open the file.
     with open(file_name) as svg_file:
         svg = etree.parse(svg_file)
 
     # We find all images with xpath.
     images = svg.xpath('.//svg:image', namespaces=NS)
     for index, img in enumerate(images):
         # We get the value of the image.
         content = img.get('{http://www.w3.org/1999/xlink}href')
         # We check it is a base64 image. If so, we extract it.
         if content.startswith('data:image/'):
             # We take the content of the image and its metadata
             # (only the format of the image is relevant to us).
             meta, img_b64 = content.split(';base64,')
             _, img_format = meta.split('/')
             # Replace the base64 data by a link to an external image in the proper format.
             img_file_name = 'img-{index}.{format}'.format(index=index, format=img_format)
             img.set('{http://www.w3.org/1999/xlink}href', img_file_name)
             # Save the extracted image.
             with open(img_file_name, 'wb') as img_file:
                 img_file.write(b64decode(img_b64))
 
     # Save the "corrected" SVG file.
     with open('svg-without-images.svg', 'w') as svg_file:
         svg_content = etree.tostring(svg)\
                 .decode('utf-8')\
                 .replace('&gt;', '>')
         svg_file.write(svg_content)
 
 
if __name__ == "__main__":
     if len(sys.argv) != 2:
         print_help()
         sys.exit(0)
 
     extract_images_svg(sys.argv[1])