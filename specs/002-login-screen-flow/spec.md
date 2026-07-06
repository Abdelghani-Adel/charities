# Feature Specification: Login Screen Flow

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Build the login screen in the frontend and connect it with the backend API. Handle saving the returned token in the frontend and add it to each request after that. Handle showing error messages to the user, localized on the backend side, so the frontend should always send the accept-language locale. The scope is only the login, don't care about registration yet. On the backend, make sure to validate the user against database and return as signed token. On the frontend, create auth-guard to check if the token is not in the browser to redirect the user to '/login' screen. After successful login, redirect the user to the '/' root, this will be the dashboard. Update any ADR required with these changes."

## Clarifications

### Session 2026-07-06

- Q: Should users be able to log in from multiple browsers/devices simultaneously? → A: Yes, multiple simultaneous sessions are allowed. Logging in from a new device does not invalidate existing sessions.
- Q: Should the system lock accounts after repeated failed login attempts? → A: Yes, temporary lockout after N consecutive failed attempts; the account auto-unlocks after a configurable duration. Both N and the duration must be stored as configurable constants for later adjustment.
- Q: Should there be rate limiting on the login endpoint to prevent brute force attacks? → A: Yes, IP-based rate limiting on login attempts with configurable threshold and time window.
- Q: Should login events (successful and failed) be logged for audit purposes? → A: Yes, both successful and failed login attempts must be logged with timestamp, user identifier, IP address, and outcome.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Logs in with Valid Credentials (Priority: P1)

A user navigates to the login page, enters their email and password, submits the form, and is authenticated with a signed token stored in the browser. They are then redirected to the dashboard.

**Why this priority**: Login is the gate to all authenticated functionality. Without it, no user can access the system.

**Independent Test**: Can be fully tested by navigating to the login page, submitting valid credentials, and confirming the dashboard is displayed with a valid token stored in the browser.

**Acceptance Scenarios**:

1. **Given** a user is on the login page, **When** they enter valid credentials and submit, **Then** the system authenticates them, stores the returned token, and redirects to the dashboard.
2. **Given** an authenticated user, **When** they access any protected API endpoint, **Then** the token is attached to the request automatically.

---

### User Story 2 - User Sees Error on Invalid Credentials (Priority: P1)

A user enters incorrect credentials and sees a localized error message displayed on the login form without any page reload.

**Why this priority**: Clear error feedback is essential for usability. Without it, users cannot correct their input.

**Independent Test**: Can be fully tested by submitting invalid credentials and confirming a human-readable error message appears on the login form in the user's language.

**Acceptance Scenarios**:

1. **Given** a user has entered an incorrect email or password, **When** they submit the form, **Then** a localized error message is displayed on the login screen.
2. **Given** a user has entered invalid credentials, **When** the error response is returned, **Then** no token is stored in the browser.
3. **Given** the user's browser sends an Arabic locale (Accept-Language: ar), **When** a validation error occurs, **Then** the error message is displayed in Arabic.

---

### User Story 3 - Unauthenticated User Is Redirected to Login (Priority: P1)

An unauthenticated user attempts to access a protected route and is automatically redirected to the login page.

**Why this priority**: Protects all authenticated routes from unauthorized access.

**Independent Test**: Can be fully tested by clearing browser storage and navigating to a protected route, confirming the user lands on the login page.

**Acceptance Scenarios**:

1. **Given** a user has no stored token, **When** they navigate to a protected route, **Then** they are redirected to the login page.
2. **Given** a user has an expired token, **When** they attempt to access a protected route, **Then** they are redirected to the login page.
3. **Given** a user is already authenticated with a valid token, **When** they navigate to the login page, **Then** they are redirected to the dashboard.

---

### User Story 4 - Localized Error Messages from Backend (Priority: P2)

When the backend returns an error during login (e.g., invalid credentials, account locked), the message is translated into the user's language based on their Accept-Language header.

**Why this priority**: Multi-language support is a core requirement for the system, and consistency between frontend and backend locale handling improves user experience.

**Independent Test**: Can be fully tested by sending login requests with different Accept-Language headers and confirming the error response is localized accordingly.

**Acceptance Scenarios**:

