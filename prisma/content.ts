export const SCOPE =
  "This activity sits within the company's authorised objects. It is open for enquiry. Carrying it out depends on land or premises arrangements, applicable Central and State permissions, and written commercial confirmation. Publication on this website is not a statement that a facility is operating or that a sectoral licence has been issued.";

export const settingsSeed = {
  legalName: "AGRO PARKS SOLUTION PRIVATE LIMITED",
  tradeName: "AGRO PARKS",
  email: "support@agroparks.in",
  phone: "",
  website: "https://www.agroparks.in",
  registeredAddress: "Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, South West Delhi, New Delhi – 110075, India",
  principalPlace:
    "3rd Floor, TF-9, Eros Metro Mall, Sector 14 Dwarka, New Delhi, South West Delhi – 110078, India",
  cin: "U01619DL2026PTC470870",
  gstin: "07ABGCA8036N1Z9",
  incorporationDate: "23 September 2026",
  directors: "Vinay Bajpayee and Manish Kumar Shah",
  heroEyebrow: "Agriculture and agribusiness",
  heroTitle: "A disciplined home for cultivation, supply, and agricultural partnership.",
  heroLede:
    "AGRO PARKS SOLUTION PRIVATE LIMITED is a New Delhi company incorporated to pursue farming, nursery, procurement, distribution, post-harvest care, and agricultural support services — carefully, and only where the law and the land allow.",
  introHeading: "Built as a company, not a catalogue of claims.",
  introBody:
    "The company was incorporated on 23 September 2026 under the Companies Act, 2013. Its memorandum authorises cultivation and harvest of lawful crops, nursery and planting material, procurement from farmers and producer organisations, post-harvest handling, and agricultural support services.\n\nThe website explains that scope and receives business enquiries. It does not publish invented operating history, client names, capacities, or certifications. Where a licence or a piece of land is still to be arranged, the page says so.",
  ctaHeading: "Begin with a clear requirement.",
  ctaBody:
    "Tell us the crop, the season, the quantity range, and the role you want AGRO PARKS to play. We respond to enquiries in writing. An enquiry is not an order, a contract, or a confirmation of stock.",
  seoTitle: "AGRO PARKS SOLUTION PRIVATE LIMITED",
  seoDescription:
    "AGRO PARKS SOLUTION PRIVATE LIMITED is a New Delhi agribusiness company for cultivation, nursery, procurement, distribution, post-harvest care, and agricultural support services.",
  mapsEmbedUrl: "",
  publicNotice:
    "AGRO PARKS was incorporated in September 2026. Listings are enquiry-led. Prices, stock, origin, and quality are confirmed only against a specific requirement.",
  featuresJson: JSON.stringify({
    marketplace: false,
    payments: false,
    farmOperations: true,
    inventory: true,
    logistics: false,
    sms: false,
    whatsapp: false,
  }),
};

export const categories = [
  ["cereals-grains", "Cereals & Grains", "Wheat, maize, millets, and other cereal crops open for enquiry."],
  ["rice-pulses", "Rice & Pulses", "Paddy, rice, and pulse crops open for enquiry."],
  ["oilseeds", "Oilseeds", "Mustard, soybean, groundnut, and other oilseeds open for enquiry."],
  ["vegetables", "Vegetables", "Fresh vegetables open for sourcing and supply enquiries."],
  ["fruits", "Fruits", "Fresh fruit enquiries, including orchard produce."],
  ["nuts", "Nuts", "Nut crops open for enquiry where lawfully traded."],
  ["spices", "Spices", "Spice crops and dried spices open for enquiry."],
  ["plantation-products", "Plantation Products", "Plantation crops within the company's authorised objects."],
  ["seeds", "Seeds", "Seed enquiries, subject to applicable seed law and labelling rules."],
  ["seedlings-saplings", "Seedlings & Saplings", "Nursery plants and planting material, subject to nursery rules."],
  ["flowers-herbs", "Flowers & Herbs", "Flowers, culinary herbs, and related horticultural produce."],
  ["medicinal-aromatic", "Medicinal & Aromatic Plants", "Medicinal and aromatic species open for lawful enquiry."],
  ["other-produce", "Other Agricultural Produce", "Other lawful agricultural and horticultural produce."],
].map(([slug, name, description], sortOrder) => ({ slug, name, description, sortOrder }));

const baseProduct = {
  originNote: "Origin is confirmed in writing for a specific lot. It is not stated as a general claim on this listing.",
  qualityNote: "Quality parameters, moisture, grade, and any testing are agreed per enquiry. This listing is not a certificate.",
  packagingNote: "Bags, crates, bulk, or other packing are discussed against quantity, destination, and handling.",
  availabilityStatus: "ENQUIRY_ONLY",
  indicative: true,
};

