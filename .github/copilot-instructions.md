<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a lightweight, client-side SCUM DB analyser web app. Use modern, browser-compatible libraries (e.g., sql.js) and React for the UI. All analysis must run in the browser; no data is sent to any server. The project uses TypeScript and follows best practices for security and performance. It should be easy to extend with new features in the future. Use a modular architecture to keep the codebase maintainable. Use recharts for data visualization and ensure the UI is responsive and user-friendly. The app should be tested thoroughly, with unit tests for critical components. Follow accessibility standards to ensure the app is usable by everyone. Use ESLint and Prettier for code quality and formatting. Document the code well, especially complex logic, to aid future developers. 

When writing code, prioritize clarity and maintainability over cleverness. Use descriptive variable names and write comments where necessary to explain non-obvious logic.
When implementing features, consider how they can be extended or modified in the future. Use TypeScript interfaces and types to define data structures clearly.
When creating components, think about how they can be reused across the application. Use hooks for state management and side effects where appropriate.
When writing tests, focus on critical paths and edge cases. Use Jest for unit testing and React Testing Library for component tests.
When documenting, provide clear explanations of how to use the app, how to contribute, and any important architectural decisions made during development.
When using libraries, ensure they are well-maintained and compatible with modern browsers. Avoid using libraries that require server-side processing or have large bundle sizes.
When considering performance, optimize for client-side rendering and minimize the use of heavy computations in the browser. Use web workers if necessary for intensive tasks.
When thinking about security, ensure that all data handling is done securely in the browser. Avoid exposing sensitive information and validate all inputs to prevent XSS attacks.
When designing the UI, prioritize usability and accessibility. Use semantic HTML and ARIA attributes where necessary to ensure the app is accessible to users with disabilities.
When structuring the project, keep a clear separation of concerns. Use a modular approach to organize components, hooks, utilities, and styles.
When managing state, consider using React's Context API or a state management library like Zustand for global state management.
When deploying the app, ensure it is optimized for performance and security. Use tools like Lighthouse to audit the app before release.
When writing commit messages, use clear and descriptive messages that explain the changes made. Follow conventional commit standards if possible.
When reviewing code, focus on clarity, maintainability, and adherence to the project's coding standards. Provide constructive feedback to help improve the code quality.
When handling errors, provide clear error messages and fallback UI where appropriate. Use error boundaries in React to catch errors in components.
When considering internationalization, use libraries like react-intl or i18next to support multiple languages in the future.
