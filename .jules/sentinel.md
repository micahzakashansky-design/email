## 2025-05-21 - [Electron Process Hardening]
**Vulnerability:** Insecure Electron configuration with `nodeIntegration: true` and `contextIsolation: false`.
**Learning:** This legacy configuration exposes full Node.js capabilities to the renderer process. If the renderer is compromised (e.g., via XSS in an email), an attacker gains full system access.
**Prevention:** Always use `contextIsolation: true`, `nodeIntegration: false`, and a `preload` script with `contextBridge` to expose a minimal, allowlisted API. Combine this with a restrictive Content Security Policy (CSP) in the renderer.