export const products = [
  ["wheat",            "Wheat",               "cereals-grains",      "/images/harvest.jpg",    "Typical discussions cover season, variety class, quantity range, and delivery point."],
  ["maize",            "Maize",               "cereals-grains",      "/images/maize.jpg",      "Enquiries may cover grain or other lawful forms. End use is confirmed before any supply discussion."],
  ["paddy",            "Paddy",               "rice-pulses",         "/images/rice.jpg",       "Paddy enquiries should state variety preference, if any, and whether milled rice is also of interest."],
  ["chickpea",         "Chickpea",            "rice-pulses",         "/images/chickpea.jpg",   "Desi or kabuli preference, size, and destination can be included in the enquiry."],
  ["mustard",          "Mustard",             "oilseeds",            "/images/spices.jpg",     "Seed and season should be described by the buyer or grower. Oil recovery is not estimated on this page."],
  ["soybean",          "Soybean",             "oilseeds",            "/images/soybean.jpg",    "Enquiries should distinguish grain for crushing from seed for sowing. Sowing seed has additional legal requirements."],
  ["potato",           "Potato",              "vegetables",          "/images/potato.jpg",     "Table, processing, or seed potato should be specified. Seed potato is not offered as certified stock on this page."],
  ["onion",            "Onion",               "vegetables",          "/images/onion.jpg",      "Red, white, or other market class, and whether stored or fresh, should be stated in the enquiry."],
  ["mango",            "Mango",               "fruits",              "/images/mango.jpg",      "Variety, maturity, and destination market determine whether an enquiry can be taken forward."],
  ["banana",           "Banana",              "fruits",              "/images/banana.jpg",     "Hands, variety, and ripening expectations should be described. Ripening infrastructure is not claimed here."],
  ["groundnut",        "Groundnut",           "nuts",                "/images/groundnut.jpg",  "Kernel or in-shell, and any aflatoxin testing expectation, must be agreed in writing if relevant."],
  ["turmeric",         "Turmeric",            "spices",              "/images/spices.jpg",     "Fresh finger or dried form should be specified. Curcumin is not stated unless tested for that lot."],
  ["sugarcane",        "Sugarcane",           "plantation-products", "/images/sugarcane.jpg",  "Planting material and cane for processing are different enquiries and may face different rules."],
  ["cereal-seed",      "Cereal seed enquiry", "seeds",               "/images/grains.jpg",     "Any seed discussion is subject to the Seeds Act, variety rules, and labelling. This listing is not a seed licence."],
  ["marigold-sapling", "Marigold saplings",   "seedlings-saplings",  "/images/marigold.jpg",   "Season, tray size, and delivery window should be included. Nursery accreditation is not claimed."],
  ["lemongrass",       "Lemongrass",          "medicinal-aromatic",  "/images/lemongrass.jpg", "Herb or oil is a different commercial discussion. Essential-oil processing is not described as an operating line."],
  ["fodder",           "Fodder crops",        "other-produce",       "/images/fodder.jpg",     "Green fodder and dry fodder should be specified separately, with the livestock buyer or farm location."],
].map(([slug, name, category, image, note]) => ({
  slug,
  name,
  category,
  image,
  imageAlt: `Illustrative photograph used for the ${name} enquiry listing. This is not an AGRO PARKS product photograph.`,
  summary: `${name} can be discussed through an AGRO PARKS enquiry. Stock, price, and origin are not published here.`,
  description: `${name} is listed so farmers, buyers, and institutions can open a specific conversation.\n\n${note}\n\nThe listing is indicative. It is not an offer of goods, a price, a stock figure, or a quality certificate.`,
  metaTitle: `${name} enquiry`,
  metaDescription: `Send an enquiry to AGRO PARKS about ${name}. Availability, origin, packaging, and quality are confirmed only for a specific requirement.`,
  ...baseProduct,
}));

