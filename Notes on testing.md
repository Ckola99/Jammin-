To test your `useEffect` function that refreshes the `access_token` using `Vitest`, you can create a test file for your `App` component. Here's how you can write a test to check if the token refresh logic is correctly implemented:

### Step 1: Install Vitest and Testing Library

Make sure you have `vitest` and `@testing-library/react` installed:

```bash
npm install --save-dev vitest @testing-library/react
```

### Step 2: Create a Test File

Create a test file for your `App` component, for example, `App.test.jsx`.

```jsx
// src/app/App.test.jsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";
import store from "./store";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("App Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("should refresh the access token before it expires", async () => {
    // Mock localStorage values
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes from now
    localStorage.setItem("token_expiration_time", expirationTime.toString());
    localStorage.setItem("refresh_token", "mock_refresh_token");

    // Mock the getRefreshToken function
    const mockGetRefreshToken = vi.fn().mockResolvedValue("mock_access_token");
    vi.spyOn(require("../features/userSlice"), "getRefreshToken").mockImplementation(mockGetRefreshToken);

    // Render the App component
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the useEffect hook to execute
    await waitFor(() => {
      expect(mockGetRefreshToken).toHaveBeenCalled();
    });

    // Verify if the token was refreshed
    expect(mockGetRefreshToken).toHaveBeenCalledTimes(1);
  });
});
```

### Step 3: Explanation

1. **Mocking `localStorage`**: We create a mock for `localStorage` to simulate storing and retrieving values like `token_expiration_time` and `refresh_token`.

2. **Mocking `getRefreshToken`**: We mock the `getRefreshToken` function to simulate the behavior of refreshing the token.

3. **Rendering the `App` Component**: We use `@testing-library/react` to render the `App` component within a `Provider` for the Redux store and a `MemoryRouter` for routing.

4. **Testing the `useEffect`**: The test waits for the `useEffect` hook to execute and checks if the `getRefreshToken` function was called.

### Step 4: Run the Test

You can run your test using Vitest:

```bash
npx vitest run
```

This will execute the test and verify if your `useEffect` hook is correctly refreshing the access token before it expires.
