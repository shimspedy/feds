import pandas as pd
import json

# Load the Excel file
file_path = '/Users/johnhashim/Desktop/staticsites/feds/2024-general-schedule-pay-ratesxls.xlsx'
excel_data = pd.ExcelFile(file_path)

# Assuming the relevant data is in the first sheet
sheet_name = excel_data.sheet_names[0]
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Convert the DataFrame to a dictionary and then to JSON
gs_data = {}
for index, row in df.iterrows():
    locname = row['LOCNAME']
    grade = f"GS {row['GRADE']}"
    if locname not in gs_data:
        gs_data[locname] = {}
    if grade not in gs_data[locname]:
        gs_data[locname][grade] = []

    for step in range(1, 11):
        salary = row[f'ANNUAL{step}']
        gs_data[locname][grade].append({
            'step': step,
            'salary': salary
        })

json_data = json.dumps(gs_data, indent=4)

# Save the JSON data to a file
json_file_path = '/Users/johnhashim/Desktop/staticsites/feds/gs-data.json'
with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

print(f"JSON data has been saved to {json_file_path}")