export const verticals = [
  {
    slug: "agriculture-farming",
    title: "Agriculture & Farming",
    summary: "Lawful farming on land the company owns, leases, or otherwise holds with a proper right.",
    overview:
      "The company's first object is to carry on agriculture, farming, and cultivation, and to grow and harvest crops suited to the land and its agro-climatic conditions.\n\nFarming is organised record by record: location, right to use the land, crop, season, and the permissions that apply. The company does not describe land it does not hold.",
    capabilities:
      "- Crop planning against soil, water, and season\n- Farming on owned, leased, licensed, or contracted land\n- Coordination with farmers where the arrangement is documented\n- Basic farm records for sowing, irrigation, inputs, and harvest",
    benefits:
      "- A company counterparty rather than an informal arrangement\n- Written scope before work begins\n- Room to add land only when the title or tenancy is clear",
    image: "/images/cultivation.jpg",
    imageAlt: "Illustrative photograph of a cultivated field. This is not an AGRO PARKS farm.",
  },
  {
    slug: "crop-cultivation",
    title: "Crop Cultivation",
    summary: "Cereals, pulses, oilseeds, vegetables, and other lawful field crops.",
    overview:
      "Cultivation covers cereals, grains, rice, pulses, oilseeds, fibre and fodder crops, vegetables, roots, tubers, and other produce named in the memorandum, where the crop is lawful and suited to the site.\n\nVariety, seed source, and input use are recorded for each crop. The company does not publish yield claims.",
    capabilities:
      "- Seasonal crop plans\n- Sowing and transplanting arrangements\n- Crop monitoring notes\n- Harvest coordination",
    benefits:
      "- Clear crop and season definitions\n- Enquiries tied to a real location and window\n- No published yield or acreage that has not been recorded",
    image: "/images/grains.jpg",
    imageAlt: "Illustrative photograph of cereal crops. This is not an AGRO PARKS field.",
  },
  {
    slug: "orchards-plantations",
    title: "Orchards & Plantations",
    summary: "Orchards and plantation crops where land and planting material are lawfully in hand.",
    overview:
      "Orchards and plantations are a distinct part of the company's objects, separate from annual field crops. They need a longer land arrangement and a clear planting-material source.\n\nUntil a site is recorded in the farm register, this page describes the authorised activity rather than an operating orchard.",
    capabilities:
      "- Orchard and plantation planning\n- Planting-material enquiries through the nursery object\n- Multi-season record keeping\n- Harvest-window discussions with buyers",
    benefits:
      "- Long-cycle crops are not mixed up with spot trading\n- Buyers can enquire without being told a farm exists\n- Planting decisions stay tied to land rights",
    image: "/images/orchard.jpg",
    imageAlt: "Illustrative aerial photograph of farmland. This is not an AGRO PARKS orchard.",
  },
  {
    slug: "greenhouses-polyhouses",
    title: "Greenhouses & Polyhouses",
    summary: "Protected structures on land the company is entitled to use.",
    overview:
      "Greenhouses, polyhouses, and shade-net houses are authorised where they can be built and operated within land-use, water, and local permission requirements.\n\nA structure is added to the operating record only after the site and the permission position are known. The photograph on this page is illustrative.",
    capabilities:
      "- Site and structure enquiries\n- Crop choice for protected conditions\n- Nursery use of protected space\n- Buyer programmes for protected produce",
    benefits:
      "- Protected cultivation is scoped before capital is committed\n- Crop and structure are documented together\n- No implied network of houses",
    image: "/images/greenhouse.jpg",
    imageAlt: "Illustrative photograph of protected cultivation. This is not an AGRO PARKS greenhouse.",
  },
  {
    slug: "hydroponics-protected-cultivation",
    title: "Hydroponics & Protected Cultivation",
    summary: "Hydroponic and other protected systems, when a site and operating plan exist.",
    overview:
      "The memorandum allows hydroponic and other protected-cultivation facilities. These systems need reliable water, power, and a person competent to run them.\n\nAGRO PARKS will describe a hydroponic operation only after it is actually commissioned. Enquiries are welcome for future programmes.",
    capabilities:
      "- Feasibility conversations for protected systems\n- Crop shortlists for soilless culture\n- Separation of pilot and commercial stages\n- Buyer interest recorded before production is promised",
    benefits:
      "- No pretence that a hydroponic farm is already running\n- Technical scope is written down\n- Commercial interest can be registered early",
    image: "/images/greenhouse.jpg",
    imageAlt: "Illustrative photograph of leafy greens in a protected system. This is not an AGRO PARKS facility.",
  },
  {
    slug: "seeds-nursery",
    title: "Seeds & Nursery",
    summary: "Planting material, seedlings, and seed activity subject to seed and nursery law.",
    overview:
      "The company may propagate plants and deal in lawful seeds, seedlings, saplings, and related planting material. Seed production, processing, and sale in India sit under specific central and state rules, including variety, labelling, and nursery requirements.\n\nAGRO PARKS does not present this page as a seed licence or a certified nursery. Those documents will be published in the compliance register only when they are issued.",
    capabilities:
      "- Seed and planting-material enquiries\n- Seedling and sapling discussions\n- Record of variety and source when a supply is confirmed\n- Compliance fields for licences and expiry dates",
    benefits:
      "- Buyers are not shown a badge the company does not hold\n- Farmers can ask for planting material without a fake catalogue price\n- Licences stay in an admin register with dates",
    image: "/images/nursery.jpg",
    imageAlt: "Illustrative photograph of young plants. This is not an AGRO PARKS nursery.",
  },
  {
    slug: "agricultural-procurement",
    title: "Agricultural Procurement",
    summary: "Buying produce from the company farms and from lawful farmers and organisations.",
    overview:
      "Procurement covers produce grown by the company and produce bought from farmers, producer organisations, and other lawful suppliers. It can move through farms, collection points, mandis, and institutional channels that are permitted.\n\nEach procurement is an enquiry or a request with a counterparty, a crop, a quantity note, and a status. The platform does not calculate commissions or release payments.",
    capabilities:
      "- Farmer and supplier registration\n- Produce interest records\n- Purchase requests and status tracking\n- Quotation notes without a settlement engine",
    benefits:
      "- A single enquiry trail\n- Supplier identity recorded before approval\n- No implied mandi licence or payment product",
    image: "/images/produce.jpg",
    imageAlt: "Illustrative photograph of fresh produce. This is not AGRO PARKS inventory.",
  },
  {
    slug: "trading-distribution",
    title: "Agricultural Trading & Distribution",
    summary: "Supply and distribution of lawful produce through permitted channels.",
    overview:
      "The company may buy, sell, supply, distribute, and market agricultural and horticultural produce. Trading follows the procurement record and the buyer's written requirement.\n\nDistribution to retailers, institutions, or other buyers is discussed case by case. The website does not run checkout or dispatch tracking against a logistics partner.",
    capabilities:
      "- Bulk and institutional enquiries\n- Distributor and retailer registration\n- Order enquiries linked to a requirement\n- Status a manager can update in writing",
    benefits:
      "- Buyers deal with a company\n- Requirements stay on record\n- Fulfilment is not implied before it is agreed",
    image: "/images/produce.jpg",
    imageAlt: "Illustrative photograph of a produce display. This is not an AGRO PARKS store.",
  },
  {
    slug: "post-harvest-management",
    title: "Post-Harvest Management",
    summary: "Cleaning, sorting, grading, drying, packing, and related care of produce.",
    overview:
      "Post-harvest work in the memorandum includes cleaning, washing, sorting, grading, drying, threshing, shelling, curing, ripening, chilling, testing, packing, labelling, and storage.\n\nFood processing is a further step and is undertaken only after the registrations that apply to the product, the premises, and the capacity. This page does not describe a processing plant.",
    capabilities:
      "- Receiving and batch notes\n- Sorting, grading, and drying records\n- Packing and labelling fields\n- Separation between post-harvest handling and licensed processing",
    benefits:
      "- Lots can be traced once they are received\n- Quality notes are internal records, not public certificates\n- Processing is not bundled in by default",
    image: "/images/warehouse.jpg",
    imageAlt: "Illustrative photograph of a warehouse aisle. This is not an AGRO PARKS packhouse.",
  },
  {
    slug: "warehousing-storage",
    title: "Warehousing & Storage",
    summary: "Storage and warehousing, including cold storage where a facility and permission exist.",
    overview:
      "Storage, warehousing, and preservation are authorised objects. A warehouse or cold store also has to meet the rules for that building, commodity, and location.\n\nThe inventory module can record a warehouse as planned or active. Nothing in the public site should be read as a statement that a cold store is open.",
    capabilities:
      "- Warehouse records with a status\n- Batch location against a warehouse\n- Stock movement in, out, and adjustment\n- Cold-storage noted as a warehouse type, not as an operating claim",
    benefits:
      "- Storage capacity is not invented\n- Stock is batch-based when goods are actually received\n- Public catalogue stays independent of warehouse quantities",
    image: "/images/warehouse.jpg",
    imageAlt: "Illustrative photograph of pallet racking. This is not an AGRO PARKS warehouse.",
  },
  {
    slug: "agricultural-support-services",
    title: "Agricultural Support Services",
    summary: "Field services delivered by competent people, against a written scope.",
    overview:
      "Support services include land preparation, sowing, transplanting, irrigation support, crop monitoring, harvesting, custom hiring of machinery, soil and crop advisory, precision-agriculture support, and farm-management services.\n\nServices are offered on enquiry. Machinery hiring depends on the machine, the operator, and the location. Advisory is not a guaranteed agronomic outcome.",
    capabilities:
      "- Service enquiries by activity\n- Farm-management records for engaged farms\n- Advisory kept separate from certification\n- Machinery hiring scoped per job",
    benefits:
      "- Farmers can ask for a defined job\n- The company can refuse work outside its competence or permissions\n- Service pages state availability plainly",
    image: "/images/farmers.jpg",
    imageAlt: "Illustrative photograph of people in a field. These are not AGRO PARKS employees.",
  },
  {
    slug: "sustainable-organic-farming",
    title: "Sustainable & Organic Farming",
    summary: "Sustainable farming systems, with organic claims only through the proper route.",
    overview:
      "The memorandum allows organic, natural, regenerative, integrated, climate-smart, and water-efficient systems. It also requires that organic, residue, quality, origin, or sustainability claims be made only under the certification, testing, traceability, and labelling route for the market in question.\n\nAGRO PARKS does not describe itself as a certified organic operator on this website.",
    capabilities:
      "- Farming-system discussions\n- Soil and water efficiency practices where a farm is engaged\n- A compliance register for any future certificate\n- Public language kept inside what has been verified",
    benefits:
      "- Buyers are not shown an organic mark without a certificate\n- Practices and claims are separated\n- A certificate can be added later with its expiry date",
    image: "/images/soil.jpg",
    imageAlt: "Illustrative photograph of a green crop. This is not a certified AGRO PARKS field.",
  },
].map((item, sortOrder) => ({
  ...item,
  status: "AUTHORISED",
  availabilityNote: SCOPE,
  sortOrder,
  metaTitle: item.title,
  metaDescription: item.summary,
}));

