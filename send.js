// src/api/utils/index.ts
function sendJson(res, key, value, { message, error }) {
  res.json({
    success: error ? false : true,
    message,
    [key]: value
  });
}
export {
  sendJson
};
