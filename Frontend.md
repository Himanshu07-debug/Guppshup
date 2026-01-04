# Gupshup - Frontend Implementation Guide

## Frontend Architecture & Structure

### Folder Structure Overview

```
client/
├── src/
│   ├── components/          (Reusable UI components)
│   │   ├── ChatBox/        (Message sending interface)
│   │   ├── Contacts/       (Contact list sidebar)
│   │   ├── Header/         (Navigation header)
│   │   ├── SearchBar/      (User search functionality)
│   │   ├── Welcome/        (Welcome screen)
│   │   ├── ProtectedRoute.jsx  (Route protection)
│   │   └── Loader.jsx      (Loading spinner)
│   ├── pages/              (Main application pages)
│   │   ├── Login/          (Login page)
│   │   ├── Register/       (Registration page)
│   │   ├── Chat/           (Main chat page)
│   │   └── Avatar/         (Avatar selection page)
│   ├── store/              (Redux state management)
│   │   ├── store.js        (Redux store configuration)
│   │   ├── userSlice.js    (User authentication state)
│   │   ├── contactSlice.js (Contact and online status state)
│   │   └── messageSlice.js (Message state)
│   ├── apis/               (API endpoint configurations)
│   │   └── restapis.js     (All API URLs)
│   ├── utils/              (Helper functions)
│   │   ├── functions.js    (User presence check)
│   │   └── get.js          (Token retrieval)
│   ├── App.js              (Main app component with routing)
│   └── index.js            (React app entry point)
```

### Application Entry Point (`client/src/App.js`)

**Structure:**
- Uses React Router for navigation (BrowserRouter, Routes, Route)
- Redux Provider wraps entire app for state management
- ToastContainer for global notifications
- Protected routes nested under ProtectedRoute component

**Routing Structure:**
- Public routes: `/login`, `/register`
- Protected routes: `/` (Chat page), `/avatar` (Avatar selection)
- Nested routing pattern for protected routes

**File Location:** `client/src/App.js`

---

## State Management (Redux Toolkit)

### Store Configuration (`client/src/store/store.js`)

**Setup:**
- Uses `configureStore` from Redux Toolkit
- Combines three reducers: user, contact, messages
- Provides single source of truth for application state

**Reducer Structure:**
```javascript
reducer: {
    user: userSlice,        // Login status
    contact: contactSlice,  // Selected contact, online users
    messages: messageSlice  // Message array
}
```

### User Slice (`client/src/store/userSlice.js`)

**State:**
- `isLoggedIn`: Boolean - tracks user authentication status

**Initial State:**
- Checks localStorage for user data on app load
- Uses `isUserPresent()` utility function

**Actions:**
- `setIsLoggedIn`: Updates login status (used after login/logout)

**Why it matters:**
- Controls access to protected routes
- Synced with localStorage user data
- Used by ProtectedRoute component

### Contact Slice (`client/src/store/contactSlice.js`)

**State:**
- `selectedContact`: Object - currently selected contact for chatting
- `onlineContacts`: Array - list of online user IDs

**Actions:**
- `setSelectedContact`: Updates selected contact (triggers message loading)
- `setOnlineContacts`: Updates online users list (from Socket.io)

**Usage:**
- Selected contact drives which messages to display
- Online contacts used for showing green indicators
- Updated from multiple components (Contacts, Chat)

### Message Slice (`client/src/store/messageSlice.js`)

**State:**
- `messageArr`: Array - messages for currently selected conversation

**Actions:**
- `setMessageArr`: Replaces entire message array

**Important Design:**
- Message array completely replaced (not appended) to maintain consistency
- Used by ChatContainer to display messages
- Updated when: loading messages, sending new message, receiving real-time message

---

## Key Components Implementation

### 1. Protected Route (`client/src/components/ProtectedRoute.jsx`)

**Purpose:** Prevents unauthorized access to protected pages

