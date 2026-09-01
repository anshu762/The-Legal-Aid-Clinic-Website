export const DLSA_DIRECTORY: Record<string, { office: string, phone: string, website: string }> = {
  "Andhra Pradesh": { office: "Andhra Pradesh State Legal Services Authority, Amaravati", phone: "1800-425-4433", website: "https://apslsa.ap.nic.in" },
  "Delhi": { office: "Delhi State Legal Services Authority, Patiala House Courts", phone: "1516", website: "http://dslsa.org" },
  "Karnataka": { office: "Karnataka State Legal Services Authority, Bengaluru", phone: "1800-425-9090", website: "https://kslsa.kar.nic.in" },
  "Maharashtra": { office: "Maharashtra State Legal Services Authority, Mumbai", phone: "1800-22-2056", website: "https://legalservices.maharashtra.gov.in" },
  "Tamil Nadu": { office: "Tamil Nadu State Legal Services Authority, Chennai", phone: "1800-425-2441", website: "https://tnlegalservices.tn.gov.in" },
  "Uttar Pradesh": { office: "UP State Legal Services Authority, Lucknow", phone: "1800-419-0234", website: "https://upslsa.up.nic.in" },
};

export const STATES = Object.keys(DLSA_DIRECTORY).sort();
