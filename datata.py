import json
import re

# Load the JSON files
with open('./public/state_abbreviations.json', 'r') as f:
    state_abbreviations = json.load(f)

with open('./public/leo-data.json', 'r') as f:
    leo_data = json.load(f)

with open('./public/US_States_and_Cities.json', 'r') as f:
    states_and_cities = json.load(f)

# Load the leostates-full-names.js
with open('./public/leostates-full-names.js', 'r') as f:
    leostates_full_names_content = f.read()
    # Extract JSON object from JavaScript file content
    leostates_full_names_json = re.search(r'const stateMap = ({.*});', leostates_full_names_content, re.DOTALL).group(1)
    leostates_full_names = json.loads(leostates_full_names_json)

# Reverse the state abbreviation mapping
abbr_to_state = {abbr: state for state, abbr in state_abbreviations.items()}

# Create a comprehensive mapping from multi-state regions to individual states
multi_state_mapping = {}

for region_abbr, region_name in leostates_full_names.items():
    states_in_region = re.findall(r'\b[A-Z]{2}\b', region_name)
    for state_abbr in states_in_region:
        if state_abbr in abbr_to_state:
            state_name = abbr_to_state[state_abbr]
            if state_name not in multi_state_mapping:
                multi_state_mapping[state_name] = []
            multi_state_mapping[state_name].append(region_abbr)

# Generate the data structure
state_pages = {}

for state, cities in states_and_cities.items():
    state_abbr = state_abbreviations.get(state)
    if state_abbr:
        codes = multi_state_mapping.get(state, ["RUS"])  # Default to "RUS" if no codes found
        state_pages[state] = {
            "abbreviation": state_abbr,
            "codes": codes,
            "cities": cities
        }

# Combine the data with LEO information based on the codes
output_data = {
    "states": state_pages,
    "leo_data": {code: leo_data.get(code, {}) for code in set(sum(multi_state_mapping.values(), []))}
}

# Save the result to a JSON file in the public directory
output_file_path = './public/state_pages.json'
with open(output_file_path, 'w') as outfile:
    json.dump(output_data, outfile, indent=4)

print(f"Data has been saved to {output_file_path}")
