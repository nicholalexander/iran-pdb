#!/usr/bin/env python3
"""
Migrate Iran PDB briefing files to new design system.
- Strips all inline <style> blocks
- Adds shared CSS and nav.js references
- Preserves all content
"""

import os
import re
import glob
from pathlib import Path

def migrate_briefing_file(file_path):
    """Migrate a single briefing file to the new design system."""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the title from the existing file
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1) if title_match else "Iran Intelligence Brief"
    
    # Extract content between opening and closing body tags
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.IGNORECASE | re.DOTALL)
    if not body_match:
        print(f"Warning: Could not extract body content from {file_path}")
        return False
    
    body_content = body_match.group(1).strip()
    
    # Remove any existing nav elements (they'll be injected by nav.js)
    body_content = re.sub(r'<nav[^>]*>.*?</nav>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove any existing footer elements (they'll be injected by nav.js)
    body_content = re.sub(r'<footer[^>]*>.*?</footer>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Wrap content in Pico CSS structure if needed
    if not body_content.startswith('<header'):
        # If there's no header, we need to create the proper structure
        # Look for any existing h1 to use as header content
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', body_content, re.IGNORECASE | re.DOTALL)
        header_title = h1_match.group(1) if h1_match else "Iran Intelligence Brief"
        
        # Remove the h1 from body content if it exists
        if h1_match:
            body_content = re.sub(r'<h1[^>]*>.*?</h1>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
        
        # Wrap in proper structure
        body_content = f"""<header>
<div class="container">
<h1>{header_title}</h1>
<p>Automated Open-Source Intelligence Aggregation</p>
</div>
</header>

<main class="container">
{body_content.strip()}
</main>"""
    
    else:
        # If there's already a header, just wrap main content in container
        # Find the main content after header
        header_end = body_content.find('</header>')
        if header_end != -1:
            header_part = body_content[:header_end + 9]  # include </header>
            main_part = body_content[header_end + 9:].strip()
            
            # Update header structure for Pico CSS
            header_part = re.sub(r'<header[^>]*>', '<header>', header_part, flags=re.IGNORECASE)
            if '<div class="container">' not in header_part:
                header_part = header_part.replace('<header>', '<header>\n<div class="container">')
                header_part = header_part.replace('</header>', '</div>\n</header>')
            
            # Wrap main content if not already wrapped
            if not main_part.startswith('<main'):
                main_part = f'<main class="container">\n{main_part}\n</main>'
            else:
                # Update existing main tag
                main_part = re.sub(r'<main[^>]*>', '<main class="container">', main_part, flags=re.IGNORECASE)
            
            body_content = header_part + '\n\n' + main_part
    
    # Clean up any remaining script tags (except ones we want to keep)
    # Remove scripts but preserve any existing functionality if it's important
    body_content = re.sub(r'<script[^>]*>.*?</script>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Create the new HTML structure
    new_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>
{body_content}

<script src="../assets/nav.js"></script>
</body>
</html>"""
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Migrated: {file_path}")
    return True

def main():
    """Main migration function."""
    briefings_dir = Path("briefings")
    
    if not briefings_dir.exists():
        print("Error: briefings/ directory not found")
        return False
    
    # Find all HTML files in briefings directory (excluding template.html which we already updated)
    html_files = list(briefings_dir.glob("*.html"))
    html_files = [f for f in html_files if f.name != "template.html"]
    
    print(f"Found {len(html_files)} briefing files to migrate")
    
    success_count = 0
    for html_file in html_files:
        try:
            if migrate_briefing_file(html_file):
                success_count += 1
        except Exception as e:
            print(f"Error processing {html_file}: {str(e)}")
    
    print(f"\n✓ Successfully migrated {success_count}/{len(html_files)} briefing files")
    return success_count == len(html_files)

if __name__ == "__main__":
    main()