export const services = [
  ["land-preparation", "Land preparation", "Primary tillage and field preparation for an agreed plot.", "The work is limited to the plots named in the engagement and to access the company is allowed to use.", "/images/cultivation.jpg"],
  ["sowing-transplanting", "Sowing and transplanting", "Sowing and transplanting support for a stated crop and window.", "Seed or seedlings supplied for the job must have a lawful source. The service does not itself certify seed.", "/images/farmers.jpg"],
  ["irrigation-support", "Irrigation support", "Irrigation arrangements for an engaged field.", "Water use follows the source, the local rules, and the design that is actually installed. No irrigation network is claimed.", "/images/irrigation.jpg"],
  ["crop-monitoring", "Crop monitoring", "Field observations recorded against a crop.", "Monitoring notes are operational records. They are not a remote-sensing product and they are not a pest-control guarantee.", "/images/cultivation.jpg"],
  ["harvesting", "Harvesting", "Harvest labour and coordination for a mature crop.", "Timing, access, and the receiving point are agreed before the crew is planned.", "/images/grains.jpg"],
  ["machinery-hiring", "Farm machinery hiring", "Custom hiring of machinery where a machine and operator are available.", "Availability is per machine and per date. Hiring is not a representation that a fleet is owned.", "/images/orchard.jpg"],
  ["soil-crop-advisory", "Soil and crop advisory", "Advisory on soil and crop questions for a defined farm.", "Advice is professional opinion for that enquiry. It is not a laboratory certificate unless a test report is attached.", "/images/soil.jpg"],
  ["precision-agriculture", "Precision agriculture", "Support for tools that improve placement of water and inputs.", "Tools are used when they are approved for the engagement. Sensor feeds and satellite products are not connected on this platform.", "/images/orchard.jpg"],
  ["farm-management", "Farm management", "Coordination of records and day-to-day decisions for an engaged farm.", "The farm module stores the records. It does not replace the person responsible on the ground.", "/images/farmers.jpg"],
  ["post-harvest-services", "Post-harvest services", "Receiving, cleaning, sorting, grading, drying, and packing services.", "The service stops short of food processing unless the applicable licence for that product and premises is in place.", "/images/warehouse.jpg"],
].map(([slug, title, summary, scopeNote, image], sortOrder) => ({
  slug,
  title,
  summary,
  overview: `${summary}\n\n${scopeNote}\n\nAsk for this service with the location, crop, and dates. We confirm whether it can be staffed before anyone treats the request as booked.`,
  scopeNote,
  availability: "ON_ENQUIRY",
  image,
  imageAlt: `Illustrative photograph for ${title}. This is not an AGRO PARKS operation.`,
  sortOrder,
  metaTitle: title,
  metaDescription: `${summary} Subject to location, competence, and applicable permissions.`,
}));