**Implementation:**
- Uses `useSelector` to check `isLoggedIn` from Redux
- If logged in: Renders `<Outlet />` (nested routes)
- If not logged in: Redirects to `/login` using `<Navigate />`

**Why it's important:**
- Client-side route protection
- Works with Redux state for real-time updates
- Prevents direct URL access to protected pages

**File Location:** `client/src/components/ProtectedRoute.jsx`

### 2. Login Page (`client/src/pages/Login/Login.jsx`)

**Key Features:**

**State Management:**
- Local state for form data (email, password)
- Controlled inputs with `value` and `onChange`

**Validation:**
- Email format check (must contain "@")
- Required field validation
- Client-side validation before API call
- Toast notifications for errors

**Authentication Flow:**
1. User submits form
2. Validation runs
3. If valid: API call to `/api/login`
4. On success:
   - User data stored in localStorage
   - JWT tokens stored in sessionStorage
   - Redux `isLoggedIn` set to true
   - Redirect to home page

**Error Handling:**
- Try-catch blocks
- Toast error messages
- User-friendly feedback

**Storage Strategy:**
- `localStorage`: User data (persists across sessions)
- `sessionStorage`: JWT tokens (cleared on browser close)

### 3. Register Page (`client/src/pages/Register/Register.jsx`)

**Key Features:**

**Form State:**
- Four fields: userName, email, password, confirmPassword
- Controlled inputs with spread operator pattern

**Validation:**
- Password confirmation match
- Email format validation
- All fields mandatory check
- Client-side validation before submission

**Registration Flow:**
1. Form validation
2. API call to `/api/register`
3. On success:
   - User data stored in localStorage
   - Redirect to avatar selection page
   - User must set avatar before chatting

**File Location:** `client/src/pages/Register/Register.jsx`

### 4. Header Component (`client/src/components/Header/Header.jsx`)

**Purpose:** Navigation bar with search, logo, user menu

**Key Features:**

**Conditional Rendering:**
- Shows SearchBar only when logged in (`btnText === 'Sign Out'`)
- Shows avatar dropdown only when logged in
- Shows sign in/sign up link when not logged in

**Avatar Dropdown:**
- Modal state management with `isModalOpen`
- Outside click handler to close modal
- Custom hook pattern: `OutSideClickHandler`
- Menu items: Avatars link, Sign Out button

**Logout Functionality:**
- Clears localStorage (user data)
- Updates Redux state (`setIsLoggedIn(false)`)
- Navigates to login page

**User Data:**
- Reads from localStorage on mount
- Displays user avatar in header

**Custom Hook Pattern:**
```javascript
OutSideClickHandler(modalRef);
```
- Reusable pattern for detecting outside clicks
- Used for closing dropdowns/modals
- Proper cleanup with event listener removal

**File Location:** `client/src/components/Header/Header.jsx`

### 5. Contacts Component (`client/src/components/Contacts/Contacts.jsx`)

**Purpose:** Displays contact list sidebar with online status

**Key Features:**

**State Management:**
- Local state: `contactList`, `isLoading`
- Redux: `onlineContacts`, `selectedContact`

**Data Loading:**
- `getAllContacts()` function fetches contacts on mount
- Uses empty dependency array to load once
- Checks localStorage for current user

**Event System:**
- Listens for `contactAdded` custom event
- Refreshes contact list when new contact added
- Also listens to storage events (cross-tab sync)

**Contact Selection:**
- `handleContactChange` dispatches `setSelectedContact`
- Updates Redux state
- Triggers message loading in ChatContainer

**Online Status Display:**
- Green indicator shown if contact ID in `onlineContacts` array
- Real-time updates from Socket.io
- Inline style for conditional rendering

**Loading States:**
- Shows Loader component while fetching
- Shows "Empty Contact List" if no contacts
- Smooth user experience

**Optimization:**
- Empty dependency array prevents infinite loops
- Custom events for efficient updates
- No unnecessary re-renders

