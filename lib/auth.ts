export interface User {
  id: string
  email: string
  name?: string
  age?: number
  healthConditions?: {
    asthma: boolean
    copd: boolean
    cardiovascular: boolean
    lungCancer: boolean
  }
  hasCompletedProfile: boolean
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user))
}

export function logout(): void {
  localStorage.removeItem("user")
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}
