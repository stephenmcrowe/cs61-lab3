const config = {
  local: {
    database: {
      host: 'localhost',
      user: 'inspector', // 'your localhost username here'
      password: 'inspector', // your localhost password here'
      schema: 'nyc_inspections', // 'your localhost default schema here'
    },
    port: 3000,
  },
};

// use localhost if enviroment not specified
const env = process.argv[2] || 'local';

export default config[env];
