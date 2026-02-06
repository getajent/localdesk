#!/usr/bin/env python3
"""Create Danish translation file based on English"""

import json
import copy

# Read English
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Danish translations
danish_trans = {
    'Home': 'Hjem',
    'Services': 'Tjenester',
    'Knowledge': 'Viden',
    'Guidance': 'Vejledning',
    'Privacy': 'Privatliv',
    'Terms': 'Vilkår',
    'Contact': 'Kontakt',
    'Denmark': 'Danmark',
    'Location': 'Placering',
    'Resources': 'Ressourcer',
    'Legal': 'Juridisk',
    'Connect': 'Forbind',
    'Sign In': 'Log ind',
    'Sign Up': 'Tilmeld',
    'Sign Out': 'Log ud',
    'Exit': 'Log ud',
    'Member Access': 'Medlemsadgang',
    'Access': 'Adgang',
    'Verified User': 'Verificeret Bruger',
    'Toggle theme': 'Skift tema',
    'Light': 'Lys',
    'Dark': 'Mørk',
    'Back to Home': 'Tilbage til Hjem',
    'Healthcare': 'Sundhed',
    'Making': 'Gør',
    'feel like Home.': 'føles som Hjem.',
    'The Mission': 'Missionen',
    'clarity': 'klarhed',
    'and absolute ease.': 'og absolut lethed.',
    'Start a Conversation': 'Start en Samtale',
    'How we help': 'Hvordan vi hjælper',
    'Built for': 'Bygget til',
    'the modern': 'den moderne',
    'expat.': 'udlænding.',
    'Performance': 'Ydeevne',
    'Swift Answers': 'Hurtige Svar',
    'Trusted Details': 'Pålidelige Detaljer',
    'Ease': 'Lethed',
    'No Sign-up Required': 'Ingen Tilmelding Påkrævet',
    'Service': 'Service',
    'Always Ready': 'Altid Klar',
    'Our Services': 'Vores Tjenester',
    'Expert guidance for your journey in Denmark': 'Ekspertvejledning til din rejse i Danmark',
    'Expert Guidance': 'Ekspertvejledning',
    'Personal Consulting': 'Personlig Rådgivning',
    'Documentation': 'Dokumentation',
    'Document Assistance': 'Dokumenthjælp',
    'Relocation': 'Flytning',
    'Relocation Support': 'Flytningsstøtte',
    'Ongoing Support': 'Løbende Support',
    'Personalized Guidance': 'Personlig Vejledning',
    'Conversation': 'Samtale',
    'Mode': 'Tilstand',
    'Full Page': 'Fuld Side',
    'Exit Full': 'Afslut Fuld',
    'New Session': 'Ny Session',
    'Send': 'Send',
    'Stop': 'Stop',
    'Thinking...': 'Tænker...',
    'Getting ready...': 'Gør klar...',
    'Ask a question...': 'Stil et spørgsmål...',
    'Welcome Back': 'Velkommen Tilbage',
    'New Member': 'Nyt Medlem',
    'Join the Club': 'Bliv Medlem',
    'Email Address': 'E-mailadresse',
    'Password': 'Adgangskode',
    'Create Account': 'Opret Konto',
    'Processing...': 'Behandler...',
    'Privacy Policy': 'Privatlivspolitik',
    'Terms of Service': 'Servicevilkår',
    'Last updated: {date}': 'Sidst opdateret: {date}',
}

def translate_recursively(obj, trans_map):
    """Recursively translate strings"""
    if isinstance(obj, dict):
        return {k: translate_recursively(v, trans_map) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [translate_recursively(item, trans_map) for item in obj]
    elif isinstance(obj, str):
        return trans_map.get(obj, obj)
    else:
        return obj

# Create Danish data
da_data = copy.deepcopy(en_data)
da_data = translate_recursively(da_data, danish_trans)

# Write to file
with open('messages/da.json', 'w', encoding='utf-8') as f:
    json.dump(da_data, f, ensure_ascii=False, indent=2)

print('Created messages/da.json')
