export const logInfo = (message, data = null) => {
  if (data) {
    console.log(`[INFO] ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[INFO] ${message}`);
  }
};

export const logError = (message, data = null) => {
  if (data) {
    console.error(`[ERROR] ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.error(`[ERROR] ${message}`);
  }
};
