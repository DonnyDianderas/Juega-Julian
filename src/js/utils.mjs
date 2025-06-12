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

