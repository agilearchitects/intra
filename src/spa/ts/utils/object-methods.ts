export const map = (object: any, callback: (key?: string, value?: any) => any) => {
  return Object.keys(object).reduce((previousValue: any, key: string) => {
    return { ...previousValue, [key]: callback(key, object[key]) };
  }, {});
};

export const filter = (object: any, callback: (key?: string, value?: any) => boolean) => {
  return Object.keys(object).filter((key: string) => {
    return callback(key, object[key]);
  }).reduce((previousValue: object, key: string) => ({ ...previousValue, [key]: object[key] }), {});
};