**File Location:** `client/src/components/Contacts/Contacts.jsx`

### 6. SearchBar Component (`client/src/components/SearchBar/SearchBar.jsx`)

**Purpose:** Search and add users to contact list

**Key Features:**

**Search Functionality:**
- Debouncing implementation (300ms delay)
- Only searches if keyword length >= 3 characters
- Prevents excessive API calls

**Debouncing Implementation:**
```javascript
useEffect(() => {
    const debounceTimer = setTimeout(async () => {
        // API call
    }, 300);
    return () => clearTimeout(debounceTimer);
}, [searchKeyword]);
```
- Waits 300ms after user stops typing
- Clears previous timer on new input
- Reduces server load significantly

**Modal Display:**
- Shows search results in dropdown modal
- Outside click handler closes modal
- Conditional rendering based on `searchModalOpen` state

**Add Contact Flow:**
1. User clicks "+" button
2. API call to add contact
3. Updates localStorage with new user data
4. Shows success toast
5. Dispatches `contactAdded` custom event
6. Contacts component refreshes automatically

**Event Communication:**
- Uses `window.dispatchEvent(new CustomEvent('contactAdded'))`
- Decouples SearchBar from Contacts component
- Allows multiple components to listen

**Error Handling:**
- Handles duplicate contact (400 status)
- Shows appropriate toast messages
- Prevents adding same contact twice

**File Location:** `client/src/components/SearchBar/SearchBar.jsx`

### 7. ChatBox Component (`client/src/components/ChatBox/ChatBox.jsx`)

**Purpose:** Main messaging interface - sends and receives messages

**Key Features:**

**Socket.io Integration:**
- Creates Socket.io connection on mount
- Emits `add-user` event with user ID
- Listens for `msg-receive` event
- Stores socket in useRef to persist across renders

**Message Sending Flow:**
1. User types message and submits
2. Message encrypted with CryptoJS (AES encryption)
3. Token retrieved from sessionStorage
4. API call to `/message/add` with encrypted message
5. Socket.io emits `msg-send` event for real-time delivery
6. Message added to local Redux state for instant display
7. Input field cleared

**Message Encryption:**
```javascript
const ciphertext = CryptoJS.AES.encrypt(message, secretKey).toString();
```
- Encrypts on client-side before sending
- Uses AES encryption algorithm
- Secret key: 'qweyrgwtwuigu'
- Message stored encrypted in database

**Real-Time Message Reception:**
- Listens for `msg-receive` event from Socket.io
- Updates `arrivalMessage` state
- Separate useEffect adds arrival message to Redux state
- Messages appear instantly without page refresh

**Error Handling:**
- Token validation before sending
- Specific error messages for session expiry (401, 403)
- Generic error messages for other failures
- Toast notifications for user feedback

**Component Structure:**
- Top section: Contact info and close button
- Mid section: ChatContainer (displays messages)
- Bottom section: Emoji picker, input field, send button

**State Management:**
- Local state: `message`, `openEmogiKeyboard`, `arrivalMessage`
- Redux: `messageArr`, `selectedContact`
- Refs: `socket` (persists Socket.io connection)

**File Location:** `client/src/components/ChatBox/ChatBox.jsx`

### 8. ChatContainer Component (`client/src/components/ChatBox/ChatContainer.jsx`)

**Purpose:** Displays message history for selected conversation

**Key Features:**

**Message Loading:**
- `getAllMessages()` fetches messages when contact selected
- Triggers on `SelectedUser` change (useEffect dependency)
- Loading state while fetching

**Message Decryption:**
```javascript
const decryptedBytes = CryptoJS.AES.decrypt(message.message.message.text, 'qweyrgwtwuigu');
const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
```
- Decrypts each message from database
- Uses same secret key as encryption
- Updates message object in-place
- Messages displayed as readable text

