const LOG_SERVER_URL = process.env.REACT_APP_LOG_SERVER_URL || "/evaluation-service/logs";
const LOG_API_TOKEN = process.env.REACT_APP_API_TOKEN;

/**
 * Logging Middleware
 * Reusable function that logs to the test server
 * @param {string} stack - The stack/layer (e.g., "frontend", "api", "hooks")
 * @param {string} level - Log level: "info" | "warn" | "error" | "debug"
 * @param {string} pkg - Package/component name
 * @param {string} message - The log message
 */
export async function Log(stack, level, pkg, message) {
  const logEntry = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString(),
  };

  console.log(`[${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);

  try {
    const headers = { "Content-Type": "application/json" };
    if (LOG_API_TOKEN) {
      headers.Authorization = `Bearer ${LOG_API_TOKEN}`;
    }

    await fetch(LOG_SERVER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(logEntry),
      credentials: "include",
    });
  } catch (err) {
    console.warn("[Logger] Failed to send log to server:", err.message);
  }
}

export default Log;
