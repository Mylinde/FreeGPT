document.addEventListener('DOMContentLoaded', fetchCurrentLanguage);

async function fetchCurrentLanguage() {
  try {
    const currentLanguageResponse = await fetch(`${url_prefix}/get-locale`);
    const currentLanguage = await currentLanguageResponse.text();
    const savedLanguage = localStorage.getItem("language") || currentLanguage;
    setLanguageOnPageLoad(savedLanguage);
  } catch (error) {
    console.error("Failed to fetch current language");
  }
}

function setLanguageOnPageLoad(language) {
  document.getElementById("language").value = language;
}

function changeLanguage(lang) {
  fetch(`${url_prefix}/change-language`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language: lang }),
  }).then((response) => {
    if (response.ok) {
      localStorage.setItem("language", lang);
      location.reload();
    } else {
      console.error("Failed to change language");
    }
  });
}
