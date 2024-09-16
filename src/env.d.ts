declare global {
    namespace NodeJs{
        interface ProcessEnv {
            MAIL_TO_ADDRESS: string;
            MAIL_PASS: string;
            EXPRESS_SECRET: string;
            REFRESH_SECRET:string;
            JWT_SECRET:string;
            NODE_ENV: 'development' | 'production';
            PORT?: Number;
          }
    }
  
  }
  
export {}