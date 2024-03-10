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

const shareButton = document.getElementById("share-button");

if (navigator.share) {  
  shareButton.addEventListener("click", async () => {
    try {      
      const contentElements = document.querySelectorAll(".content");      
      let text = "";     
      for (let element of contentElements) {
        text += element.textContent + "\n";
      }      
      await navigator.clipboard.writeText(text);
      await navigator.share({
        title: "FreeGPT",
        text: text,
      });
    } catch (error) {
        console.error("Error sharing content", error);
    }
  });
} else {
  shareButton.style.display = "none";
}

const pdfButton = document.getElementById("pdf-button");

if (navigator.share) {
  shareButton.addEventListener("click", async () => {
    try {
      const contentElements = document.querySelectorAll(".content");
      let pdf = new PDFDocument();
      pdf.addPage(new PDFPage({
        size: 'A4',
        layout: 'portrait',
        margins: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      }));
      for (let element of contentElements) {
        pdf.addText(element.textContent, {
          fontSize: 12,
          fontFamily: 'Arial',
          textAlign: 'justify'
        });
      }
      const pdfBlob = pdf.blob();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "freeGPT.pdf";
      a.click();
    } catch (error) {
      console.error("Error sharing content as PDF", error);
    }
  });
} else {
  pdfButton.style.display = "none";
}