**Message Display:**
- Maps through `messageArr` from Redux
- Conditional className: "sended" or "received"
- Based on `fromSelf` flag from backend
- Different styling for sent vs received messages

**Auto-Scroll:**
- `scrollRef` attached to last message
- `scrollIntoView` called when messages update
- Smooth scroll behavior
- Ensures latest message always visible

**Loading State:**
- Shows Loader component while fetching
- Better UX during API calls

**File Location:** `client/src/components/ChatBox/ChatContainer.jsx`

### 9. EmojiPicker Component (`client/src/components/ChatBox/EmogiPicker.jsx`)

**Purpose:** Emoji selection interface

**Implementation:**
- Uses `emoji-picker-react` library
- Wrapped in custom styled container
- Receives `onSelect` callback prop
- Passes selected emoji to parent (ChatBox)

**Styling:**
- Custom SCSS for dark theme
- Matches app color scheme
- Positioned absolutely above input field
- Z-index for proper layering

**File Location:** `client/src/components/ChatBox/EmogiPicker.jsx`

### 10. Avatar Page (`client/src/pages/Avatar/Avatar.jsx`)

**Purpose:** Avatar selection page after registration

**Key Features:**

**Avatar Generation:**
- Uses DiceBear API for avatar generation
- 6 different styles: avataaars, micah, open-peeps, bottts, personas, fun-emoji
- Unique seed generation for each avatar:
  ```javascript
  const seed = `${user.userName}-${index}-${timestamp}-${randomSeed}`;
  ```
- Generates 3 different avatars for user to choose

**Refresh Functionality:**
- `generateAvatars()` function creates new set of avatars
- Called on mount and when refresh button clicked
- Each generation produces different avatars (timestamp + random seed)

**Avatar Selection:**
- User clicks on avatar image
- API call to `/api/avatar/:id` with avatar URL
- Updates user data in localStorage
- Redirects to chat page
- Toast notification on success

**File Location:** `client/src/pages/Avatar/Avatar.jsx`

### 11. Chat Page (`client/src/pages/Chat/Chat.jsx`)

**Purpose:** Main chat interface combining contacts and chat box

**Key Features:**

**Socket.io Connection:**
- Creates Socket.io connection on mount
- Emits `add-user` event to register as online
- Listens for `online-users` event
- Updates Redux with online contacts list

**Layout Structure:**
- Two-column layout: Contacts sidebar + Chat area
- Conditional rendering:
  - If no contact selected: Shows Welcome component
  - If contact selected: Shows ChatBox component

**State Management:**
- Uses Redux `selectedContact` to determine what to render
- Socket connection stored in useRef
- Dispatches online contacts to Redux

**File Location:** `client/src/pages/Chat/Chat.jsx`

### 12. Welcome Component (`client/src/components/Welcome/Welcome.jsx`)

**Purpose:** Welcome screen when no contact selected

**Implementation:**
- Simple presentational component
- Displays user's name from localStorage
- Animated robot GIF
- Encourages user to start messaging

**File Location:** `client/src/components/Welcome/Welcome.jsx`

---

## API Configuration (`client/src/apis/restapis.js`)

**Structure:**
- Centralized API endpoint configuration
- Base host URL defined once
- All endpoints exported as constants

**Endpoints:**
- User endpoints: register, login, avatar, search, contact
- Message endpoints: add message, get all messages
- Socket.io host URL

**Benefits:**
- Easy to update API URLs
- Single source of truth
- Environment-specific configuration possible

**File Location:** `client/src/apis/restapis.js`

---

## Key Implementation Patterns

### 1. Custom Events for Component Communication

**Usage:**
- Contact list updates when new contact added
- SearchBar dispatches `contactAdded` event
- Contacts component listens and refreshes

**Why it's used:**
- Decouples components
- No direct component dependencies
- Follows event-driven architecture
- Allows multiple listeners

