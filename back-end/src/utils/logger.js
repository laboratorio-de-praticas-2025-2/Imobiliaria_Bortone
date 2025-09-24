// Logger utilitário para logs estruturados
export function logError({
  message,
  userId = null,
  chatId = null,
  stack = null,
}) {
  const timestamp = new Date().toISOString();
  const log = {
    level: "error",
    timestamp,
    userId,
    chatId,
    message,
    stack,
  };
  console.error(JSON.stringify(log));
}

export function logInfo({ message, userId = null, chatId = null }) {
  const timestamp = new Date().toISOString();
  const log = {
    level: "info",
    timestamp,
    userId,
    chatId,
    message,
  };
  console.log(JSON.stringify(log));
}
