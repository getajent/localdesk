#!/usr/bin/env python3
"""
Script to generate translation files for remaining languages.
This creates placeholder translations with the same structure as English.
"""

import json
import os

# Read the English translation file
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Translation mappings for key UI elements
translations = {
    'uk': {  # Ukrainian
        'Home': 'Головна',
        'Services': 'Послуги',
        'Knowledge': 'Знання',
        'Guidance': 'Керівництво',
        'Sign In': 'Увійти',
        'Sign Up': 'Зареєструватися',
        'Sign Out': 'Вийти',
        'Privacy': 'Конфіденційність',
        'Terms': 'Умови',
        'Contact': 'Контакт',
        'Denmark': 'Данія',
        'Send': 'Надіслати',
        'Stop': 'Зупинити',
        'Thinking...': 'Думаю...',
        'Email Address': 'Електронна адреса',
        'Password': 'Пароль',
    },
    'pl': {  # Polish
        'Home': 'Strona główna',
        'Services': 'Usługi',
        'Knowledge': 'Wiedza',
        'Guidance': 'Przewodnik',
        'Sign In': 'Zaloguj się',
        'Sign Up': 'Zarejestruj się',
        'Sign Out': 'Wyloguj się',
        'Privacy': 'Prywatność',
        'Terms': 'Warunki',
        'Contact': 'Kontakt',
        'Denmark': 'Dania',
        'Send': 'Wyślij',
        'Stop': 'Zatrzymaj',
        'Thinking...': 'Myślę...',
        'Email Address': 'Adres e-mail',
        'Password': 'Hasło',
    },
    'ro': {  # Romanian
        'Home': 'Acasă',
        'Services': 'Servicii',
        'Knowledge': 'Cunoștințe',
        'Guidance': 'Ghid',
        'Sign In': 'Autentificare',
        'Sign Up': 'Înregistrare',
        'Sign Out': 'Deconectare',
        'Privacy': 'Confidențialitate',
        'Terms': 'Termeni',
        'Contact': 'Contact',
        'Denmark': 'Danemarca',
        'Send': 'Trimite',
        'Stop': 'Oprește',
        'Thinking...': 'Gândesc...',
        'Email Address': 'Adresă de email',
        'Password': 'Parolă',
    },
    'ru': {  # Russian
        'Home': 'Главная',
        'Services': 'Услуги',
        'Knowledge': 'Знания',
        'Guidance': 'Руководство',
        'Sign In': 'Войти',
        'Sign Up': 'Зарегистрироваться',
        'Sign Out': 'Выйти',
        'Privacy': 'Конфиденциальность',
        'Terms': 'Условия',
        'Contact': 'Контакт',
        'Denmark': 'Дания',
        'Send': 'Отправить',
        'Stop': 'Остановить',
        'Thinking...': 'Думаю...',
        'Email Address': 'Электронная почта',
        'Password': 'Пароль',
    }
}

def translate_value(value, lang_code, translations_map):
    """Simple translation function - translates known strings, keeps others as English"""
    if isinstance(value, str):
        return translations_map.get(value, value)
    return value

def translate_dict(data, lang_code, translations_map):
    """Recursively translate dictionary values"""
    if isinstance(data, dict):
        return {k: translate_dict(v, lang_code, translations_map) for k, v in data.items()}
    elif isinstance(data, list):
        return [translate_dict(item, lang_code, translations_map) for item in data]
    elif isinstance(data, str):
        return translate_value(data, lang_code, translations_map)
    else:
        return data

# Generate translation files for remaining languages
for lang_code, trans_map in translations.items():
    output_file = f'messages/{lang_code}.json'
    
    # Create translated data (mostly English with key translations)
    translated_data = translate_dict(en_data, lang_code, trans_map)
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f'Created {output_file}')

print('Translation files generated successfully!')
