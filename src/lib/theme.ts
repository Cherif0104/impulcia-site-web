export type ThemeVariant = 'institutional' | 'startup' | 'corporate';

export const themes = {
  institutional: {
    primary: '#1e3a8a',
    secondary: '#64748b',
    accent: '#0ea5e9',
    background: '#ffffff',
    text: '#1e293b',
    animations: 'subtle',
    typography: 'serious'
  },
  startup: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#f8fafc',
    text: '#0f172a',
    animations: 'dynamic',
    typography: 'modern'
  },
  corporate: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#d4af37',
    background: '#ffffff',
    text: '#000000',
    animations: 'elegant',
    typography: 'premium'
  }
};

export function getTheme(variant: ThemeVariant) {
  return themes[variant];
}

