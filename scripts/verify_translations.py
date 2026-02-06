#!/usr/bin/env python3
"""Verify all translation files have correct structure"""

import json
import os

langs = ['en', 'da', 'de', 'uk', 'pl', 'ro', 'ru']

# Load English keys as reference
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)
    en_keys = set(en_data.keys())

print("Translation Files Verification")
print("=" * 50)

all_valid = True
for lang in langs:
    filepath = f'messages/{lang}.json'
    exists = os.path.exists(filepath)
    
    if exists:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
                lang_keys = set(lang_data.keys())
                keys_match = lang_keys == en_keys
                
                print(f"{lang}.json: ✓ Exists, Keys match: {keys_match}")
                
                if not keys_match:
                    missing = en_keys - lang_keys
                    extra = lang_keys - en_keys
                    if missing:
                        print(f"  Missing keys: {missing}")
                    if extra:
                        print(f"  Extra keys: {extra}")
                    all_valid = False
        except Exception as e:
            print(f"{lang}.json: ✗ Error reading file: {e}")
            all_valid = False
    else:
        print(f"{lang}.json: ✗ File does not exist")
        all_valid = False

print("=" * 50)
if all_valid:
    print("✓ All translation files are valid!")
else:
    print("✗ Some translation files have issues")

print(f"\nTotal files: {len([l for l in langs if os.path.exists(f'messages/{l}.json')])}/{len(langs)}")
