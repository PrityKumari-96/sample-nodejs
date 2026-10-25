export const money = (value = 0) => Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
export const readableError = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.'
