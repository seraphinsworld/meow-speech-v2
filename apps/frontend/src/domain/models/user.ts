export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type SignupDetails = LoginCredentials & {
  fullName: string
  passwordConfirmation: string
}
