const defaultDb = {
  app: {
    getPublicSettings: async () => ({ id: 'studyhive', public_settings: {} }),
  },
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
    setToken: () => {},
  },
  entities: new Proxy({}, {
    get: () => ({
      filter: async () => [],
      get: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    })
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' })
    }
  }
};

export const db = globalThis.__B44_DB__ || defaultDb;
export const base44 = db;
export default db;
