#!/usr/bin/env python3
"""
Migrate Iran PDB section pages to new design system.
- Strips all inline <style> blocks except where noted
- Adds shared CSS and nav.js references
- Preserves all JavaScript functionality
- Handles special cases like feeds (dark theme) and map (Leaflet CSS)
"""

import os
import re
import glob
from pathlib import Path

# Special handling for different page types
SPECIAL_PAGES = {
    'feeds/index.html': {
        'dark_theme': True,
        'preserve_styles': False,  # Strip the dark theme styles, use Pico's dark theme
        'preserve_scripts': True
    },
    'map/index.html': {
        'external_css': [
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css'
        ],
        'preserve_scripts': True,
        'preserve_styles': False  # Strip inline styles, keep external Leaflet CSS
    },
    'timeline/index.html': {
        'preserve_scripts': True,
        'preserve_styles': False
    }
}

def get_page_config(file_path):
    """Get configuration for a specific page."""
    rel_path = str(file_path).replace(str(Path.cwd()) + '/', '')
    return SPECIAL_PAGES.get(rel_path, {'preserve_scripts': True, 'preserve_styles': False})

def extract_scripts(content):
    """Extract all script tags from content."""
    scripts = re.findall(r'<script[^>]*>.*?</script>', content, re.IGNORECASE | re.DOTALL)
    return scripts

def migrate_section_file(file_path):
    """Migrate a single section file to the new design system."""
    print(f"Processing: {file_path}")
    
    config = get_page_config(file_path)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the title from the existing file
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1) if title_match else "Iran PDB"
    
    # Extract any external CSS links we want to preserve
    existing_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', content, re.IGNORECASE)
    
    # Extract content between opening and closing body tags
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.IGNORECASE | re.DOTALL)
    if not body_match:
        print(f"Warning: Could not extract body content from {file_path}")
        return False
    
    body_content = body_match.group(1).strip()
    
    # Preserve scripts if configured to do so
    scripts = []
    if config.get('preserve_scripts', True):
        scripts = extract_scripts(body_content)
        # Remove script tags from body content - we'll add them back at the end
        body_content = re.sub(r'<script[^>]*>.*?</script>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove any existing nav elements (they'll be injected by nav.js)
    body_content = re.sub(r'<nav[^>]*>.*?</nav>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove any existing footer elements (they'll be injected by nav.js)
    body_content = re.sub(r'<footer[^>]*>.*?</footer>', '', body_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Structure the body content properly
    if not body_content.startswith('<header'):
        # Extract h1 for header
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', body_content, re.IGNORECASE | re.DOTALL)
        header_title = h1_match.group(1) if h1_match else "Iran PDB"
        
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
        # Update existing header structure
        header_end = body_content.find('</header>')
        if header_end != -1:
            header_part = body_content[:header_end + 9]
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
                main_part = re.sub(r'<main[^>]*>', '<main class="container">', main_part, flags=re.IGNORECASE)
            
            body_content = header_part + '\n\n' + main_part
    
    # Determine base path for CSS/JS links
    depth = str(file_path).count('/') - str(Path.cwd()).count('/') - 1
    base_path = '../' * depth if depth > 0 else ''
    
    # Build CSS links
    css_links = [f'<link rel="stylesheet" href="{base_path}assets/style.css">']
    
    # Add any external CSS for special pages (like Leaflet for map)
    if 'external_css' in config:
        for css_url in config['external_css']:
            css_links.insert(-1, f'<link rel="stylesheet" href="{css_url}">')
    
    # Handle dark theme for feeds page
    html_attrs = ''
    if config.get('dark_theme'):
        html_attrs = ' data-theme="dark"'
    
    # Add preserved scripts back
    script_tags = []
    for script in scripts:
        script_tags.append(script)
    
    # Always add nav.js
    script_tags.append(f'<script src="{base_path}assets/nav.js"></script>')
    
    # Create the new HTML structure
    new_content = f"""<!DOCTYPE html>
<html lang="en"{html_attrs}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
{chr(10).join(css_links)}
</head>
<body>
{body_content}

{chr(10).join(script_tags)}
</body>
</html>"""
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Migrated: {file_path}")
    return True

def main():
    """Main migration function."""
    section_files = [
        "timeline/index.html",
        "analysis/index.html",
        "map/index.html", 
        "sources/index.html",
        "predictions/index.html",
        "historical/index.html",
        "energy/index.html",
        "data/index.html",
        "verification/index.html",
        "feeds/index.html"
    ]
    
    # Add analysis sub-pages
    analysis_dir = Path("analysis")
    if analysis_dir.exists():
        analysis_files = [f for f in analysis_dir.glob("*.html") if f.name != "index.html"]
        section_files.extend([str(f) for f in analysis_files])
    
    # Add historical sub-pages  
    historical_dir = Path("historical")
    if historical_dir.exists():
        historical_files = [f for f in historical_dir.glob("*.html") if f.name != "index.html"]
        section_files.extend([str(f) for f in historical_files])
    
    # Filter to only existing files
    existing_files = [f for f in section_files if Path(f).exists()]
    
    print(f"Found {len(existing_files)} section files to migrate")
    
    success_count = 0
    for section_file in existing_files:
        try:
            if migrate_section_file(Path(section_file)):
                success_count += 1
        except Exception as e:
            print(f"Error processing {section_file}: {str(e)}")
    
    print(f"\n✓ Successfully migrated {success_count}/{len(existing_files)} section files")
    return success_count == len(existing_files)

if __name__ == "__main__":
    main()