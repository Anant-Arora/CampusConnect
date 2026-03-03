export function saveToken(token: string) {
  localStorage.setItem("campusconnect_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("campusconnect_token");
}

export function removeToken() {
  localStorage.removeItem("campusconnect_token");
}

export function saveUser(user: object) {
  localStorage.setItem("campusconnect_user", JSON.stringify(user));
}

export function getUser<T = any>(): T | null {
  return JSON.parse(localStorage.getItem("campusconnect_user") || "null");
}

export function removeUser() {
  localStorage.removeItem("campusconnect_user");
}

