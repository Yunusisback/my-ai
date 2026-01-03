
export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file); // Resimler için Base64
    } else {
      reader.readAsText(file); 
    }
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


export const formatApiMessages = (messages, language) => {
  const systemPrompt = {
    role: "system",
    content: language === 'tr' 
      ? "Sen yardımsever bir yapay zeka asistanısın. Kullanıcı ile her zaman TÜRKÇE konuş." 
      : "You are a helpful AI assistant. Always speak in ENGLISH."
  };

  const formatted = messages.map(m => {
    if (m.role === 'user' && m.content.includes('data:image')) {
       const imageRegex = /!\[.*?\]\((data:image\/.*?;base64,.*?)\)/;
       const match = m.content.match(imageRegex);
       if (match) {
         const imageUrl = match[1];
         const textContent = m.content.replace(match[0], '').trim();
         return {
           role: m.role,
           content: [
             { type: "text", text: textContent || "Bu görsel hakkında ne düşünüyorsun?" },
             { type: "image_url", image_url: { url: imageUrl } }
           ]
         };
       }
    }
    return { role: m.role, content: m.content };
  });

  return [systemPrompt, ...formatted];
};