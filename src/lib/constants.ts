export const SESSION_COOKIE = "ap_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

export const ENQUIRY_TYPES = [
  "GENERAL",
  "BUSINESS",
  "PRODUCT",
  "PARTNERSHIP",
  "FARMER_REGISTRATION",
  "PRODUCE_PROCUREMENT",
  "FARM_COLLABORATION",
  "CONTRACT_FARMING",
  "BUYER_REGISTRATION",
  "BULK_PURCHASE",
  "SOURCING",
  "INSTITUTIONAL",
  "DISTRIBUTOR",
  "RETAILER",
  "VENDOR_REGISTRATION",
  "SERVICE",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_TYPE_LABELS: Record<EnquiryType, string> = {
  GENERAL: "General enquiry",
  BUSINESS: "Business enquiry",
  PRODUCT: "Product enquiry",
  PARTNERSHIP: "Partnership enquiry",
  FARMER_REGISTRATION: "Farmer registration",
  PRODUCE_PROCUREMENT: "Produce procurement",
  FARM_COLLABORATION: "Farm collaboration",
  CONTRACT_FARMING: "Contract farming enquiry",
  BUYER_REGISTRATION: "Buyer registration",
  BULK_PURCHASE: "Bulk purchase",
  SOURCING: "Product sourcing",
  INSTITUTIONAL: "Institutional procurement",
  DISTRIBUTOR: "Distributor enquiry",
  RETAILER: "Retailer enquiry",
  VENDOR_REGISTRATION: "Vendor registration",
  SERVICE: "Service enquiry",
};

export const ENQUIRY_STATUSES = ["NEW", "IN_REVIEW", "RESPONDED", "CLOSED"] as const;
export const PARTNER_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export const PROCUREMENT_STATUSES = ["SUBMITTED", "IN_REVIEW", "QUOTED", "ACCEPTED", "DECLINED", "CLOSED"] as const;
export const QUOTATION_STATUSES = ["DRAFT", "ISSUED", "ACCEPTED", "DECLINED"] as const;
export const ORDER_STATUSES = ["OPEN", "IN_PROGRESS", "FULFILLED", "CLOSED"] as const;
export const PRODUCT_AVAILABILITY = ["ENQUIRY_ONLY", "UNAVAILABLE", "WITHDRAWN"] as const;
export const AVAILABILITY_LABELS: Record<(typeof PRODUCT_AVAILABILITY)[number], string> = {
  ENQUIRY_ONLY: "Available on enquiry",
  UNAVAILABLE: "Not currently offered",
  WITHDRAWN: "Withdrawn",
};

export const PERMISSIONS = [
  ["dashboard.view", "View dashboard"],
  ["content.manage", "Manage website content"],
  ["products.manage", "Manage products and categories"],
  ["enquiries.manage", "Manage enquiries"],
  ["partners.manage", "Manage farmers, buyers, and vendors"],
  ["procurement.manage", "Manage procurement"],
  ["inventory.manage", "Manage inventory and warehouses"],
  ["farms.manage", "Manage farms"],
  ["users.manage", "Manage users"],
  ["roles.manage", "Assign privileged roles"],
  ["settings.manage", "Manage settings"],
  ["audit.view", "View audit logs"],
  ["blog.manage", "Manage insights"],
  ["media.manage", "Manage media"],
  ["reports.view", "View reports"],
  ["compliance.manage", "Manage compliance records"],
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number][0];

export const STAFF_PERMISSIONS: PermissionKey[] = PERMISSIONS.map(([key]) => key);

export const ROLE_DEFINITIONS: { key: string; name: string; description: string; permissions: PermissionKey[] }[] = [
  {
    key: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Full platform control, including privileged role assignment.",
    permissions: STAFF_PERMISSIONS,
  },
  {
    key: "ADMIN",
    name: "Admin",
    description: "Operates the company platform. Cannot grant the Super Admin role.",
    permissions: STAFF_PERMISSIONS.filter((key) => key !== "roles.manage"),
  },
  {
    key: "OPERATIONS_MANAGER",
    name: "Operations Manager",
    description: "Coordinates enquiries, partners, procurement, farms, and inventory.",
    permissions: ["dashboard.view", "enquiries.manage", "partners.manage", "procurement.manage", "farms.manage", "inventory.manage", "reports.view"],
  },
  {
    key: "PROCUREMENT_MANAGER",
    name: "Procurement Manager",
    description: "Handles sourcing, vendors, and purchase enquiries.",
    permissions: ["dashboard.view", "procurement.manage", "partners.manage", "products.manage", "reports.view"],
  },
  {
    key: "FARM_MANAGER",
    name: "Farm Manager",
    description: "Maintains farm, plot, crop, and harvest records.",
    permissions: ["dashboard.view", "farms.manage"],
  },
  {
    key: "INVENTORY_MANAGER",
    name: "Inventory Manager",
    description: "Maintains warehouses, batches, and stock movement.",
    permissions: ["dashboard.view", "inventory.manage"],
  },
  {
    key: "SALES_MANAGER",
    name: "Sales Manager",
    description: "Handles buyer relationships, enquiries, and the catalogue.",
    permissions: ["dashboard.view", "enquiries.manage", "partners.manage", "products.manage", "reports.view"],
  },
  {
    key: "CONTENT_MANAGER",
    name: "Website Content Manager",
    description: "Publishes pages, insights, media, and catalogue descriptions.",
    permissions: ["dashboard.view", "content.manage", "blog.manage", "media.manage", "products.manage"],
  },
  {
    key: "FARMER",
    name: "Farmer",
    description: "Farmer or producer partner. No administrative access.",
    permissions: [],
  },
  {
    key: "BUYER",
    name: "Buyer",
    description: "Business buyer. No administrative access.",
    permissions: [],
  },
  {
    key: "VENDOR",
    name: "Vendor / Supplier",
    description: "Supplier partner. No administrative access.",
    permissions: [],
  },
];

export const PUBLIC_ROLES = ["FARMER", "BUYER", "VENDOR"] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export const DEV_ADMIN_PASSWORD = "AgroParks-Dev-Admin-2026";
