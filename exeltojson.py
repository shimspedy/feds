import pandas as pd
import json

# Load the Excel file
file_path = '/data/2024-general-schedule-pay-ratesxls.xlsx'
excel_data = pd.ExcelFile(file_path)

# Assuming the relevant data is in the first sheet
sheet_name = excel_data.sheet_names[0]
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Adjust the code to match the column names in the DataFrame

gs_data = {}
for index, row in df.iterrows():
    state = row['LOCNAME']
    grade = row['GRADE']
    for step in range(1, 11):
        salary = row[f'ANNUAL{step}']
        if state not in gs_data:
            gs_data[state] = []
        gs_data[state].append({
            'year': 2024,  # Since the year is 2024 based on the file name
            'grade': grade,
            'step': step,
            'salary': salary
        })

json_data = json.dumps(gs_data, indent=4)

# Save the JSON data to a file
json_file_path = '/data/gs-data.json'
with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

json_file_path