export const posts = [
  {
    slug: "how-an-agribusiness-enquiry-should-read",
    title: "How an agribusiness enquiry should read",
    excerpt: "A useful enquiry names the crop, the window, the quantity range, and the decision that is actually being asked for.",
    coverImage: "/images/produce.jpg",
    coverAlt: "Illustrative photograph of fresh produce in a market.",
    metaTitle: "How an agribusiness enquiry should read",
    metaDescription: "What AGRO PARKS needs in a product, procurement, or partnership enquiry before it can respond properly.",
    body: `## What we can answer

AGRO PARKS can respond properly when the message distinguishes a few different requests. A farmer asking whether produce can be aggregated is not the same as a buyer asking for a season's supply, and neither is the same as a question about nursery plants.

## What to include

Name the crop in ordinary language. Add the season or month, the state or district, and a quantity range rather than a single invented figure. Say whether you need supply, procurement, a service, or only a conversation.

If a quality parameter matters, say which one. Do not assume the company holds a certificate for it. If a test is required, it has to be agreed and, where necessary, commissioned.

## What the reply will not do

A reply confirms that the enquiry was received and, when the team can, whether the company is able to take the next step. It does not create a contract, fix a price, or reserve stock. Prices are not listed on the website because they depend on the lot.

## Accounts and references

If you register as a farmer, buyer, or vendor, the application stays pending until it is reviewed. You will receive a reference number for contact-form enquiries. Quote it if you write again.`,
  },
  {
    slug: "what-farmers-can-prepare",
    title: "What farmers can prepare before a partnership conversation",
    excerpt: "Land, crop, and season details make a partnership enquiry useful. A website form is not a contract farming agreement.",
    coverImage: "/images/farmers.jpg",
    coverAlt: "Illustrative photograph of agricultural workers in a field.",
    metaTitle: "Preparing a farmer partnership enquiry",
    metaDescription: "Information farmers can gather before speaking with AGRO PARKS about produce or collaboration.",
    body: `## The conversation is still an enquiry

Farmer registration on this website creates an application. It does not appoint AGRO PARKS as a buyer, and it does not create a contract farming arrangement. Contract farming, where it is discussed, has to follow the law that applies and a written agreement.

## Useful facts

The district, the crops you actually grow, and the harvest window are enough to start. If you have a land arrangement, describe it in plain words. Do not upload identity documents to the public form.

If you want the company to consider produce, add a produce note from your account after registration: crop, location, and a quantity note. Leave quality claims for the lot discussion.

## What we will not ask you to pretend

You do not need to describe the farm as organic, residue-free, or export-ready. If a buyer later needs a test or a certificate, that is a separate step with its own documents.

## Review

Applications are approved or declined inside the company. Until then you can still see the status of your application when you sign in.`,
  },
  {
    slug: "reading-a-post-harvest-record",
    title: "Reading a post-harvest record",
    excerpt: "A batch is a quantity of produce with a source, a date, and a status. It is not a quality certificate.",
    coverImage: "/images/warehouse.jpg",
    coverAlt: "Illustrative photograph of a warehouse interior.",
    metaTitle: "How AGRO PARKS thinks about post-harvest records",
    metaDescription: "Why receiving, grading, and storage records are kept separate from public product claims.",
    body: `## Receiving is the start of the record

When produce is received, the useful facts are ordinary ones: what it is, where it came from, when it arrived, how much there is, and which location holds it. AGRO PARKS keeps those facts on a batch once a warehouse record exists.

## Grading is a description

Sorting and grading describe the lot against criteria agreed for that job. A grade name on an internal record is not a public certification mark and it is not a laboratory result.

## Processing is a different permission

Cleaning, drying, and packing are not the same thing as food processing. Processing waits for the licence that applies to the product, the premises, and the capacity. The website does not imply that this licence is already held.

## The public catalogue stays quieter

Catalogue pages invite enquiries. They do not read from warehouse quantities, and they do not show a price. That separation is deliberate while commercial operations are being established.`,
  },
].map((post) => ({
  ...post,
  published: true,
}));

