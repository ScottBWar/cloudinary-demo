import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: '39d85055-0ffd-442e-b5fc-123c2c5bbdfa',
  clientToken: 'pubc0349bb33a4636c9b526eb1a4f815d26',
  site: 'us5.datadoghq.com',
  service: 'demoservice',
  env: 'production',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  defaultPrivacyLevel: 'mask-user-input',
  plugins: [reactPlugin({ router: true })],
  trackResources: true, // ✅ ADD THIS
  trackLongTasks: true, // ✅ Helps see JS blocking tasks
});

console.log('✅ DataDog RUM initialized globally');
window.DD_RUM = datadogRum;
datadogRum.addAction("🔥 Global Init Action", { time: new Date().toISOString() });