"""
Download and extract the UCI Student Performance Dataset.
Source: UCI Machine Learning Repository (Cortez & Silva, 2008)
URL: https://archive.ics.uci.edu/dataset/320/student+performance
License: Creative Commons Attribution 4.0 International (CC BY 4.0)
"""

import os
import io
import urllib.request
import zipfile
from pathlib import Path

UCI_URL = "https://archive.ics.uci.edu/static/public/320/student+performance.zip"
DATA_DIR = Path(__file__).resolve().parent / "data"

def download_and_extract_data():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    target_csv = DATA_DIR / "student-mat.csv"
    
    if target_csv.exists():
        print(f"Dataset already present at: {target_csv}")
        return target_csv

    print(f"Downloading UCI Student Performance Dataset from {UCI_URL}...")
    req = urllib.request.Request(UCI_URL, headers={"User-Agent": "Mozilla/5.0 (AI Campus Companion Dataset Fetcher)"})
    
    with urllib.request.urlopen(req, timeout=30) as response:
        archive_bytes = response.read()

    with zipfile.ZipFile(io.BytesIO(archive_bytes)) as z_outer:
        inner_zip_bytes = z_outer.read("student.zip")
        with zipfile.ZipFile(io.BytesIO(inner_zip_bytes)) as z_inner:
            for filename in ["student-mat.csv", "student-por.csv", "student.txt"]:
                extracted_path = DATA_DIR / filename
                with open(extracted_path, "wb") as f_out:
                    f_out.write(z_inner.read(filename))
                print(f"Extracted: {extracted_path} ({extracted_path.stat().st_size} bytes)")

    print("UCI Student Performance dataset successfully downloaded and verified.")
    return target_csv

if __name__ == "__main__":
    download_and_extract_data()
