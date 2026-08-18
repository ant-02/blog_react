import { describe, it, expect } from "vitest";
import userReducer, { login, logout } from "./userSlice";

const mockUser = {
  id: 1,
  username: "test",
  phone: "13800138000",
  avatar: "",
  email: "test@example.com",
  password: "secret",
  bio: "",
  createdAt: "2026-01-01",
  deletedAt: "",
  updatedAt: "2026-01-01",
};

describe("userSlice", () => {
  it("should set user on login", () => {
    const state = userReducer({ user: null, isLoading: true }, login({ user: mockUser }));
    expect(state.user).toEqual(mockUser);
  });

  it("should clear user on logout", () => {
    const state = userReducer({ user: mockUser, isLoading: false }, logout());
    expect(state.user).toBeNull();
  });
});
