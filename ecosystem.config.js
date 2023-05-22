module.exports = {
  apps: [
    {
      // Primary is what will run CRON jobs
      // can use process.env.name to access this
      // RENAME THIS FOR YOUR PROJECT FOR EASIER FINDING IN pm2 list
      // eg. prj_be_1
      name: 'NestJS Backend Template (Primary)',
      // We run the transpiled version to avoid transpiling
      // all instances to javascript on dev mode
      // So basically because the code is in TS, we can't
      // really use --watch for hot reloading because the
      // the transpiling on multiple instances is resource intensive
      script: './dist/src/main.js',
      instances: '1',
      exec_mode: 'cluster',
      // These overwrite settings in the .env file, so settings
      // here should only be for deployment
      // notably NODE_END and PORT
      // note that NODE_ENV and PORT are set via cross-env in package.json
      // for dev purposes
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production_blue: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production_green: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    // {
    //   name: 'NestJS Backend Template (Replica)',
    //   script: './dist/src/main.js',
    //   // max cpus - 1
    //   // can change to hard coded number
    //   instances: '-1',
    //   exec_mode: 'cluster',
    //   env_development: {
    //     NODE_ENV: 'development',
    //   },
    //   env_production: {
    //     NODE_ENV: 'production',
    //   },
    // },
  ],
};

