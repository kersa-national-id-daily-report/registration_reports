import pandas as pd
from datetime import datetime, timedelta

# Load the registration data
data = pd.read_csv('registrations.csv')

# Convert the 'date' column to datetime format
data['date'] = pd.to_datetime(data['date'])

# Calculate weekly totals
data['week'] = data['date'].dt.strftime('%Y-%U')  # Group by year and week number
weekly_totals = data.groupby('week').sum().reset_index()

# Generate the HTML report
html_report = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; text-align: center; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; }
        h2 { margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Registration Report</h1>
    <p>Generated on: {current_date}</p>

    <h2>Daily Registrations</h2>
    <table>
        <tr>
            <th>Date</th>
            <th>Getachew Dires</th>
            <th>Ermiyas Tegegne</th>
            <th>Amar Anwar</th>
            <th>Abenezer Afework</th>
            <th>Mustefa</th>
            <th>Emebet Kassahun</th>
            <th>Firomsa Tamiru</th>
            <th>Roman Gelan</th>
            <th>Total</th>
        </tr>
        {daily_rows}
    </table>

    <h2>Weekly Registrations</h2>
    <table>
        <tr>
            <th>Week</th>
            <th>Getachew Dires</th>
            <th>Ermiyas Tegegne</th>
            <th>Amar Anwar</th>
            <th>Abenezer Afework</th>
            <th>Mustefa</th>
            <th>Emebet Kassahun</th>
            <th>Firomsa Tamiru</th>
            <th>Roman Gelan</th>
            <th>Total</th>
        </tr>
        {weekly_rows}
    </table>
</body>
</html>
"""

# Generate daily table rows
daily_rows = ""
for index, row in data.iterrows():
    total = row[1:].sum()  # Sum all partner registrations for the day
    daily_rows += f"""
    <tr>
        <td>{row['date'].strftime('%Y-%m-%d')}</td>
        <td>{row['Getachew Dires']}</td>
        <td>{row['Ermiyas Tegegne']}</td>
        <td>{row['Amar Anwar']}</td>
        <td>{row['Abenezer Afework']}</td>
        <td>{row['Mustefa']}</td>
        <td>{row['Emebet Kassahun']}</td>
        <td>{row['Firomsa Tamiru']}</td>
        <td>{row['Roman Gelan']}</td>
        <td>{total}</td>
    </tr>
    """

# Generate weekly table rows
weekly_rows = ""
for index, row in weekly_totals.iterrows():
    total = row[1:].sum()  # Sum all partner registrations for the week
    weekly_rows += f"""
    <tr>
        <td>Week {row['week'].split('-')[1]}</td>
        <td>{row['Getachew Dires']}</td>
        <td>{row['Ermiyas Tegegne']}</td>
        <td>{row['Amar Anwar']}</td>
        <td>{row['Abenezer Afework']}</td>
        <td>{row['Mustefa']}</td>
        <td>{row['Emebet Kassahun']}</td>
        <td>{row['Firomsa Tamiru']}</td>
        <td>{row['Roman Gelan']}</td>
        <td>{total}</td>
    </tr>
    """

# Insert rows and current date into the HTML template
current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
html_report = html_report.format(current_date=current_date, daily_rows=daily_rows, weekly_rows=weekly_rows)

# Save the report as an HTML file
with open('registration_report.html', 'w') as file:
    file.write(html_report)

print("Report generated successfully!")