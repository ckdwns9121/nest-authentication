import 'dotenv/config';
export default () => ({
  ncp: {
    access_key: process.env.NAVER_CLOUD_PLATFORM_API_KEY || '',
    secret_key: process.env.NAVER_CLOUD_PLATFORM_SECRET_KEY || '',
    service_id: process.env.NAVER_CLOUD_PLATFORM_SERVICE_ID || '',
  },
});