export const faqs = [
  ["Is AGRO PARKS an operating farm network?", "No. AGRO PARKS SOLUTION PRIVATE LIMITED was incorporated on 23 September 2026. The website explains the company's authorised agricultural business and accepts enquiries. It does not describe a network of operating farms."],
  ["Can I buy produce and pay online?", "Not on this website. Purchasing is enquiry-based. There is no checkout, and payment release is not part of the platform."],
  ["Why are there no prices?", "Price depends on crop, season, quality, quantity, and destination. Publishing a price without a lot would be misleading, so listings stay on enquiry."],
  ["Are the products in stock?", "Listings marked as indicative are not a stock position. Availability is confirmed in reply to an enquiry. The catalogue is not connected to the warehouse module."],
  ["Are the photographs of your farms?", "No. Photographs are illustrative stock images. Captions and alternative text say so. They are not company land, buildings, or staff."],
  ["Do you hold organic certification?", "The company does not claim organic, residue-free, or chemical-free certification on this website. A certificate will be recorded in the compliance register only if it is issued."],
  ["Can farmers register?", "Yes. Farmer registration creates a pending application and a user account after email verification. It does not grant administrative access and it is not itself a purchase contract."],
  ["What about contract farming?", "You may send a contract farming enquiry. Any arrangement would be subject to applicable law and a written agreement. The form does not create that agreement."],
  ["Where is the company registered?", "The registered office is Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, South West Delhi, New Delhi – 110075. The GST principal place of business is a separate address at Eros Metro Mall, Sector 14 Dwarka, New Delhi – 110078."],
  ["Who can sign in to the admin dashboard?", "Only company users who have been given a staff role. Public registration offers farmer, buyer, and vendor accounts only."],
];

export const pages = {
  about: {
    title: "About us",
    metaTitle: "About AGRO PARKS",
    metaDescription: "Company overview, purpose, and corporate information for AGRO PARKS SOLUTION PRIVATE LIMITED.",
    sections: [
      ["overview", "Company overview", "AGRO PARKS SOLUTION PRIVATE LIMITED is a private limited company incorporated in New Delhi to pursue agriculture, horticulture, procurement, distribution, post-harvest management, and related support services.\n\nThe company is at the beginning of that work. This website is the public record of its scope and the place where farmers, buyers, and institutions can enquire."],
      ["background", "Background", "The company was incorporated on 23 September 2026. The Corporate Identity Number is U01619DL2026PTC470870. The objects in the memorandum are the source for the business pages on this site.\n\nEarlier operating history, project lists, and client relationships are not described because they are not claimed."],
      ["vision", "Vision", "To be a reliable agribusiness company that farmers and buyers can deal with in writing: clear about what it grows or procures, clear about what it has licensed, and unwilling to decorate either."],
      ["mission", "Mission", "To organise cultivation, nursery activity, procurement, distribution, storage, and field services so that each engagement has a counterparty, a scope, and a record.\n\nTo adopt digital tools where they make those records more accurate, not where they only decorate a brochure."],
      ["values", "Core values", "- Say what is authorised, and separately say what is operating\n- Keep farmer and buyer enquiries on the record\n- Treat land, seed, food, storage, and environmental rules as part of the work\n- Refuse quality claims that a certificate or a test does not support\n- Prefer a plain page to a crowded one"],
      ["philosophy", "Business philosophy", "Agricultural trade fails when quantity, quality, and responsibility are left vague. AGRO PARKS would rather decline an enquiry than imply a capacity, a licence, or a relationship it does not have.\n\nGrowth is expected across farming, supply, and services. It is sequenced. A module in the software is not the same thing as a business line in the field."],
      ["commitment", "Agricultural commitment", "The company will deal in lawful crops and planting material, keep a distinction between its own cultivation and procured produce, and record source details when a lot is actually received.\n\nSupport to farmers is practical: procurement conversations, field services where they can be staffed, and records that the farmer can see in the partner account."],
      ["objectives", "Long-term objectives", "- Establish cultivation where land is lawfully available\n- Build a nursery and planting-material activity that meets seed and nursery rules\n- Aggregate and supply produce with a written trail\n- Add post-harvest handling and storage as premises and permissions allow\n- Keep a digital system that can grow into marketplace and farm operations without pretending those parts are finished"],
      ["sustainability", "Sustainability commitment", "Water, soil, and climate sit inside crop planning where the company farms or advises. Sustainable, natural, and regenerative methods are part of the authorised objects.\n\nPublic sustainability language stays descriptive. Certification and residue claims wait for the route that applies to the market being served."],
      ["corporate", "Corporate information", "Legal name: AGRO PARKS SOLUTION PRIVATE LIMITED.\nRegistered office: Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, South West Delhi, New Delhi – 110075, India.\nCIN: U01619DL2026PTC470870.\nDate of incorporation: 23 September 2026.\nGSTIN: 07ABGCA8036N1Z9, issued on 5 October 2026.\nGST principal place of business: 3rd Floor, TF-9, Eros Metro Mall, Sector 14 Dwarka, New Delhi – 110078.\nDirectors on the GST record: Vinay Bajpayee and Manish Kumar Shah. Residential addresses are not published here.\nEmail: support@agroparks.in."],
    ],
  },
  sustainability: {
    title: "Sustainability",
    metaTitle: "Sustainable agriculture",
    metaDescription: "How AGRO PARKS approaches sustainable, regenerative, and water-efficient farming without unsupported certification claims.",
    sections: [
      ["approach", "A practical standard", "Sustainable agriculture, for this company, means crop choices and field practices that can be explained, repeated, and checked. It is not a badge in the header.\n\nThe memorandum allows organic, natural, regenerative, integrated, climate-smart, and water-efficient systems. It also limits the claims that can be made about them."],
      ["natural", "Natural farming", "Natural farming methods can be discussed for a specific field. The discussion covers inputs, labour, and what the buyer is actually willing to specify. A method is not described as certified because it is traditional or low-input."],
      ["regenerative", "Regenerative agriculture", "Soil cover, residue handling, and longer rotations are relevant where the company has a season on a piece of land. They are recorded as practices. They are not converted into a carbon or ecosystem claim on this website."],
      ["water", "Water-efficient cultivation", "Irrigation support starts from the water source that is legally available. Scheduling and placement are part of the service enquiry. The company does not claim a quantified water saving for farms it has not measured."],
      ["climate", "Climate-smart farming", "Season, variety duration, and harvest risk belong in the crop note. Weather services and sensors are future integrations. They are not connected, and the site does not show a live weather feed."],
      ["soil", "Soil conservation", "Soil advisory can include a recommendation to test, to reduce unnecessary tillage, or to keep cover. A recommendation is not a laboratory report. Test reports, when they exist, stay with the engagement."],
      ["responsibility", "Environmental responsibility", "Land use, water, and environmental permissions are checked before an activity that needs them. The compliance register is where those documents and their expiry dates are kept once they are issued.\n\nWaste from packing and rejected produce will be handled under the rules for that site when a site is operating. There is no public claim of a zero-waste facility."],
      ["claims", "What we will not say", "The website does not say that produce is organic, residue-free, chemical-free, or carbon-neutral. Those words need a certification, a test, or a method the company is prepared to show.\n\nIf that evidence exists for a lot, it will be shared with the buyer of that lot. It will not be turned into a site-wide mark."],
    ],
  },
};

