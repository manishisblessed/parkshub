export type Features = {
  marketplace: boolean;
  payments: boolean;
  farmOperations: boolean;
  inventory: boolean;
  logistics: boolean;
  sms: boolean;
  whatsapp: boolean;
};

const defaults: Features = {
  marketplace: false,
  payments: false,
  farmOperations: true,
  inventory: true,
  logistics: false,
  sms: false,
  whatsapp: false,
};

export function parseFeatures(json: string): Features {
  try {
    const parsed = JSON.parse(json) as Partial<Features>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}
