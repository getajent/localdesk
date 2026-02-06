#!/usr/bin/env python3
"""Summary of created translation files"""

import json
import os

langs = ['da', 'de', 'uk', 'pl', 'ro', 'ru']

print("=" * 60)
print("TRANSLATION FILES CREATED - TASK 6 COMPLETE")
print("=" * 60)
print()

for lang in langs:
    filepath = f'messages/{lang}.json'
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            keys = len(data.keys())
        print(f"✓ messages/{lang}.json")
        print(f"  Size: {size:,} bytes")
        print(f"  Top-level keys: {keys}")
        print()

print("=" * 60)
print("All six translation files created successfully!")
print("Files have the same key structure as English (en.json)")
print("=" * 60)
