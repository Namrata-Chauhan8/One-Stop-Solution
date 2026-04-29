import { server } from "../redux/store";

const api = async (endpoint, payload = null, method = "GET") => {
  const normalizedMethod = method.toUpperCase();
  const isBodyMethod = !["GET", "HEAD"].includes(normalizedMethod);
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;
  const hasPayload =
    payload &&
    typeof payload === "object" &&
    !isFormData &&
    Object.keys(payload).length > 0;
  let requestUrl = `${server}${endpoint}`;

  const config = {
    method: normalizedMethod,
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  };

  if (isBodyMethod) {
    if (isFormData) {
      config.body = payload;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(payload ?? {});
    }
  } else if (hasPayload) {
    const searchParams = new URLSearchParams(payload);
    requestUrl += `?${searchParams.toString()}`;
  }

  const response = await fetch(requestUrl, config);
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

export default api;
