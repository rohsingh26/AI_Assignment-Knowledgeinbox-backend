export const logInfo = (message, data = null) => {
  console.log(`[INFO] ${message}`, data || "");
};

export const logError = (message, data = null) => {
  console.error(`[ERROR] ${message}`, data || "");
};
