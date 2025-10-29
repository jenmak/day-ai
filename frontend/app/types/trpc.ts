// tRPC types for the frontend
// This defines the expected shape of the backend API

export interface AppRouter {
  places: {
    create: {
      mutate: (input: { description: string }) => Promise<any>
    }
    update: {
      mutate: (input: { id: string; description: string }) => Promise<any>
    }
    getBySlug: {
      query: (input: { slug: string }) => Promise<any>
    }
  }
}
