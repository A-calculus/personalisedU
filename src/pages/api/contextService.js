// In-memory storage for conversation contexts
const conversationContexts = new Map();

export const createContext = (chatId) => {
  const context = {
    messages: [],
    userData: null,
    lastUpdated: Date.now(),
    metadata: {
      startTime: Date.now(),
      messageCount: 0
    }
  };
  
  conversationContexts.set(chatId, context);
  console.log('📝 Created new context for chatId:', chatId);
  return context;
};

export const getContext = (chatId) => {
  const context = conversationContexts.get(chatId);
  if (!context) {
    console.log('🆕 No context found for chatId:', chatId);
    return createContext(chatId);
  }
  return context;
};

export const updateContext = (chatId, update) => {
  const context = getContext(chatId);
  Object.assign(context, update);
  context.lastUpdated = Date.now();
  context.metadata.messageCount++;
  conversationContexts.set(chatId, context);
  console.log('📝 Updated context for chatId:', chatId);
  return context;
};

export const addMessageToContext = (chatId, message) => {
  const context = getContext(chatId);
  context.messages.push({
    ...message,
    timestamp: Date.now()
  });
  return updateContext(chatId, { messages: context.messages });
};

export const clearContext = (chatId) => {
  conversationContexts.delete(chatId);
  console.log('🗑️ Cleared context for chatId:', chatId);
};

// Clean up old contexts (older than 1 hour)
const cleanupOldContexts = () => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [chatId, context] of conversationContexts.entries()) {
    if (context.lastUpdated < oneHourAgo) {
      conversationContexts.delete(chatId);
      console.log('🧹 Cleaned up old context for chatId:', chatId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupOldContexts, 60 * 60 * 1000); 