1. **Given** a user sends a request with Accept-Language: ar, **When** the backend returns an error, **Then** the error message is in Arabic.
2. **Given** a user sends a request with Accept-Language: en, **When** the backend returns an error, **Then** the error message is in English.
3. **Given** a user sends a request with an unsupported locale, **When** the backend returns an error, **Then** the error message falls back to the default locale.

---

### Edge Cases

- What happens when the token expires mid-session and the user makes an API request?
- What happens if the browser's local storage is full or unavailable?
- What happens when the backend is unreachable (network error)?
- What happens if the user refreshes the page on a protected route while authenticated?
- What happens if the user submits the form with empty fields?
- What happens if the Accept-Language header is not sent by the browser?
- What happens to the existing token if a user logs in again from the same browser?
- What happens when an account is temporarily locked due to too many failed attempts?
- What happens if a user tries to log in immediately after the lockout period expires?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Login screen MUST display fields for email and password, and a submit button.
- **FR-002**: Login form MUST prevent submission when either email or password field is empty, with inline validation messages.
- **FR-003**: System MUST validate credentials against the database on the backend.
- **FR-004**: System MUST return a signed token upon successful authentication.
- **FR-005**: Frontend MUST store the returned token in browser local storage upon successful login.
- **FR-006**: Frontend MUST attach the stored token to every subsequent API request.
- **FR-007**: Frontend MUST include an auth-guard that redirects unauthenticated users (no valid token) to the login page.
- **FR-008**: After successful login, frontend MUST redirect the user to the dashboard route (/).
- **FR-009**: Backend error messages MUST be localized based on the Accept-Language header sent by the frontend.
- **FR-010**: Frontend MUST send the Accept-Language header with every API request.
- **FR-011**: Frontend MUST display backend error messages to the user on the login form without a page reload.
- **FR-012**: Expired or invalid tokens MUST be rejected by the backend with a clear error response.
- **FR-013**: When the backend rejects an expired or invalid token, the frontend MUST clear the stored token and redirect to the login page.
- **FR-014**: The login feature scope MUST be limited to authentication only; registration, password reset, and account management are excluded.
- **FR-015**: Backend MUST support multiple concurrent sessions per user; logging in from a new device MUST NOT invalidate existing sessions.
- **FR-016**: System MUST temporarily lock the account after N consecutive failed login attempts (N configurable via constants).
- **FR-017**: A locked account MUST remain inaccessible for a configurable duration, after which it auto-unlocks and allows login attempts again.
- **FR-018**: During the lockout period, login attempts for that account MUST return an error indicating the account is temporarily locked, including the remaining lockout time.
- **FR-019**: Backend MUST apply IP-based rate limiting to the login endpoint, with configurable request threshold and time window.
- **FR-020**: Every login attempt (success or failure) MUST be logged with timestamp, user identifier, source IP address, and outcome.

### Key Entities *(include if feature involves data)*

- **User**: An individual who can authenticate against the system. Has a unique identifier, email, and password (stored securely, hashed). Belongs to a charity tenant.
- **Auth Token**: A signed token returned upon successful login. Contains user identity information and expiration metadata. Used to authenticate subsequent API requests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can complete the login flow from page load to dashboard in under 5 seconds on a standard broadband connection.
- **SC-002**: Localized error messages are displayed in the user's language for all login error conditions (invalid credentials, account temporarily locked, rate limited, server error).
- **SC-003**: 100% of authenticated API requests include a valid token in the request.
- **SC-004**: Unauthenticated access to any protected route is consistently denied with a redirect to the login page.
- **SC-005**: Expired or invalid tokens are rejected and trigger a clean session reset (token cleared, redirect to login) without data loss or error states.
- **SC-006**: The login screen renders and functions correctly in both left-to-right and right-to-left layouts.
- **SC-007**: All login-related decisions and architectural changes are documented in the project's ADR records.

## Assumptions

- The user database already exists with credentials stored securely (hashed passwords).
- Users authenticate using their email address.
- The backend already has token signing infrastructure.
- Frontend routing infrastructure exists with support for route guards.
- Token expiration is managed by the backend (duration defined by backend policy).
- Browser local storage is appropriate for token storage in this context.
- The system supports at least English and Arabic locales.
- Unsupported locales fall back to English as the default language.
- Network connectivity is available for the duration of the login flow.
