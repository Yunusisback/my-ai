# Modern AI Chat Interface

A next-generation AI chat interface built with **React 19** and **Tailwind CSS v4**, blending fluid animations, glassmorphism effects, and seamless streaming responses. Beyond a simple chat app, it's a frontend showcase emphasizing UX polish, micro-interactions, accessibility, and scalable architecture.

🚀 **[Live Demo](https://my-ai-tawny-pi.vercel.app/)**

![ai](https://github.com/user-attachments/assets/33425a96-2f15-4912-9cf4-01501b3e9f74)

## ✨ Design & UI Features

Maximum emphasis on visual details and interaction feel:

* **Fluid Animations & Micro-Interactions:**
    * **Lottie Integration:** Eye-tracking interactive logo and loading animations.
    * **Typing Effect:** AI responses stream in typewriter-style (Streaming UI).
    * **Fade-in Transitions:** Smooth entry effects for messages and modals.

* **Dynamic Theme Management:**
    * **Dark & Light Mode:** Eye-friendly color shifts with adaptive Zinc/Slate palettes.
    * **Glassmorphism:** Backdrop-blur effects in Sidebar and Header components.

* **Fully Responsive Design:**
    * **Mobile-First:** Off-canvas Sidebar menu that adapts to screen size.
    * **Custom Scrollbar:** Slim scrollbars integrated with the design.

* **Custom Components:**
    * **Markdown Rendering:** Syntax highlighting for code blocks and copy buttons.
    * **Modal Structures:** Custom-animated pop-ups for settings.

## 🧪 Testing & Quality Assurance

The project is built with reliability in mind, using **Vitest** and **React Testing Library**:

* **Integration Tests:** Verifying the full lifecycle of the `ChatContext`.
* **Unit Tests:** Ensuring individual components like `Sidebar` and `InputField` behave correctly.
* **Mocking:** API calls are mocked using Vitest to ensure tests are fast and deterministic.


## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | React 19 (Vite) |
| **Styling** | Tailwind CSS v4 (Utility-first) |
| **Icons** | Lucide React |
| **Motion** | Lottie React (JSON Animations) |
| **Code Highlighting** | React Syntax Highlighter |
| **Markdown** | React Markdown |
| **API** | Groq Cloud API |

## 🏗️ Component Architecture & Project Structure

The project follows a modular and scalable folder structure, separating concerns between UI, global state, and business logic.

```plaintext
src/
├── api/
│   └── aiService.js          # Groq Cloud API SDK & streaming configuration
├── assets/
│   └── *.json                # Lottie JSON animations (Eye, Logo, etc.)
├── components/
│   ├── ChatInput/            # Modular Input with Voice & File support
│   │   ├── FilePreview.jsx   # Attachment thumbnails & remove logic
│   │   ├── InputField.jsx    # Auto-expanding textarea
│   │   ├── VoiceControl.jsx  # Web Speech API integration
│   │   └── index.jsx         # Main Input entry point
│   ├── Sidebar/              # Chat history & navigation management
│   │   ├── SidebarItem.jsx   # Individual chat thread UI
│   │   ├── SidebarNav.jsx    # Smart grouping (Today, Previous, etc.)
│   │   ├── SidebarUser.jsx   # User profile & settings trigger
│   │   ├── SidebarUtils.js   # Relative date formatting helpers
│   │   └── index.jsx         # Sidebar layout controller
│   ├── ChatMessage.jsx       # Markdown renderer with code highlighting
│   ├── Header.jsx            # Adaptive mobile navigation
│   ├── RenameModal.jsx       # Animated chat title editor
│   ├── Settings.jsx          # Theme & Language toggle interface
│   └── WelcomeScreen.jsx     # Hero section with quick-start prompts
├── constants/
│   └── translations.js       # Localization dictionary (TR/EN)
├── context/
│   ├── ChatContext.jsx       # Central state management (Provider)
│   ├── chatUtils.js          # Logic for file reading & API formatting
│   └── useChatActions.js     # Custom hook for CRUD chat operations
├── tests_/                   # Robust Vitest & RTL test suites
│   ├── aiService.test.js     # API & Error handling tests
│   ├── ChatContext.test.jsx  # Context & State flow tests
│   └── *.test.jsx            # Component-level unit tests
├── App.jsx                   # Main application layout & shell
├── main.jsx                  # React 19 bootstrap entry point
└── index.css                 # Tailwind CSS v4 core directives




## 🤝 Contributing



Contributions, issues, and feature requests are welcome!


