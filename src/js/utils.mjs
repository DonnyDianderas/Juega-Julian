export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  return await response.text();
}

export function renderWithTemplate(template, element) {
  element.innerHTML = template;
}

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
  } catch (error) {
    console.error("Error loading templates:", error);
  }
}

////
const SCORE_KEY = 'julian_total_score';

export function getScore(gameType) {
    const SCORE_KEY = `julian_score_${gameType}`; // Unique key for type of game
    const score = localStorage.getItem(SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
}

export function incrementScore(gameType) {
    let score = getScore(gameType);
    score = score + 1;
    const SCORE_KEY = `julian_score_${gameType}`;
    localStorage.setItem(SCORE_KEY, score.toString());
    return score;
}

export function resetScore(gameType) {
    const SCORE_KEY = `julian_score_${gameType}`;
    localStorage.setItem(SCORE_KEY, '0');
    return 0;
}
