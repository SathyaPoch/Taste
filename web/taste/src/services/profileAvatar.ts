export function profileAvatarKey(): string {
  try {
    const user = JSON.parse(localStorage.getItem('taste-user') ?? 'null') as { id?: string; phone?: string } | null
    return `taste-user-avatar:${user?.id ?? user?.phone ?? 'guest'}`
  } catch {
    return 'taste-user-avatar:guest'
  }
}

export function getProfileAvatar(): string {
  return localStorage.getItem(profileAvatarKey()) ?? ''
}
