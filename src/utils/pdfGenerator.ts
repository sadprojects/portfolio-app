/**
 * Simple PDF download utility
 * Downloads the static CV PDF file without modification
 */

export const downloadCV = async (): Promise<void> => {
  try {
    // Fetch the PDF file
    const response = await fetch('/src/assets/Silviu-Alexandru_Dinu_CV_ENG.pdf');

    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const blob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Silviu_Alexandru_Dinu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CV:', error);
    throw error;
  }
};
