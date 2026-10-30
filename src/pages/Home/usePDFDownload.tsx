import { downloadCV } from '@utils/pdfGenerator';
import { useState } from 'react';

export const usePDFDownload = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadCV = async () => {
    setIsGeneratingPDF(true);
    try {
      await downloadCV();
    } catch (error) {
      console.error('Failed to download CV:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return { isGeneratingPDF, handleDownloadCV };
};