**Implementation:**
```javascript
// Dispatch event
window.dispatchEvent(new CustomEvent('contactAdded'));

// Listen for event
window.addEventListener('contactAdded', handleContactAdded);
```

### 2. Controlled Components Pattern

**Usage:**
- All form inputs use controlled components
- Value and onChange handler
- Single source of truth in state

**Examples:**
- Login form (email, password)
- Register form (all fields)
- Message input in ChatBox
- Search input in SearchBar

### 3. Conditional Rendering

**Usage:**
- Loading states (Loader vs content)
- Empty states (empty contact list message)
- Modal visibility (search results, avatar dropdown)
- Protected routes (logged in vs not)

**Pattern:**
```javascript
{condition ? <ComponentA /> : <ComponentB />}
{condition && <Component />}
```

### 4. useEffect Optimization

**Empty Dependencies:**
- Contact list loads once on mount
- Socket.io connection created once
- Prevents infinite loops

**Dependencies:**
- Message loading triggers on contact selection
- Auto-scroll triggers on message array changes
- Avatar generation triggers on user data

**Cleanup Functions:**
- Event listeners removed on unmount
- Timers cleared in debouncing
- Prevents memory leaks

### 5. Error Handling Pattern

**Structure:**
- Try-catch blocks in async functions
- Specific error messages for different status codes
- User-friendly toast notifications
- Graceful degradation

**Examples:**
- Login/Register: Shows error toast
- Message sending: Session expiry handling
- Contact addition: Duplicate contact handling

### 6. State Management Strategy

**Redux for Global State:**
- User authentication status
- Selected contact
- Message array
- Online contacts

**Local State for UI:**
- Form inputs
- Modal visibility
- Loading states
- Temporary data

**localStorage/sessionStorage:**
- User data (localStorage - persists)
- JWT tokens (sessionStorage - cleared on close)

### 7. Real-Time Updates Pattern

**Socket.io Integration:**
- Connection established on mount
- Stored in useRef (persists across renders)
- Event listeners set up in useEffect
- Messages received and added to state immediately

**Optimistic Updates:**
- Message added to Redux state immediately on send
- Also sent via Socket.io for real-time delivery
- Provides instant feedback to user

---

## Security Implementation

### 1. Message Encryption

**Implementation:**
- Client-side encryption before sending
- AES encryption using CryptoJS
- Decryption on client-side when displaying
- Messages stored encrypted in database

**Why it matters:**
- Protects user privacy
- Even if database compromised, messages unreadable
- End-to-end security approach

### 2. Token Management

**Storage:**
- JWT tokens in sessionStorage (cleared on browser close)
- User data in localStorage (persists)

**Usage:**
- Token retrieved from sessionStorage
- Included in API request body
- Validated on backend before processing

**Security Benefits:**
- Tokens cleared when browser closes
- Reduces risk of token theft
- Separate storage for sensitive data

### 3. Route Protection

**Implementation:**
- ProtectedRoute component checks Redux state
- Redirects to login if not authenticated
- Prevents direct URL access to protected pages

---

## Performance Optimizations

### 1. Debouncing

**Implementation:**
- Search bar waits 300ms after typing stops
- Reduces API calls significantly
- Better user experience

**Code Pattern:**
```javascript
const debounceTimer = setTimeout(() => {
    // API call
}, 300);
return () => clearTimeout(debounceTimer);
```

### 2. Contact List Optimization

**Problem Solved:**
- Previously had infinite loop (contactList in dependencies)
- Fixed with empty dependency array
- Custom events for updates instead of polling

**Result:**
- Loads once on mount
- Updates only when needed (custom event)
- No unnecessary re-renders

### 3. Conditional Rendering

**Optimizations:**
- Only renders ChatBox when contact selected
- Search modal only renders when open
- Emoji picker only renders when toggled
- Reduces DOM elements when not needed

### 4. State Updates

**Efficient Patterns:**
- Message array replaced (not mutated)
- Redux immutability patterns
- Prevents unnecessary re-renders
- Optimistic updates for better UX

