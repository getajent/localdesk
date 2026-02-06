/**
 * TypeScript type definitions for translation messages
 * This file provides type safety for translation keys used throughout the application
 * 
 * Usage:
 * - Import the Messages type for custom type checking: `import type { Messages } from '@/messages/types';`
 * - The global IntlMessages interface is automatically available to next-intl hooks
 * - TypeScript will provide autocomplete for translation keys when using useTranslations()
 * 
 * Example:
 * ```typescript
 * import { useTranslations } from 'next-intl';
 * 
 * function MyComponent() {
 *   const t = useTranslations('HomePage.Hero');
 *   return <h1>{t('title')}</h1>; // TypeScript will autocomplete 'title'
 * }
 * ```
 */

export interface Messages {
  Common: {
    nav: {
      home: string;
      services: string;
      knowledge: string;
      guidance: string;
    };
    footer: {
      tagline: string;
      location: string;
      locationValue: string;
      contact: string;
      contactEmail: string;
      resourcesTitle: string;
      resourceSkat: string;
      resourceImmigration: string;
      resourceBorger: string;
      resourceWork: string;
      servicesTitle: string;
      serviceHealthcare: string;
      serviceMitID: string;
      serviceEBoks: string;
      serviceCPH: string;
      legalTitle: string;
      privacy: string;
      terms: string;
      connectTitle: string;
      contactLink: string;
      copyright: string;
      heritage: string;
    };
    auth: {
      signIn: string;
      signUp: string;
      signOut: string;
      memberAccess: string;
      access: string;
      verifiedUser: string;
    };
    theme: {
      toggle: string;
      light: string;
      dark: string;
    };
    backToHome: string;
    legal: string;
  };
  HomePage: {
    Hero: {
      established: string;
      advisor: string;
      heritage: string;
      title: string;
      titleDenmark: string;
      titleFeelLikeHome: string;
      missionLabel: string;
      missionTitle: string;
      missionTitleEmphasis: string;
      missionTitleEnd: string;
      description: string;
      cta: string;
      topicSkat: string;
      topicVisas: string;
      topicSiri: string;
      topicHousing: string;
    };
    Features: {
      sectionLabel: string;
      title: string;
      titleEmphasis: string;
      titleEnd: string;
      madeFor: string;
      feature1: {
        id: string;
        category: string;
        title: string;
        description: string;
      };
      feature2: {
        id: string;
        category: string;
        title: string;
        description: string;
      };
      feature3: {
        id: string;
        category: string;
        title: string;
        description: string;
      };
      feature4: {
        id: string;
        category: string;
        title: string;
        description: string;
      };
    };
  };
  ServicesPage: {
    metadata: {
      title: string;
      description: string;
    };
    Hero: {
      title: string;
      subtitle: string;
    };
    services: {
      consulting: {
        category: string;
        title: string;
        description: string;
        features: {
          cpr: string;
          tax: string;
          healthcare: string;
          housing: string;
          employment: string;
        };
      };
      documents: {
        category: string;
        title: string;
        description: string;
        features: {
          residence: string;
          bank: string;
          rental: string;
          taxReturn: string;
          translation: string;
        };
      };
      relocation: {
        category: string;
        title: string;
        description: string;
        features: {
          planning: string;
          housing: string;
          utilities: string;
          school: string;
          cultural: string;
        };
      };
      ongoing: {
        category: string;
        title: string;
        description: string;
        features: {
          instant: string;
          upToDate: string;
          personalized: string;
          multiLanguage: string;
          available: string;
        };
      };
    };
  };
  GuidancePage: {
    metadata: {
      title: string;
      description: string;
    };
    Hero: {
      title: string;
      subtitle: string;
    };
    guides: {
      firstWeek: {
        title: string;
        description: string;
        duration: string;
      };
      essentialServices: {
        title: string;
        description: string;
        duration: string;
      };
      housingGuide: {
        title: string;
        description: string;
        duration: string;
      };
      taxGuide: {
        title: string;
        description: string;
        duration: string;
      };
      healthcareGuide: {
        title: string;
        description: string;
        duration: string;
      };
    };
  };
  KnowledgePage: {
    metadata: {
      title: string;
      description: string;
    };
    Hero: {
      title: string;
      subtitle: string;
      resourceCenter: string;
      comprehensiveInfo: string;
      mainTitlePart1: string;
      mainTitlePart2: string;
      mainTitlePart3: string;
      description: string;
      searchPlaceholder: string;
      quickLinks: {
        arrival: string;
        housing: string;
        taxes: string;
        benefits: string;
      };
    };
    Categories: {
      label: string;
      title: string;
      titleEmphasis: string;
      titleEnd: string;
      topics: string;
      moreTopics: string;
    };
    categories: {
      arrival: {
        title: string;
        description: string;
        documentCount: string;
      };
      employment: {
        title: string;
        description: string;
        documentCount: string;
      };
      housing: {
        title: string;
        description: string;
        documentCount: string;
      };
      taxFinance: {
        title: string;
        description: string;
        documentCount: string;
      };
      socialBenefits: {
        title: string;
        description: string;
        documentCount: string;
      };
      essentialServices: {
        title: string;
        description: string;
        documentCount: string;
      };
      practicalLiving: {
        title: string;
        description: string;
        documentCount: string;
      };
    };
  };
  PrivacyPage: {
    metadata: {
      title: string;
      description: string;
    };
    title: string;
    lastUpdated: string;
    introduction: string;
    sections: {
      dataCollection: {
        title: string;
        personalInfo: {
          title: string;
          intro: string;
          items: {
            email: string;
            displayName: string;
            profile: string;
            credentials: string;
          };
        };
        usageInfo: {
          title: string;
          intro: string;
          items: {
            chat: string;
            usage: string;
            device: string;
            ip: string;
            cookies: string;
          };
        };
      };
      dataUse: {
        title: string;
        intro: string;
        items: {
          provide: string;
          personalize: string;
          process: string;
          notify: string;
          analyze: string;
          prevent: string;
          comply: string;
        };
      };
      legalBasis: {
        title: string;
        intro: string;
        items: {
          consent: string;
          contract: string;
          legal: string;
          legitimate: string;
        };
      };
      dataSharing: {
        title: string;
        intro: string;
        serviceProviders: {
          title: string;
          items: {
            supabase: string;
            openai: string;
            hosting: string;
          };
        };
        legal: {
          title: string;
          description: string;
        };
      };
      dataSecurity: {
        title: string;
        intro: string;
        items: {
          encryption: string;
          database: string;
          audits: string;
          datacenters: string;
        };
        disclaimer: string;
      };
      userRights: {
        title: string;
        intro: string;
        items: {
          access: string;
          rectification: string;
          erasure: string;
          restrict: string;
          portability: string;
          object: string;
          withdraw: string;
        };
        contact: string;
      };
      cookies: {
        title: string;
        intro: string;
        items: {
          session: string;
          preferences: string;
          analyze: string;
          improve: string;
        };
        control: string;
      };
      dataRetention: {
        title: string;
        intro: string;
        items: {
          account: string;
          chat: string;
          logs: string;
          legal: string;
        };
        deletion: string;
      };
      internationalTransfers: {
        title: string;
        intro: string;
        items: {
          scc: string;
          adequacy: string;
          other: string;
        };
      };
      childrenPrivacy: {
        title: string;
        description: string;
      };
      policyChanges: {
        title: string;
        intro: string;
        items: {
          posting: string;
          date: string;
          email: string;
        };
        acceptance: string;
      };
      contact: {
        title: string;
        intro: string;
        company: string;
        email: string;
        location: string;
        complaint: string;
      };
    };
    cta: {
      title: string;
      description: string;
      readTerms: string;
      contactSupport: string;
    };
  };
  TermsPage: {
    metadata: {
      title: string;
      description: string;
    };
    title: string;
    lastUpdated: string;
    introduction: string;
    sections: {
      acceptance: {
        title: string;
        content: string;
      };
      serviceDescription: {
        title: string;
        content: string;
      };
      userAccounts: {
        title: string;
        intro: string;
        items: {
          confidentiality: string;
          activities: string;
          unauthorized: string;
          accurate: string;
        };
      };
      acceptableUse: {
        title: string;
        intro: string;
        items: {
          illegal: string;
          access: string;
          interfere: string;
          automated: string;
          malicious: string;
          impersonate: string;
        };
      };
      intellectualProperty: {
        title: string;
        content: string;
      };
      dataPrivacy: {
        title: string;
        content: string;
      };
      disclaimerWarranties: {
        title: string;
        intro: string;
        items: {
          uninterrupted: string;
          accurate: string;
          requirements: string;
          corrected: string;
        };
      };
      limitationLiability: {
        title: string;
        content: string;
      };
      termination: {
        title: string;
        intro: string;
        items: {
          violates: string;
          harmful: string;
          liability: string;
        };
        userTermination: string;
      };
      changesTerms: {
        title: string;
        intro: string;
        items: {
          posting: string;
          date: string;
          email: string;
        };
        acceptance: string;
      };
      governingLaw: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        intro: string;
        company: string;
        email: string;
        location: string;
      };
    };
    cta: {
      title: string;
      description: string;
      contactSupport: string;
    };
  };
  ChatInterface: {
    header: {
      title: string;
      version: string;
      mode: string;
      fullPage: string;
      exitFull: string;
      newSession: string;
      systemsOnline: string;
    };
    placeholder: string;
    send: string;
    stop: string;
    thinking: string;
    loading: string;
    error: string;
    welcome: {
      label: string;
      title: string;
    };
    footer: {
      tagline: string;
    };
    confirmModal: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
    };
  };
  AuthModal: {
    signIn: {
      label: string;
      title: string;
      description: string;
    };
    signUp: {
      label: string;
      title: string;
      description: string;
    };
    fields: {
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
    };
    buttons: {
      signIn: string;
      signUp: string;
      processing: string;
      switchToSignUp: string;
      switchToSignIn: string;
    };
    errors: {
      invalidEmail: string;
      passwordTooShort: string;
      authFailed: string;
    };
    legal: {
      agreement: string;
      terms: string;
      and: string;
      privacy: string;
      cookies: string;
    };
  };
  SuggestedQuestions: {
    questions: {
      cpr: string;
      tax: string;
      housing: string;
      healthcare: string;
    };
  };
  Pluralization: {
    messages: string;
    documents: string;
    articles: string;
    items: string;
    results: string;
    notifications: string;
  };
}

/**
 * Global type declaration for next-intl
 * This allows TypeScript to provide autocomplete and type checking for translation keys
 */
declare global {
  interface IntlMessages extends Messages { }
}
