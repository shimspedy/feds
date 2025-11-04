import os
import pandas as pd
import json

# Provide simple logging to confirm execution context
print("Current working directory:", os.getcwd())

FILE_PATH = './public/gw-loc-rates-2025.xlsx'
OUTPUT_PATH = './public/wildland-data.json'

try:
    excel_data = pd.ExcelFile(FILE_PATH)
except FileNotFoundError:
    print(f"File not found: {FILE_PATH}")
    raise SystemExit(1)

sheet_name = excel_data.sheet_names[0]
df = pd.read_excel(FILE_PATH, sheet_name=sheet_name)

wildland_data = {}

for _, row in df.iterrows():
    locname = str(row['LOCNAME']).strip()
    grade = f"GW{int(row['GRADE'])}"

    if locname not in wildland_data:
        wildland_data[locname] = {}

    if grade not in wildland_data[locname]:
        wildland_data[locname][grade] = []

    for step in range(1, 11):
        wildland_data[locname][grade].append({
            'step': step,
            'annual_salary': row.get(f'ANNUAL{step}', None),
            'hourly_salary': row.get(f'HOURLY{step}', None),
            'overtime_salary': row.get(f'OVERTIME{step}', None)
        })

with open(OUTPUT_PATH, 'w') as json_file:
    json.dump(wildland_data, json_file, indent=4)

print(f"Wildland firefighter JSON data has been saved to {OUTPUT_PATH}")
