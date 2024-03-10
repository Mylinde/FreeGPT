if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
  document.addEventListener('dblclick', function(event) {
    if (event.target.closest('.conversation') !== null) {
      const content = event.target.closest('.conversation');
      const currentScale = window.getComputedStyle(content).transform;
      const scaleMatrix = new WebKitCSSMatrix(currentScale);
      const scaleX = scaleMatrix.a;
      const scaleY = scaleMatrix.d;

      if (scaleX === 1 && scaleY === 1) {
        content.style.transform = "scaleX(1.2) scaleY(1.2)";
        content.classList.add("enlarged");
      } else {
        content.style.transform = "scaleX(1) scaleY(1)";
        content.classList.remove("enlarged");
      }
    }
  });
}

// Get the button element
const shareButton = document.getElementById("share-button");
const pdfButton = document.getElementById("pdf-button");

// Check if the Web Share API is available
if (navigator.share) {
  // Add a click event listener to the button
  shareButton.addEventListener("click", async () => {
    try {
      // Get all the elements with the class content
      const contentElements = document.querySelectorAll(".content");
      // Initialize an empty string to store the text content
      let text = "";
      // Loop through the content elements and append their text content to the string
      for (let element of contentElements) {
        text += element.textContent + "\n";
      }
      // Copy the text to the clipboard
      await navigator.clipboard.writeText(text);
      // Share the text with the Web Share API
      await navigator.share({
        title: "FreeGPT",
        text: text
      });
    } catch (error) {
      // Handle error
      console.error("Error sharing content", error);
    }
  });

// Add a click event listener to the print button
pdfButton.addEventListener("click", () => {
  try {
    // Get all the elements with the class content
    const contentElements = document.querySelectorAll(['.content', '.hljs-copy-wrapper']);
    // Initialize an empty string to store the text content
    let text = "";
    // Loop through the content elements and append their text content to the string
    for (let element of contentElements) {
      text += element.textContent + "\n";
    }
    // Create a new jsPDF instance
    const pdf = jspdf.jsPDF();
    // Set the font size to 12
    pdf.setFontSize(12);
    // Split the text into lines that fit the page width
    const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - 20);
    // Loop through the lines and add them to the PDF document
    let currentPage = 0;
    for (let line of lines) {
      pdf.text(line, 10, 10 + (currentPage * 10));
      currentPage++;
      if (currentPage * 10 >= pdf.internal.pageSize.height) {
        pdf.addPage();
        currentPage = 0;
      }
    }
    // Save the PDF document with the title as the file name
    pdf.save("FreeGPT.pdf");
  } catch (error) {
    // Handle error
    console.error("Error printing content", error);
  }
});

} else {
  // Hide the button if the Web Share API is not supported
  shareButton.style.display = "none";
  pdfButton.style.display = "none";
}






