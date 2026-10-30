const FILE = 'Silviu_Alexandru_Dinu_CV_EN.pdf';

/** Downloads the static CV PDF. */
export const downloadCV = async (): Promise<void> => {
  const response = await fetch(`/media/cv/${FILE}`);
  if (!response.ok) {
    throw new Error('Failed to fetch PDF');
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = FILE;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
