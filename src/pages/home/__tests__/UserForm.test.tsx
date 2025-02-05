import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { store } from "../../../states/store";
import { useUsers } from "../../../hooks/useUsers";
import UserForm from "../../../components/UserForm";

jest.mock("../../../hooks/useUsers", () => ({
  useUsers: jest.fn(),
}));

const renderUserForm = (props = {}) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter>
          <UserForm {...props} />
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );
};

const mockUseUsers = {
  addMutation: { mutate: jest.fn() },
  updateMutation: { mutate: jest.fn() },
};

beforeEach(() => {
  (useUsers as jest.Mock).mockReturnValue(mockUseUsers);
});

describe("UserForm", () => {
  test("renders form with correct initial values in add mode", () => {
    renderUserForm();

    // Check if required fields and submit button are rendered
    expect(
      screen.getByRole("textbox", { name: /First Name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Last Name/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Phone Number/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /Address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /Age/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("shows validation errors for required fields", async () => {
    renderUserForm();

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Validate required field errors
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/last name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/confirm password is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/phone number is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test("shows error for invalid email", async () => {
    renderUserForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Validate invalid email error
    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
  });

  test("shows validation error when input is cleared and blurred", async () => {
    renderUserForm();

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    userEvent.type(firstNameInput, "John");

    userEvent.clear(firstNameInput);
    userEvent.tab();

    // Validate required error after clearing input
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  test("calls addMutation with correct data on submit in add mode", async () => {
    const addMutation = {
      mutate: jest.fn(),
    };
    (useUsers as jest.Mock).mockReturnValue({
      addMutation,
      updateMutation: { mutate: jest.fn() },
    });

    renderUserForm();

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/Age/i), {
      target: { value: "25" },
    });

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(addMutation.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          confirmPassword: "password123",
          phoneNumber: "1234567890",
          address: "123 Main St",
          age: 25,
          id: expect.any(String),
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });
});
