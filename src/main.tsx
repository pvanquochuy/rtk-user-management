import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./states/store.ts";
import UserForm from "./components/UserForm.tsx";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/add-user" element={<UserForm />}></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
