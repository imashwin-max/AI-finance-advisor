import api from "./api";

interface UserResponse {
  id: number;
  email: string;
  full_name: string | null;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export const authService = {
  async login(email: string, password: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>("/auth/login", { email, password });
    return data;
  },
  async register(email: string, full_name: string, password: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>("/auth/register", { email, full_name, password });
    return data;
  },
  async getMe(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>("/auth/me");
    return data;
  },
};
