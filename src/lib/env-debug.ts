// Debug de variables de entorno para NextAuth
export function debugEnvVars() {
  if (process.env.NODE_ENV === 'development') {
    console.log('=== NextAuth Environment Variables Debug ===')
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing')
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '✗ Missing')
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✓ Set' : '✗ Missing')
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✓ Set' : '✗ Missing')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('============================================')
  }
}

// Verificar variables de entorno críticas
export function validateEnvVars() {
  const errors: string[] = []
  
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required')
  }
  
  if (!process.env.ADMIN_EMAIL) {
    errors.push('ADMIN_EMAIL is required')
  }
  
  if (!process.env.ADMIN_PASSWORD) {
    errors.push('ADMIN_PASSWORD is required')
  }
  
  if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL) {
    errors.push('NEXTAUTH_URL is required in production')
  }
  
  if (errors.length > 0) {
    console.error('Environment variable validation failed:')
    errors.forEach(error => console.error(`  - ${error}`))
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${errors.join(', ')}`)
    }
  }
  
  return errors.length === 0
}