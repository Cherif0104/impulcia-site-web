import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/services': {
      fr: '/offres-services',
      en: '/service-offerings'
    },
    '/expertise': {
      fr: '/competences',
      en: '/expertise'
    },
    '/technologies': {
      fr: '/technologies',
      en: '/technologies'
    },
    '/about': {
      fr: '/a-propos',
      en: '/about'
    },
    '/partnerships': {
      fr: '/partenaires',
      en: '/partnerships'
    },
    '/contact': {
      fr: '/contact',
      en: '/contact'
    },
    '/privacy': {
      fr: '/privacy',
      en: '/privacy'
    },
    '/cookies': {
      fr: '/cookies',
      en: '/cookies'
    },
    '/legal': {
      fr: '/legal',
      en: '/legal'
    },
    '/trust': {
      fr: '/confiance-securite',
      en: '/trust-security'
    },
    '/trust-center': {
      fr: '/centre-confiance',
      en: '/trust-center'
    },
    '/landing': {
      fr: '/landing',
      en: '/landing'
    },
    '/coya': {
      fr: '/coya',
      en: '/coya'
    },
    '/sentrajet': {
      fr: '/sentrajet',
      en: '/sentrajet'
    },
    '/patrimo': {
      fr: '/patrimo',
      en: '/patrimo'
    },
    '/sunugest': {
      fr: '/sunugest',
      en: '/sunugest'
    },
    '/mbourake': {
      fr: '/mbourake',
      en: '/mbourake'
    },
    '/for-enterprises': {
      fr: '/grands-comptes',
      en: '/for-enterprises'
    },
    '/for-institutions': {
      fr: '/institutions',
      en: '/for-institutions'
    },
    '/for-donors': {
      fr: '/bailleurs',
      en: '/for-donors'
    },
    '/realisations': {
      fr: '/realisations',
      en: '/case-studies'
    },
    '/audit-si': {
      fr: '/audit-si',
      en: '/is-audit'
    },
    '/cadrage-projet': {
      fr: '/cadrage-projet',
      en: '/project-scoping'
    },
    '/architecte-si': {
      fr: '/architecte-si',
      en: '/is-architect'
    },
    '/client-space': {
      fr: '/espace-client',
      en: '/client-space'
    },
    '/client/login': {
      fr: '/portail-client/connexion',
      en: '/client/login'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

