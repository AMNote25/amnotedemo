const API_URL = "http://118.69.170.50/API/api/login"
const MOCK_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMTguNjkuMTcwLjUwXC9BUElcL1wvYXBpXC9sb2dpbiIsImlhdCI6MTc1MzQyNzE1NCwiZXhwIjoxNzUzNDcwMzU0LCJuYmYiOjE3NTM0MjcxNTQsImp0aSI6InZQc1pwbk4xT2xjaHRsa2IiLCJzdWIiOjE0MzMxLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIiwiSVAiOiIifQ.p02ueB12Y2tYYmlWS9AzSFBKWjPIcLHkrrnCEPlRKDw"

interface LoginResponse {
  token?: string
  Token?: string
}

/**
 * Đăng nhập và lấy JWT token.
 * Trả về MOCK_TOKEN nếu API không khả dụng.
 */
export async function login(username: string, password: string, companyID: string, Lag: string): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, companyID, Lag }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data: LoginResponse = await res.json()
    return data.token || data.Token || MOCK_TOKEN
  } catch (err) {
    console.error("Login failed, using mock token:", err)
    return MOCK_TOKEN
  }
}
