/** URL publique du site (partage social, canonical, JSON-LD). Surchargeable via `.env` : `VITE_SITE_URL`. */
export const SITE_URL = (
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
    ? String(import.meta.env.VITE_SITE_URL).replace(/\/+$/, "")
    : "https://presifrance.fr"
) as string;

export const SITE_NAME = "PrésiFrance";

/** Jeton Search Console (balise meta). Pour un enregistrement DNS TXT, valeur : `google-site-verification=` + ce jeton. */
export const GOOGLE_SITE_VERIFICATION = "YlKIwzgCAIkd2UUNFDN-A3yURbLK2aH8Cg2ZwYIiz4U";

/** Image Open Graph / Twitter 1200×630 (rectangle dédié au partage, pas le favicon). */
export function ogImageUrl(): string {
  return `${SITE_URL}/og-image.png?v=presifrance-og2`;
}
