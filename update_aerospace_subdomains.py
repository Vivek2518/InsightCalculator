import os
import json
from collections import OrderedDict

def update_json_files():
    base_path = 'src/calculators/aerospace'
    
    mapping = {
        # Aerodynamics (subdomain: "Atmosphere")
        "mach-number": "Atmosphere",
        "speed-of-sound": "Atmosphere",
        "air-density": "Atmosphere",
        "pressure-vs-altitude": "Atmosphere",
        "temperature-lapse-rate": "Atmosphere",
        
        # Flight Mechanics (subdomain: "Performance")
        "lift-force": "Performance",
        "drag-force": "Performance",
        "lift-to-drag-ratio": "Performance",
        "stall-speed": "Performance",
        "wing-loading": "Performance",
        "glide-ratio": "Performance",
        
        # Propulsion (subdomain: "Rocketry")
        "thrust": "Rocketry",
        "thrust-to-weight": "Rocketry",
        "specific-impulse": "Rocketry",
        "fuel-consumption": "Rocketry",
        
        # Space (subdomain: "Orbital Mechanics")
        "escape-velocity": "Orbital Mechanics",
        "orbital-velocity": "Orbital Mechanics",
        "orbital-period": "Orbital Mechanics",
        "circular-orbit-speed": "Orbital Mechanics",
        
        # Structures
        "wing-aspect-ratio": "Wing Geometry",
        "structural-load-factor": "Structural Loads",
        
        # Drone
        "drone-flight-time": "Battery & Energy",
        "battery-capacity-converter": "Battery & Energy",
        "battery-discharge-rate": "Battery & Energy",
        "energy-density": "Battery & Energy",
        "power-consumption": "Power & Motors",
        "motor-efficiency": "Power & Motors",
        "hover-power": "Power & Motors"
    }

    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                slug = file.replace('.json', '')
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        data = json.load(f, object_pairs_hook=OrderedDict)
                    except json.JSONDecodeError:
                        print(f"Error decoding {file_path}")
                        continue

                # Update category
                data['category'] = 'aerospace'
                
                # Determine subdomain
                subdomain = mapping.get(slug)
                if not subdomain:
                    print(f"No mapping for {slug}")
                    continue

                # Add subdomain after subcategory
                new_data = OrderedDict()
                subdomain_added = False
                for key, value in data.items():
                    new_data[key] = value
                    if key == 'subcategory':
                        new_data['subdomain'] = subdomain
                        subdomain_added = True
                    elif key == 'subdomain':
                        # If it already exists, update it (though we already added it if subcategory came first)
                        new_data['subdomain'] = subdomain
                        subdomain_added = True

                # If subcategory wasn't found (unlikely), add subdomain after category
                if not subdomain_added:
                    new_data = OrderedDict()
                    for key, value in data.items():
                        new_data[key] = value
                        if key == 'category':
                            new_data['subdomain'] = subdomain

                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(new_data, f, indent=2, ensure_ascii=False)
                print(f"Updated {file_path}")

if __name__ == "__main__":
    update_json_files()
