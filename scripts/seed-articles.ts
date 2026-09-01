import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articles = [
  {
    title: "NALSA Free Legal Services Scheme",
    slug: "nalsa-free-legal-services",
    category: "NALSA/DLSA Schemes",
    language: "English",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## Overview of NALSA Free Legal Services
The National Legal Services Authority (NALSA) provides free legal services to the weaker sections of society to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.

### Who is Eligible?
- Women and children
- Members of SC/ST
- Industrial workmen
- Victims of mass disaster, violence, flood, drought, earthquake, or industrial disaster
- Disabled persons
- Persons in custody
- Persons whose annual income does not exceed Rs. 1,00,000 (Rs. 5,00,000 for Supreme Court Legal Services Committee).

### Services Offered
- Payment of court fees, process fees, and all other charges payable or incurred in connection with any legal proceedings.
- Providing service of lawyers in legal proceedings.
- Obtaining and supply of certified copies of orders and other documents in legal proceedings.
- Preparation of appeal, paper book including printing and translation of documents in legal proceedings.`
  },
  {
    title: "Understanding Domestic Violence Laws (PWDVA)",
    slug: "domestic-violence-laws",
    category: "Family Law",
    language: "English",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## Protection of Women from Domestic Violence Act (2005)
The PWDVA provides protection to women from physical, emotional, sexual, and economic abuse within a domestic relationship.

### Your Rights
1. **Right to Reside:** You have the right to reside in the shared household, regardless of whether you have any legal title to it.
2. **Protection Orders:** You can obtain orders preventing the abuser from committing further acts of violence, contacting you, or alienating assets.
3. **Monetary Relief:** You can claim maintenance for yourself and your children, as well as compensation for any damages or injuries.
4. **Custody Orders:** Temporary custody of children can be granted to the aggrieved woman to prevent the abuser from taking them away.

### Steps to Take
If you are facing domestic violence, immediately contact the nearest Police Station (100) or Women's Helpline (1091). You can also approach a Protection Officer appointed by the State Government or consult with a legal aid clinic.`
  },
  {
    title: "कार्यस्थल पर यौन उत्पीड़न (POSH)",
    slug: "posh-act-hindi",
    category: "Civil Rights",
    language: "Hindi",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## कार्यस्थल पर महिलाओं का यौन उत्पीड़न (रोकथाम, निषेध और निवारण) अधिनियम, 2013

यह अधिनियम (POSH Act) कार्यस्थल पर महिलाओं को यौन उत्पीड़न से बचाता है।

### यौन उत्पीड़न क्या है?
- अवांछित शारीरिक संपर्क
- यौन अनुग्रह की मांग या अनुरोध
- अश्लील टिप्पणियां
- अश्लील सामग्री दिखाना
- कोई अन्य अवांछित शारीरिक, मौखिक या गैर-मौखिक आचरण

### आपकी सुरक्षा
प्रत्येक संगठन (जिसमें 10 या अधिक कर्मचारी हों) को एक **आंतरिक शिकायत समिति (ICC)** का गठन करना अनिवार्य है। आप इस समिति में अपनी शिकायत दर्ज करा सकते हैं। समिति को 90 दिनों के भीतर जांच पूरी करनी होगी।

यदि आपकी शिकायत सही पाई जाती है, तो समिति नियोक्ता को कार्रवाई करने का निर्देश दे सकती है, जिसमें स्थानांतरण, वेतन वृद्धि रोकना, या समाप्ति शामिल हो सकती है।`
  },
  {
    title: "Rights of an Arrested Person",
    slug: "rights-of-arrested-person",
    category: "Criminal Defense",
    language: "English",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## Fundamental Rights During Arrest
The Indian Constitution and the Code of Criminal Procedure (CrPC) provide several safeguards to a person who is arrested.

### Key Rights
- **Right to know the grounds of arrest:** The police officer must inform you of the specific offense for which you are being arrested.
- **Right to inform a relative or friend:** You have the right to have a person of your choice informed about your arrest and the place where you are being held.
- **Right to a lawyer:** You have the right to consult and be defended by a legal practitioner of your choice during interrogation.
- **Right to be produced before a Magistrate:** You must be produced before a Magistrate within 24 hours of your arrest (excluding travel time).
- **Right to medical examination:** You can request a medical examination by a qualified doctor to record any injuries.
- **Right to free legal aid:** If you cannot afford a lawyer, the state must provide you with free legal aid.`
  },
  {
    title: "DLSA லோக் அதாலத் (Lok Adalat)",
    slug: "lok-adalat-tamil",
    category: "NALSA/DLSA Schemes",
    language: "Tamil",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## லோக் அதாலத் (மக்கள் நீதிமன்றம்)

லோக் அதாலத் என்பது மாற்று தகராறு தீர்வு முறைகளில் ஒன்றாகும், அங்கு நீதிமன்றங்களில் நிலுவையில் உள்ள வழக்குகள் அல்லது வழக்குக்கு முந்தைய நிலையில் உள்ள தகராறுகள் சமரசமாகத் தீர்க்கப்படுகின்றன.

### நன்மைகள்
- **கட்டணம் இல்லை:** லோக் அதாலத்தில் வழக்குகளைத் தாக்கல் செய்ய எந்த நீதிமன்றக் கட்டணமும் இல்லை. ஏற்கனவே நீதிமன்றத்தில் நிலுவையில் உள்ள வழக்கிற்கு, நீதிமன்றக் கட்டணம் திரும்பப் பெறப்படும்.
- **விரைவான தீர்வு:** கடுமையான நடைமுறைகள் இல்லாததால் வழக்குகள் விரைவாகத் தீர்க்கப்படுகின்றன.
- **இறுதி முடிவு:** லோக் அதாலத் வழங்கும் தீர்ப்பு இறுதியானது மற்றும் அனைத்து தரப்பினரையும் கட்டுப்படுத்தும். இதற்கு எதிராக எந்த மேல்முறையீடும் செய்ய முடியாது.
- **சமரசம்:** இரு தரப்பினரும் பேசி ஒரு சுமூகமான முடிவுக்கு வர இது ஒரு நல்ல வாய்ப்பாகும்.

சிவில் வழக்குகள், குடும்பத் தகராறுகள், காசோலை மோசடி வழக்குகள் மற்றும் மோட்டார் வாகன விபத்து வழக்குகள் போன்றவற்றை இங்கு தீர்க்கலாம்.`
  },
  {
    title: "Filing a Zero FIR",
    slug: "zero-fir",
    category: "Criminal Defense",
    language: "English",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## What is a Zero FIR?
A Zero FIR refers to a First Information Report (FIR) that is registered irrespective of the jurisdiction in which the offense occurred. 

### Why is it important?
Normally, an FIR is registered at the police station under whose jurisdiction the crime took place. However, in cases of severe crimes (like murder, rape, etc.), a delay in filing can lead to loss of evidence. A Zero FIR ensures immediate action.

### How it works
1. You can walk into *any* police station to report a cognizable offense.
2. The police officer is legally obligated to record the FIR, which is numbered as 'Zero'.
3. The police station then transfers the Zero FIR to the police station that has the actual jurisdiction to investigate the case.

**Remember:** A police officer cannot refuse to lodge a Zero FIR citing territorial jurisdiction.`
  },
  {
    title: "Property Inheritance Laws (Hindu Succession Act)",
    slug: "hindu-succession-act",
    category: "Property Law",
    language: "English",
    isActive: true,
    publishedAt: new Date(),
    bodyMarkdown: `## Equal Rights for Daughters
The Hindu Succession (Amendment) Act, 2005 brought a significant change by giving daughters equal rights in ancestral property.

### Key Provisions
- Daughters, whether married or unmarried, are considered coparceners (joint legal heirs) in a Hindu Undivided Family (HUF) property, just like sons.
- A daughter has the same rights and liabilities in the coparcenary property as she would have if she had been a son.
- This right is by birth.
- The amendment applies even if the father died before the 2005 amendment, provided the property wasn't already partitioned before December 20, 2004 (as per a recent Supreme Court clarification).

If you are denied your rightful share in ancestral property, you can file a partition suit in a civil court.`
  }
];

async function seed() {
  console.log("Seeding articles...");
  for (const article of articles) {
    await prisma.knowYourRightsArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }
  console.log(`Seeded ${articles.length} articles.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
