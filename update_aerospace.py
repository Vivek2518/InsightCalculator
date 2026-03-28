import os
import json

def update_json_files(directory, old_sub, new_sub, old_tag, new_tag):
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            changed = False
            if data.get('subcategory') == old_sub:
                data['subcategory'] = new_sub
                changed = True
            
            if 'tags' in data and isinstance(data['tags'], list):
                new_tags = []
                for tag in data['tags']:
                    if tag == old_tag:
                        new_tags.append(new_tag)
                        changed = True
                    else:
                        new_tags.append(tag)
                data['tags'] = new_tags
            
            if changed:
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print(f"Updated {filepath}")

# Update aerodynamics
update_json_files(
    r'C:\Users\vivek\OneDrive\Documents\Vivek\InsightCalculator\src\calculators\aerospace\aerodynamics',
    'atmosphere', 'aerodynamics',
    'atmosphere', 'aerodynamics'
)

# Update space
update_json_files(
    r'C:\Users\vivek\OneDrive\Documents\Vivek\InsightCalculator\src\calculators\aerospace\space',
    'orbital-mechanics', 'space',
    'orbital-mechanics', 'space'
)
