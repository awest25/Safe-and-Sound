import pandas as pd
import numpy as np
import sys
import json

# crime dataset calls it "LAT" and "LONG"
def rename_lat_long_columns(s):
    if s == "LAT":
        return "latitude"
    if s == "LONG":
        return "longitude"

def rename_string(s):
    return s.replace(" ", "_").lower()

# https://www.mongodb.com/docs/manual/geospatial-queries/
def check_long_lat(long, lat):
    if long < -180 or long > 180:
        raise ValueError("Longitude must be between -180 and 180")
    if lat < -90 or lat > 90:
        raise ValueError("Latitude must be between -90 and 90")

# Follow expected format
# "location":{"type":"Point","coordinates":[-43.18015675229857,-22.92638234778768]}}
def transform_long_lat(long, lat):
    # Order is always longitude, latitude
    return {"type": "Point", "coordinates": [long, lat]}

if __name__ == "__main__":
    # Read cmd line arg
    file_path = sys.argv[1]

    df = pd.read_csv(file_path)
    df = df.rename(columns=rename_string)

    # Rename columns
    df.apply(lambda x: rename_lat_long_columns(x.name), axis=0)

    # Check if long and lat are valid
    df.apply(lambda x: check_long_lat(x["longitude"], x["latitude"]), axis=1)

    # Transform long and lat to geojson format
    df["location"] = df.apply(lambda x: transform_long_lat(x["longitude"], x["latitude"]), axis=1)

    # Do not need these columns anymore
    df = df.drop(columns=["longitude", "latitude"])

    # Save df as json
    json_file_path = file_path[:file_path.rfind(".")] + ".json"
    df.to_json(json_file_path, orient="records", lines=True)
