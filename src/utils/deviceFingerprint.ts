export interface DeviceInfo {
  deviceId: string;
  browser: string;
  os: string;
  screenResolution: string;
  timezone: string;
  language: string;
  timestamp: number;
}

export function generateDeviceFingerprint(): DeviceInfo {
  // Generate a unique device ID based on various factors
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasFingerprint = '';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.substring(0, 100),
  ];

  const fingerprint = hashCode(components.join('|'));

  return {
    deviceId: fingerprint,
    browser: getBrowser(),
    os: getOS(),
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    timestamp: Date.now(),
  };
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'Unknown';
}

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  location: string;
  lastUsed: string;
  trusted: boolean;
}

export function getTrustedDevices(): TrustedDevice[] {
  const stored = localStorage.getItem('trustedDevices');
  return stored ? JSON.parse(stored) : [];
}

export function addTrustedDevice(device: DeviceInfo): void {
  const devices = getTrustedDevices();
  const newDevice: TrustedDevice = {
    id: device.deviceId,
    name: `${device.browser} on ${device.os}`,
    browser: device.browser,
    os: device.os,
    location: 'Unknown', // In production, use IP geolocation API
    lastUsed: new Date().toISOString(),
    trusted: true,
  };
  
  // Avoid duplicates
  const exists = devices.find(d => d.id === newDevice.id);
  if (!exists) {
    devices.push(newDevice);
    localStorage.setItem('trustedDevices', JSON.stringify(devices));
  }
}

export function removeTrustedDevice(deviceId: string): void {
  const devices = getTrustedDevices();
  const filtered = devices.filter(d => d.id !== deviceId);
  localStorage.setItem('trustedDevices', JSON.stringify(filtered));
}

export function isDeviceTrusted(deviceId: string): boolean {
  const devices = getTrustedDevices();
  return devices.some(d => d.id === deviceId && d.trusted);
}