export const legalDocuments = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    metaDescription: "How AGRO PARKS SOLUTION PRIVATE LIMITED handles personal information collected through this website.",
    reviewNote: "Working draft for legal review before it is treated as the company's final privacy notice.",
    body: `This draft explains how AGRO PARKS SOLUTION PRIVATE LIMITED ("AGRO PARKS", "we") handles personal information collected through www.agroparks.in. It is a working text for review. It is not a substitute for legal advice.

## Who is responsible

AGRO PARKS SOLUTION PRIVATE LIMITED, registered office at Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, South West Delhi, New Delhi – 110075, India. Email: support@agroparks.in.

## What we collect

We collect the details you type into an enquiry or registration form: name, company, email, phone, address fields you choose to give, and the content of your message. If you create an account, we store a password hash, not the password itself. Staff accounts, role changes, and enquiry status changes are written to an audit log.

We do not ask for Aadhaar, PAN of an individual, or payment card numbers on the public forms.

## Why we use it

We use the information to reply to enquiries, review farmer, buyer, and vendor applications, keep procurement and farm records, secure the website, and meet company-law and tax record duties that apply to us. We do not sell personal information.

## How long we keep it

Enquiry and account records are kept while the relationship is active and for as long as a legal, tax, or audit reason remains. You may ask us to close an account. We may retain a limited record of the request itself.

## Sharing

We use a hosting provider and, when configured, an email provider to deliver messages. We do not put advertising trackers on this site. We share information when the law requires it or when a professional adviser needs it for the company's work.

## Security

Passwords are hashed. Sessions use an httpOnly cookie. Administrative tools are limited by role. No method of transmission is perfectly secure.

## Your requests

You may write to support@agroparks.in to ask for a correction, or to ask about access or deletion, subject to the records we must keep. The Digital Personal Data Protection Act, 2023 may apply to parts of this processing. This draft does not describe every right in that Act in legal language.

## Changes

A revised version will replace this page when the company adopts it. The status shown at the top of the page tells you whether counsel has cleared the text.`,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    metaDescription: "Terms for using the AGRO PARKS website, enquiry forms, and partner accounts.",
    reviewNote: "Working draft for legal review. Not a final customer or supplier contract.",
    body: `These draft terms govern use of the website operated by AGRO PARKS SOLUTION PRIVATE LIMITED. They are published for review and do not, by themselves, conclude a supply contract.

## The website

The site describes the company's authorised business and accepts enquiries. Catalogue entries are indicative. They are not offers, not stock statements, and not quotations. A quotation, where one is issued, will be a separate written communication.

## No online checkout

The platform does not take payment, calculate commission, or release settlement. An "order enquiry" is a tracked request. It is not an order under the Sale of Goods Act until both sides have agreed terms in writing, including price, quantity, quality, and delivery.

## Accounts

Public registration is available for farmers, buyers, and vendors. It does not create an employment, dealership, or agency relationship, and it never creates an administrator. We may refuse, suspend, or close an account that is inaccurate, abusive, or unused.

You are responsible for the password and for the truth of the details you submit. Do not upload documents the form does not ask for.

## Licences and land

Nothing on the site is a representation that every authorised object is licensed, staffed, or in operation. Seed, nursery, food processing, storage, land, water, and environmental permissions are obtained when the activity requires them.

## Acceptable use

Do not attempt to break access controls, submit malicious files, or use the forms to send unrelated advertising. We may ignore messages that fail these terms.

## Intellectual property

The text of this website is used by the company. Photographs are illustrative stock images and are not photographs of the company's property or people.

## Liability

To the extent the law allows, the website is provided as a business introduction and record system. We do not accept liability for decisions you take solely from indicative listings or from draft legal pages. Nothing here excludes liability that Indian law does not allow us to exclude.

## Law

These terms are governed by the laws of India. Courts at Delhi have jurisdiction, subject to any provision of law that gives a consumer or farmer a different forum.

## Contact

support@agroparks.in.`,
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    metaDescription: "Cookies used by the AGRO PARKS website.",
    reviewNote: "Working draft for legal review. Describes the cookies the site actually sets.",
    body: `This draft describes cookies on www.agroparks.in as the site is built today.

## Essential cookie

When you sign in, the site stores a session cookie named ap_session. It is httpOnly, which means browser scripts on the page cannot read it. It identifies your signed-in session and expires within twelve hours. If you do not sign in, that cookie is not set.

## What we do not use

The public site does not set advertising cookies, social-media pixels, or a third-party analytics cookie. Embedded maps are not loaded unless an administrator has configured a map address. Until then, the contact page offers a link to open the address in Google Maps, which is a separate site with its own policy.

## Managing cookies

You can delete cookies in the browser. If you delete the session cookie, you will be signed out. The site does not offer a preference centre for advertising cookies because those cookies are not in use.

## Changes

If a later version of the site adds analytics or an embedded map, this page has to be updated first and the status reviewed.`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    metaDescription: "Limits on how the AGRO PARKS website should be read.",
    reviewNote: "Working draft for legal review.",
    body: `Please read the AGRO PARKS website with the following limits in mind. This text is a draft for legal review.

## Illustrative images

Photographs of fields, people, greenhouses, produce, and warehouses are stock images used to explain agricultural subject matter. They are not photographs of AGRO PARKS land, buildings, equipment, harvests, or employees.

## No operating history beyond the record

The company was incorporated on 23 September 2026. Pages do not state turnover, production capacity, client names, awards, or partnerships that are not on the company record.

## Not every object is an operating line

The memorandum lists cultivation, nursery, trading, post-harvest work, storage, and services. A page for each subject means the company is authorised to pursue it and is willing to receive enquiries. It does not mean a licence has been granted or that a facility is open.

## Not advice

Crop notes, service descriptions, and insight articles are business information. They are not agronomic, legal, tax, or investment advice for your land or company. Decisions that need a licence, a test, or a professional opinion should be taken with that document or adviser.

## Enquiries

Submitting a form does not reserve goods, create a contract, or start a contract farming agreement.

## External links

A map link leaves this website. The external site is responsible for its own content.

## Contact

Questions about this draft: support@agroparks.in.`,
  },
];

