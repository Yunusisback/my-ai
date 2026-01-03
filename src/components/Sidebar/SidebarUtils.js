export const getRelativeDateLabel = (dateString, language) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
  const isTr = language === 'tr';

  if (diffDays <= 1) return isTr ? 'Bugün' : 'Today';
  if (diffDays === 2) return isTr ? 'Dün' : 'Yesterday';
  if (diffDays <= 7) return isTr ? 'Önceki 7 Gün' : 'Previous 7 Days';
  if (diffDays <= 30) return isTr ? 'Önceki 30 Gün' : 'Previous 30 Days';
  
  return date.toLocaleString(isTr ? 'tr-TR' : 'en-US', { month: 'long' });
};
