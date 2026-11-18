/**
 * Tailwind — mapeo de la capa de tokens (plan 003, D3, D4 y D5).
 *
 * Los valores viven una sola vez en src/styles/global.css como tripletas HSL;
 * aquí solo se exponen como clases semánticas. Ningún componente nombra un
 * color: usa bg-background, text-foreground, border-border, ring-ring, etc.
 *
 * `darkMode` es vestigial a propósito (D4): la regla real es «cero dark: en
 * componentes» porque el tema lo resuelve el CSS de global.css con
 * prefers-color-scheme y [data-theme]. La forma de array es la única que hace
 * que un dark: futuro apunte al atributo y no a la clase .dark.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: ['selector', '[data-theme="dark"]'],
	future: { hoverOnlyWhenSupported: true },
	/*
	 * Sin `safelist` (T15). Todas las utilidades de token que se emiten tienen
	 * un consumidor real en src/; el JIT las descubre al escanear `content`.
	 * Si una utilidad desaparece del CSS de dist/, es que ningún componente la
	 * usa: eso es señal, no un fallo del mapeo.
	 */
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				surface: 'hsl(var(--surface) / <alpha-value>)',
				muted: 'hsl(var(--muted) / <alpha-value>)',
				'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
				primary: 'hsl(var(--primary) / <alpha-value>)',
				'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				'border-strong': 'hsl(var(--border-strong) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				destructive: 'hsl(var(--destructive) / <alpha-value>)',
			},
			fontFamily: {
				sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
			},
		},
	},
	plugins: [],
}
