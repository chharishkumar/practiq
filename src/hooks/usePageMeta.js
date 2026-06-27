import { useEffect } from "react";

/**
 * usePageMeta — sets document title and meta description for the current page.
 * No external package needed (avoids react-helmet dependency).
 *
 * Usage in any page component:
 *   usePageMeta({
 *     title: "SQL Basics Practice | Repractiq",
 *     description: "Practice 100 SQL Basics problems with instant feedback.",
 *   });
 *
 * Resets to the default homepage meta when the component unmounts
 * (e.g. when navigating away), so the next page can set its own.
 */
export function usePageMeta({ title, description, canonical }) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDescTag = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescTag?.getAttribute("content");

    if (title) {
      document.title = title;
    }

    if (description && metaDescTag) {
      metaDescTag.setAttribute("content", description);
    }

    // Update Open Graph + Twitter tags too, so shared links reflect the page
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc  = document.querySelector('meta[name="twitter:description"]');

    if (title) {
      ogTitle?.setAttribute("content", title);
      twTitle?.setAttribute("content", title);
    }
    if (description) {
      ogDesc?.setAttribute("content", description);
      twDesc?.setAttribute("content", description);
    }

let canonicalTag = document.querySelector("link[rel='canonical']");

if (!canonicalTag) {
  canonicalTag = document.createElement("link");
  canonicalTag.setAttribute("rel", "canonical");
  document.head.appendChild(canonicalTag);
}

if (canonical) {
  canonicalTag.setAttribute("href", canonical);
}
    // Restore defaults on unmount so the next page isn't stuck with stale meta
    return () => {
      document.title = prevTitle;
    
      if (metaDescTag && prevDescription) {
        metaDescTag.setAttribute("content", prevDescription);
      }
    
      if (canonicalTag) {
        canonicalTag.remove();
      }
    };
  }, [title, description, canonical]);
}