---

## Styling Approach

### SCSS/SASS

**Usage:**
- Component-level SCSS files
- Nested selectors for organization
- Variables for colors (could be improved)
- Responsive design with media queries

### Responsive Design

**Breakpoints:**
- Mobile: max-width 450px, 380px, 320px
- Tablet: max-width 776px, 600px
- Desktop: default styles

**Approach:**
- Mobile-first considerations
- Flexible layouts
- Adjusted font sizes
- Optimized spacing for small screens

### Design System

**Color Scheme:**
- Primary: #752abc, #7838b4 (purple)
- Secondary: #ce9aff (light purple)
- Background: #131324 (dark)
- Text: #fff (white)

**Consistency:**
- Reusable color palette
- Consistent spacing
- Uniform border radius
- Matching shadows and effects

---

## Key Things to Highlight in Presentations

### 1. Real-Time Communication
- Socket.io integration for instant messaging
- WebSocket connections maintained
- Real-time online status updates
- Optimistic UI updates for instant feedback

### 2. Security Features
- Client-side message encryption (AES)
- JWT token-based authentication
- Secure token storage (sessionStorage)
- Route protection implementation

### 3. State Management
- Redux Toolkit for centralized state
- Efficient state updates
- Proper separation of global vs local state
- No prop drilling issues

### 4. Performance Optimizations
- Debouncing in search (reduces API calls)
- Fixed infinite loop in contact list
- Conditional rendering for efficiency
- Optimized useEffect dependencies

### 5. User Experience
- Loading states for better feedback
- Toast notifications for actions
- Responsive design (mobile, tablet, desktop)
- Error handling with user-friendly messages
- Smooth animations and transitions

### 6. Code Organization
- Component-based architecture
- Reusable components
- Separation of concerns
- Clean file structure
- Consistent coding patterns

### 7. Advanced Patterns
- Custom events for component communication
- Controlled components pattern
- Custom hooks pattern (outside click handler)
- Optimistic updates
- Event-driven architecture

### 8. Problem Solving
- Fixed contact list infinite loop
- Implemented debouncing for search
- Resolved session timeout handling
- Improved avatar generation system
- Mobile responsiveness improvements

---

## Important Files Reference

**State Management:**
- `client/src/store/store.js` - Redux store configuration
- `client/src/store/userSlice.js` - Authentication state
- `client/src/store/contactSlice.js` - Contact and online status
- `client/src/store/messageSlice.js` - Message state

**Key Components:**
- `client/src/components/ChatBox/ChatBox.jsx` - Message sending (encryption, Socket.io)
- `client/src/components/ChatBox/ChatContainer.jsx` - Message display (decryption)
- `client/src/components/Contacts/Contacts.jsx` - Contact list (optimization)
- `client/src/components/SearchBar/SearchBar.jsx` - User search (debouncing)
- `client/src/components/ProtectedRoute.jsx` - Route protection

**Pages:**
- `client/src/pages/Chat/Chat.jsx` - Main chat interface
- `client/src/pages/Login/Login.jsx` - Authentication
- `client/src/pages/Avatar/Avatar.jsx` - Avatar selection

**Configuration:**
- `client/src/apis/restapis.js` - API endpoints
- `client/src/App.js` - Routing and app structure

---

## Technical Highlights for Presentations

1. **Full-Stack Integration:** Seamless communication between React frontend and Node.js backend
2. **Real-Time Features:** Socket.io implementation for instant messaging
3. **Security:** Multiple layers (encryption, JWT, route protection)
4. **Performance:** Optimizations prevent common React pitfalls
5. **Modern Stack:** React 18, Redux Toolkit, modern hooks patterns
6. **Production Ready:** Deployed application with error handling
7. **Responsive Design:** Works across all device sizes
8. **Code Quality:** Organized, maintainable, following React best practices

