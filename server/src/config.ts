const config = {
    app: { port: 4001 },
    db: {
      database: process.env.DATABASE || "defi-datasets",
      userName: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "1234",
      host: process.env.DATABASE_HOST || "localhost"
    }
}

export default config
