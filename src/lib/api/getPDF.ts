export async function getPDF({fileContent, fileName}: {fileContent: Blob, fileName: string}) {

  const formData = new FormData();
  formData.append('file', fileContent, fileName);

  const response = await fetch('/api/pdf', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  } 

  const blob = await response.blob();
  return {
    fileName: fileName.replace('.docx', '.pdf'),
    fileContent: blob
  }
}