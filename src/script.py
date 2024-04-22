import pandas as pd
path = '../data/data.csv'
df = pd.read_csv(path)
# filtered_df = df[df['county_name'].str.contains(', ma', case=False)]
# columns_to_remove = ['new_listing_count_mm','new_listing_count_yy','active_listing_count_mm', 'active_listing_count_yy']
# df.drop(columns=columns_to_remove, inplace=True)
for col in df.columns:
    print(col)

# df.to_csv('../data/new_file.csv', index=False)  # Set index=False to avoid writing row indices to the CSV file
# df.to_csv('new_data.csv', index=False)