function apiFetch(url, options = {}) {
  return fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
}

export function getCaseStudies() {
  return apiFetch("https://ftk-api.pages.dev/case-studies");
}

export function getTeamMembers() {
  return apiFetch("https://ftk-api.pages.dev/team");
}

export function getFinancialProjections() {
  return apiFetch("https://ftk-api.pages.dev/financial-projections");
}

export function getExperience() {
  return apiFetch("https://ftk-api.pages.dev/experience");
}

/**
 * @typedef {Object} CoreValue
 * @property {"layers" | "bars" | "globe" | "gear"} icon
 * @property {string} title
 * @property {string} description
 * @property {{text: string, url: string}} link
 */

/**
 * @returns {Promise<{
 *   title: string,
 *   subtitle: string,
 *   eyebrow: string,
 *   button: {text: string, link: string},
 *   values: CoreValue[]
 * }>}
 */
export function getCoreValues() {
  return apiFetch("https://ftk-api.pages.dev/core-values");
}