export const emailTemplates = [
  ["enquiry-received", "We received your enquiry {{reference}}", "Dear {{name}},\n\nAGRO PARKS SOLUTION PRIVATE LIMITED has received your enquiry.\n\nReference: {{reference}}\nSubject: {{subject}}\n\nThis message confirms receipt. It is not a quotation or an acceptance. If we need more detail, we will write to this email address.\n\nAGRO PARKS\nsupport@agroparks.in"],
  ["enquiry-staff", "New enquiry {{reference}}", "A new website enquiry has been stored.\n\nReference: {{reference}}\nType: {{type}}\nFrom: {{name}} <{{email}}>\nSubject: {{subject}}\n\nSign in to the admin dashboard to read and reply."],
  ["verify-email", "Verify your AGRO PARKS account", "Dear {{name}},\n\nConfirm your email address to activate your AGRO PARKS account:\n\n{{link}}\n\nThe link expires in 24 hours. If you did not register, you can ignore this message.\n\nAGRO PARKS\nsupport@agroparks.in"],
  ["reset-password", "Reset your AGRO PARKS password", "Dear {{name}},\n\nUse this link to choose a new password:\n\n{{link}}\n\nThe link expires in one hour. If you did not ask for a reset, you can ignore this message.\n\nAGRO PARKS\nsupport@agroparks.in"],
  ["application-status", "Your AGRO PARKS application is {{status}}", "Dear {{name}},\n\nThe status of your {{role}} application is now {{status}}.\n\n{{note}}\n\nYou can sign in at {{link}} to see your account.\n\nAGRO PARKS\nsupport@agroparks.in"],
  ["enquiry-reply", "Reply to enquiry {{reference}}", "Dear {{name}},\n\n{{body}}\n\nReference: {{reference}}\n\nThis message is a reply from AGRO PARKS. It is a contract only if it says so and the commercial terms are complete.\n\nAGRO PARKS\nsupport@agroparks.in"],
];

export const integrations = [
  ["payments", "Payment gateway", "Card, UPI, or net-banking collection. Left disabled until a provider, a settlement design, and written approval exist."],
  ["logistics", "Logistics tracking", "Shipment events from a carrier. Left disabled until an account and a data map exist."],
  ["maps", "Google Maps embed", "The contact page uses a link today. An embed is shown only when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL is set to a real map URL."],
  ["sms", "SMS notifications", "Text messages for enquiry updates. Left disabled until a DLT-compliant sender is approved."],
  ["whatsapp", "WhatsApp Business", "WhatsApp notifications. Left disabled until a WhatsApp Business API account is approved."],
  ["accounting", "Accounting software", "Export or sync of commercial records. Not connected. The platform does not post journals."],
  ["iot", "Agricultural IoT", "Sensor readings from fields or stores. Not connected. No device credentials are stored."],
  ["weather", "Weather API", "Forecasts for farm planning. Not connected. The site does not show a live forecast."],
  ["erp", "ERP", "A later exchange with an external ERP. Not connected."],
];
