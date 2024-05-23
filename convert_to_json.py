
import os
import pandas as pd
import json

# Print the current working directory to help debug the file path issue
print("Current working directory:", os.getcwd())

# Load the Excel file
file_path = './public/2024-general-schedule-pay-ratesxls.xlsx'
try:
    excel_data = pd.ExcelFile(file_path)
except FileNotFoundError:
    print(f"File not found: {file_path}")
    exit(1)

# Assuming the relevant data is in the first sheet
sheet_name = excel_data.sheet_names[0]
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Convert the DataFrame to a dictionary and then to JSON
gs_data = {}
for index, row in df.iterrows():
    locname = row['LOCNAME']
    grade = f"GS{row['GRADE']}"
    if locname not in gs_data:
        gs_data[locname] = {}
    if grade not in gs_data[locname]:
        gs_data[locname][grade] = []

    for step in range(1, 11):
        annual_salary = row.get(f'ANNUAL{step}', None)
        hourly_salary = row.get(f'HOURLY{step}', None)
        overtime_salary = row.get(f'OVERTIME{step}', None)
        gs_data[locname][grade].append({
            'step': step,
            'annual_salary': annual_salary,
            'hourly_salary': hourly_salary,
            'overtime_salary': overtime_salary
        })

json_data = json.dumps(gs_data, indent=4)

# Save the JSON data to a file
json_file_path = './public/gs-data.json'
with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

print(f"JSON data has been saved to {json_file_path}")
