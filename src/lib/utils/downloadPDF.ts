type PDFDownloadInput = {
  fileName: string;
  fileContent: Blob;
}

export function downloadPDF({ fileName, fileContent }: PDFDownloadInput) {
  const url = URL.createObjectURL(fileContent);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL object
}