declare namespace Express {
  interface Request {
    user?: {
      name: string
    }

    decoded?: any

    [key: string]: any
  }
}

declare module 'shortid'
