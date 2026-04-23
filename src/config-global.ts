import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'App bán hàng thực phẩm',
  appVersion: packageJson.version,
};
