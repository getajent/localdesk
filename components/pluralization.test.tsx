/**
 * Unit tests for pluralization support in i18n
 * Tests verify that pluralization works correctly for different counts (0, 1, 2, many)
 * and across all supported languages
 */

import { describe, it, expect } from '@jest/globals';

// Import translation files
import enMessages from '@/messages/en.json';
import daMessages from '@/messages/da.json';
import deMessages from '@/messages/de.json';
import ukMessages from '@/messages/uk.json';
import plMessages from '@/messages/pl.json';
import roMessages from '@/messages/ro.json';
import ruMessages from '@/messages/ru.json';

describe('Pluralization Support', () => {
  describe('Translation files contain pluralization keys', () => {
    it('should have Pluralization section in English translations', () => {
      expect(enMessages.Pluralization).toBeDefined();
      expect(enMessages.Pluralization.messages).toBeDefined();
      expect(enMessages.Pluralization.documents).toBeDefined();
      expect(enMessages.Pluralization.articles).toBeDefined();
      expect(enMessages.Pluralization.items).toBeDefined();
      expect(enMessages.Pluralization.results).toBeDefined();
      expect(enMessages.Pluralization.notifications).toBeDefined();
    });

    it('should have Pluralization section in Danish translations', () => {
      expect(daMessages.Pluralization).toBeDefined();
      expect(daMessages.Pluralization.messages).toBeDefined();
      expect(daMessages.Pluralization.documents).toBeDefined();
    });

    it('should have Pluralization section in German translations', () => {
      expect(deMessages.Pluralization).toBeDefined();
      expect(deMessages.Pluralization.messages).toBeDefined();
      expect(deMessages.Pluralization.documents).toBeDefined();
    });

    it('should have Pluralization section in Ukrainian translations', () => {
      expect(ukMessages.Pluralization).toBeDefined();
      expect(ukMessages.Pluralization.messages).toBeDefined();
      expect(ukMessages.Pluralization.documents).toBeDefined();
    });

    it('should have Pluralization section in Polish translations', () => {
      expect(plMessages.Pluralization).toBeDefined();
      expect(plMessages.Pluralization.messages).toBeDefined();
      expect(plMessages.Pluralization.documents).toBeDefined();
    });

    it('should have Pluralization section in Romanian translations', () => {
      expect(roMessages.Pluralization).toBeDefined();
      expect(roMessages.Pluralization.messages).toBeDefined();
      expect(roMessages.Pluralization.documents).toBeDefined();
    });

    it('should have Pluralization section in Russian translations', () => {
      expect(ruMessages.Pluralization).toBeDefined();
      expect(ruMessages.Pluralization.messages).toBeDefined();
      expect(ruMessages.Pluralization.documents).toBeDefined();
    });
  });

  describe('English pluralization format', () => {
    it('should use ICU MessageFormat syntax for messages', () => {
      const format = enMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('=0');
      expect(format).toContain('=1');
      expect(format).toContain('other');
    });

    it('should have zero form for messages', () => {
      expect(enMessages.Pluralization.messages).toContain('No messages');
    });

    it('should have singular form for messages', () => {
      expect(enMessages.Pluralization.messages).toContain('1 message');
    });

    it('should have plural form for messages', () => {
      expect(enMessages.Pluralization.messages).toContain('# messages');
    });

    it('should have correct format for documents', () => {
      expect(enMessages.Pluralization.documents).toContain('No documents');
      expect(enMessages.Pluralization.documents).toContain('1 document');
      expect(enMessages.Pluralization.documents).toContain('# documents');
    });

    it('should have correct format for results', () => {
      expect(enMessages.Pluralization.results).toContain('No results found');
      expect(enMessages.Pluralization.results).toContain('1 result found');
      expect(enMessages.Pluralization.results).toContain('# results found');
    });
  });

  describe('Danish pluralization format', () => {
    it('should use ICU MessageFormat syntax', () => {
      const format = daMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('=0');
      expect(format).toContain('=1');
      expect(format).toContain('other');
    });

    it('should have Danish translations for zero form', () => {
      expect(daMessages.Pluralization.messages).toContain('Ingen beskeder');
    });

    it('should have Danish translations for singular form', () => {
      expect(daMessages.Pluralization.messages).toContain('1 besked');
    });

    it('should have Danish translations for plural form', () => {
      expect(daMessages.Pluralization.messages).toContain('# beskeder');
    });
  });

  describe('German pluralization format', () => {
    it('should use ICU MessageFormat syntax', () => {
      const format = deMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
    });

    it('should have German translations', () => {
      expect(deMessages.Pluralization.messages).toContain('Keine Nachrichten');
      expect(deMessages.Pluralization.messages).toContain('1 Nachricht');
      expect(deMessages.Pluralization.messages).toContain('# Nachrichten');
    });
  });

  describe('Ukrainian pluralization format with complex rules', () => {
    it('should use ICU MessageFormat syntax with few and many forms', () => {
      const format = ukMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('=0');
      expect(format).toContain('=1');
      expect(format).toContain('few');
      expect(format).toContain('many');
      expect(format).toContain('other');
    });

    it('should have Ukrainian translations for all forms', () => {
      expect(ukMessages.Pluralization.messages).toContain('Немає повідомлень');
      expect(ukMessages.Pluralization.messages).toContain('1 повідомлення');
      expect(ukMessages.Pluralization.messages).toContain('# повідомлення');
      expect(ukMessages.Pluralization.messages).toContain('# повідомлень');
    });
  });

  describe('Polish pluralization format with complex rules', () => {
    it('should use ICU MessageFormat syntax with few and many forms', () => {
      const format = plMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('few');
      expect(format).toContain('many');
    });

    it('should have Polish translations for all forms', () => {
      expect(plMessages.Pluralization.messages).toContain('Brak wiadomości');
      expect(plMessages.Pluralization.messages).toContain('1 wiadomość');
      expect(plMessages.Pluralization.messages).toContain('# wiadomości');
    });
  });

  describe('Romanian pluralization format', () => {
    it('should use ICU MessageFormat syntax with few form', () => {
      const format = roMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('few');
    });

    it('should have Romanian translations', () => {
      expect(roMessages.Pluralization.messages).toContain('Niciun mesaj');
      expect(roMessages.Pluralization.messages).toContain('1 mesaj');
      expect(roMessages.Pluralization.messages).toContain('# mesaje');
    });
  });

  describe('Russian pluralization format with complex rules', () => {
    it('should use ICU MessageFormat syntax with few and many forms', () => {
      const format = ruMessages.Pluralization.messages;
      expect(format).toContain('{count, plural,');
      expect(format).toContain('few');
      expect(format).toContain('many');
    });

    it('should have Russian translations for all forms', () => {
      expect(ruMessages.Pluralization.messages).toContain('Нет сообщений');
      expect(ruMessages.Pluralization.messages).toContain('1 сообщение');
      expect(ruMessages.Pluralization.messages).toContain('# сообщения');
      expect(ruMessages.Pluralization.messages).toContain('# сообщений');
    });
  });

  describe('All languages have consistent pluralization keys', () => {
    const allMessages = [
      { locale: 'en', messages: enMessages },
      { locale: 'da', messages: daMessages },
      { locale: 'de', messages: deMessages },
      { locale: 'uk', messages: ukMessages },
      { locale: 'pl', messages: plMessages },
      { locale: 'ro', messages: roMessages },
      { locale: 'ru', messages: ruMessages }
    ];

    const pluralizationKeys = ['messages', 'documents', 'articles', 'items', 'results', 'notifications'];

    allMessages.forEach(({ locale, messages }) => {
      pluralizationKeys.forEach(key => {
        it(`should have ${key} pluralization in ${locale}`, () => {
          expect(messages.Pluralization[key]).toBeDefined();
          expect(typeof messages.Pluralization[key]).toBe('string');
          expect(messages.Pluralization[key].length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Pluralization format validation', () => {
    it('should use # symbol for count placeholder in plural forms', () => {
      expect(enMessages.Pluralization.messages).toContain('# messages');
      expect(daMessages.Pluralization.documents).toContain('# dokumenter');
      expect(deMessages.Pluralization.articles).toContain('# Artikel');
    });

    it('should have explicit zero forms where appropriate', () => {
      expect(enMessages.Pluralization.results).toContain('=0 {No results found}');
      expect(daMessages.Pluralization.results).toContain('=0 {Ingen resultater fundet}');
      expect(deMessages.Pluralization.results).toContain('=0 {Keine Ergebnisse gefunden}');
    });

    it('should have explicit singular forms', () => {
      expect(enMessages.Pluralization.notifications).toContain('=1 {1 new notification}');
      expect(daMessages.Pluralization.notifications).toContain('=1 {1 ny notifikation}');
      expect(deMessages.Pluralization.notifications).toContain('=1 {1 neue Benachrichtigung}');
    });
  });
});
