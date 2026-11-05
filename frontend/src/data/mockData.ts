import type { ResearchQueryItem, HistorySession, AppSettings } from '../types';

export const initialSettings: AppSettings = {
  verificationThreshold: 'strict',
  evidenceSourceFilter: 'all',
  displayFootnotes: true,
  highlightContradictions: true,
  uiTheme: 'system',
};

export const sampleQueries: ResearchQueryItem[] = [
  {
    id: 'query-malaria-r21',
    query: 'What is the verified clinical efficacy, WHO prequalification status, and deployment outlook for the R21/Matrix-M malaria vaccine?',
    timestamp: '2026-11-05T18:30:00Z',
    domainCategory: 'Global Health & Immunology',
    summary:
      'The R21/Matrix-M vaccine has demonstrated 75% to 78% 12-month efficacy in Phase 3 trials and is WHO-prequalified. However, claims that it will entirely eradicate malaria transmission by 2030 are contradicted by epidemiological models, while multi-year longevity without booster regimens currently lacks sufficient evidence.',
    paragraphs: [
      {
        id: 'p1',
        text: 'The R21/Matrix-M malaria vaccine demonstrated 75% to 78% efficacy over 12 months among children aged 5–36 months in Phase 3 multi-center trials across Burkina Faso, Mali, and Kenya.',
        claimIds: ['claim-1'],
      },
      {
        id: 'p2',
        text: 'Following rigorous technical review, the World Health Organization officially granted prequalification to R21/Matrix-M in December 2023, making it the second approved malaria vaccine alongside RTS,S/AS01.',
        claimIds: ['claim-2'],
      },
      {
        id: 'p3',
        text: 'Public health analyses indicate that manufacturing partnerships with the Serum Institute of India will likely reduce single-dose delivery costs below $4 per injection at scale.',
        claimIds: ['claim-3'],
      },
      {
        id: 'p4',
        text: 'Certain media assertions that rolling out R21 will entirely eradicate malaria transmission throughout Sub-Saharan Africa within five years are directly contradicted by epidemiological modeling, which demonstrates that vaccines serve as a complementary mitigation layer alongside vector control and artemisinin-based therapies.',
        claimIds: ['claim-4'],
      },
      {
        id: 'p5',
        text: 'Current empirical literature provides insufficient longitudinal evidence regarding whether protective antibody titers persist beyond 48 months without subsequent booster immunizations.',
        claimIds: ['claim-5'],
      },
    ],
    claims: [
      {
        id: 'claim-1',
        claimNumber: 1,
        text: 'R21/Matrix-M demonstrated 75%–78% efficacy over 12 months in multi-center Phase 3 pediatric trials.',
        status: 'supported',
        mockConfidence: 96,
        verdictExplanation:
          'Directly corroborated by published peer-reviewed Phase 3 trial data in The Lancet (Datoo et al.) and confirmed by WHO Strategic Advisory Group of Experts (SAGE).',
        evidenceIds: ['ev-lancet-1', 'ev-who-1'],
        excerptHighlight: 'Vaccine efficacy was 75% (95% CI 71–79) over 12 months at seasonal transmission sites.',
      },
      {
        id: 'claim-2',
        claimNumber: 2,
        text: 'The WHO granted prequalification to R21/Matrix-M in December 2023 as the second approved malaria vaccine.',
        status: 'supported',
        mockConfidence: 98,
        verdictExplanation:
          'Directly documented in official WHO regulatory releases and public health bulletins.',
        evidenceIds: ['ev-who-1', 'ev-cdc-1'],
        excerptHighlight: 'The World Health Organization (WHO) has added the R21/Matrix-M malaria vaccine to its list of prequalified vaccines.',
      },
      {
        id: 'claim-3',
        claimNumber: 3,
        text: 'Manufacturing agreements with Serum Institute of India will bring unit costs below $4 per dose.',
        status: 'inferred',
        mockConfidence: 82,
        verdictExplanation:
          'Inferred from procurement commitments and bilateral supply agreement benchmarks published by Gavi, although final tender prices vary by national subsidized distribution agreements.',
        evidenceIds: ['ev-gavi-1'],
        excerptHighlight: 'SII has established production capacity exceeding 100 million doses annually with contracted ceiling pricing targeting low-resource procurement tiers.',
      },
      {
        id: 'claim-4',
        claimNumber: 4,
        text: 'R21 deployment will achieve total malaria eradication across Sub-Saharan Africa by 2030.',
        status: 'contradicted',
        mockConfidence: 94,
        verdictExplanation:
          'Contradicted by WHO malaria eradication roadmaps and epidemiological models showing vaccines reduce severe pediatric mortality but do not halt transmission without comprehensive vector eradication.',
        evidenceIds: ['ev-who-report-1', 'ev-lancet-1'],
        excerptHighlight: 'Malaria vaccines represent an indispensable intervention to reduce childhood morbidity, but cannot independently eliminate transmission without continuous vector management.',
      },
      {
        id: 'claim-5',
        claimNumber: 5,
        text: 'Protective immunity persists beyond 4 years without subsequent booster immunizations.',
        status: 'insufficient',
        mockConfidence: 45,
        verdictExplanation:
          'Published follow-up datasets currently monitor cohorts through 24 to 36 months; conclusive 5-year longitudinal durability data has not yet completed peer-reviewed publication.',
        evidenceIds: ['ev-lancet-1'],
        excerptHighlight: 'Extended surveillance of trial cohorts is currently ongoing to evaluate booster interval requirements beyond year three.',
      },
    ],
    evidence: [
      {
        id: 'ev-lancet-1',
        title: 'Safety and efficacy of malaria vaccine candidate R21/Matrix-M in African children: a multicentre, double-blind, randomised, phase 3 trial',
        url: 'https://doi.org/10.1016/S0140-6736(23)02511-4',
        domain: 'thelancet.com',
        authors: 'Datoo, M. S., Natama, H. M., et al.',
        publicationDate: 'February 2024',
        excerpt:
          'In children aged 5–36 months, vaccine efficacy against clinical malaria was 75% (95% CI 71–79) at seasonal sites and 68% (95% CI 61–74) at standard sites over 12 months.',
        relevanceScore: 0.96,
        badgeType: 'Primary Source',
      },
      {
        id: 'ev-who-1',
        title: 'WHO prequalifies second malaria vaccine (R21/Matrix-M) to prevent malaria in children',
        url: 'https://www.who.int/news/item/21-12-2023-who-prequalifies-second-malaria-vaccine',
        domain: 'who.int',
        authors: 'World Health Organization Communications',
        publicationDate: 'December 21, 2023',
        excerpt:
          'The prequalification means larger access to vaccines as a key tool to prevent malaria in children with supply guaranteed by the Serum Institute of India.',
        relevanceScore: 0.94,
        badgeType: 'Primary Source',
      },
      {
        id: 'ev-who-report-1',
        title: 'Strategic Advisory Group of Experts (SAGE) on Immunization: Evaluation of Malaria Eradication Feasibility',
        url: 'https://www.who.int/publications/i/item/9789240011502',
        domain: 'who.int',
        authors: 'WHO Department of Immunization, Vaccines and Biologicals',
        publicationDate: 'October 2023',
        excerpt:
          'Models demonstrate that while immunization dramatically lowers severe pediatric malaria and mortality by over 70%, elimination of transmission requires sustained vector control and chemical prophylaxis.',
        relevanceScore: 0.89,
        badgeType: 'Refuting Source',
      },
      {
        id: 'ev-gavi-1',
        title: 'Market Shaping and Supply Security for Second-Generation Malaria Vaccines',
        url: 'https://www.gavi.org/our-alliance/market-shaping/malaria-vaccine-investment',
        domain: 'gavi.org',
        authors: 'Gavi Vaccine Alliance Technical Secretariat',
        publicationDate: 'May 2024',
        excerpt:
          'Procurement agreements with manufacturer SII project sustained supply at price targets under $4 per dose for Gavi-eligible lower-income health systems.',
        relevanceScore: 0.86,
        badgeType: 'Corroborating Source',
      },
      {
        id: 'ev-cdc-1',
        title: 'Malaria Vaccines: Guidance and Technical Background for Clinicians',
        url: 'https://www.cdc.gov/malaria/vaccines/index.html',
        domain: 'cdc.gov',
        authors: 'U.S. Centers for Disease Control and Prevention',
        publicationDate: 'January 2024',
        excerpt:
          'R21/Matrix-M and RTS,S both target the circumsporozoite protein of Plasmodium falciparum, significantly enhancing pediatric disease prevention when administered prior to peak transmission.',
        relevanceScore: 0.82,
        badgeType: 'Contextual Source',
      },
    ],
    mockConfidenceScore: 88,
    groundingMetrics: {
      supported: 2,
      inferred: 1,
      contradicted: 1,
      insufficient: 1,
    },
  },
  {
    id: 'query-moxie-mars',
    query: 'What were the final verified operational milestones achieved by NASA’s MOXIE instrument on Mars?',
    timestamp: '2026-11-04T14:15:00Z',
    domainCategory: 'Aerospace Engineering & Planetary Science',
    summary:
      'NASA’s Mars Oxygen ISRU Experiment (MOXIE) on the Perseverance rover successfully concluded operations in August 2023, generating a total of 122 grams of 98%+ purity breathable oxygen directly from the Martian atmospheric CO2 across all seasonal conditions.',
    paragraphs: [
      {
        id: 'm1',
        text: 'The MOXIE payload aboard NASA’s Perseverance rover concluded its 16th and final oxygen extraction run on August 7, 2023, surpassing NASA’s initial operational requirements.',
        claimIds: ['m-claim-1'],
      },
      {
        id: 'm2',
        text: 'Across all operations, MOXIE generated a cumulative total of 122 grams of oxygen with measured purity greater than 98%, producing at rates up to 12 grams per hour.',
        claimIds: ['m-claim-2'],
      },
      {
        id: 'm3',
        text: 'The solid oxide electrolysis cells successfully operated under extreme Martian nighttime winter conditions where atmospheric density fluctuates significantly.',
        claimIds: ['m-claim-3'],
      },
    ],
    claims: [
      {
        id: 'm-claim-1',
        claimNumber: 1,
        text: 'MOXIE completed 16 successful extraction runs on Mars, concluding operations in August 2023.',
        status: 'supported',
        mockConfidence: 99,
        verdictExplanation: 'Confirmed by NASA Jet Propulsion Laboratory mission status logs and press release.',
        evidenceIds: ['ev-jpl-1'],
        excerptHighlight: 'On Aug. 7, MOXIE made oxygen for the 16th and final time.',
      },
      {
        id: 'm-claim-2',
        claimNumber: 2,
        text: 'Total oxygen generated was 122 grams with >98% purity, peaking at 12 grams/hour.',
        status: 'supported',
        mockConfidence: 97,
        verdictExplanation: 'Published in Science Advances by the MIT instrument investigation team.',
        evidenceIds: ['ev-sciadv-1'],
        excerptHighlight: 'MOXIE produced a total of 122 grams of oxygen — about what a small dog breathes in 10 hours.',
      },
      {
        id: 'm-claim-3',
        claimNumber: 3,
        text: 'A scaled-up version will autonomously fuel the Mars Ascent Vehicle for the planned 2033 crew return.',
        status: 'inferred',
        mockConfidence: 71,
        verdictExplanation: 'Architecture study from NASA Marshall Space Flight Center, but architecture remains conceptual.',
        evidenceIds: ['ev-nasa-arch-1'],
        excerptHighlight: 'ISRU scale-up plans outline a 25 to 30 kilowatt continuous system for future crewed return architectures.',
      },
    ],
    evidence: [
      {
        id: 'ev-jpl-1',
        title: 'NASA’s Oxygen-Generating Experiment on Mars Completes Successful Mission',
        url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-on-mars-completes-mission',
        domain: 'jpl.nasa.gov',
        authors: 'NASA Jet Propulsion Laboratory',
        publicationDate: 'September 7, 2023',
        excerpt:
          'Since Perseverance touched down in 2021, MOXIE generated a total of 122 grams of oxygen, proving that in-situ resource utilization is viable for future human explorers.',
        relevanceScore: 0.97,
        badgeType: 'Primary Source',
      },
      {
        id: 'ev-sciadv-1',
        title: 'Mars Oxygen ISRU Experiment (MOXIE)—Preparing for human exploration of Mars',
        url: 'https://doi.org/10.1126/sciadv.abp8936',
        domain: 'science.org',
        authors: 'Hecht, M., Hoffman, J., et al. (MIT / JPL)',
        publicationDate: 'August 2022',
        excerpt:
          'MOXIE operates by drawing in atmospheric carbon dioxide, compressing and heating it to 800°C, and using solid oxide electrolysis to split CO2 into oxygen ions and carbon monoxide.',
        relevanceScore: 0.94,
        badgeType: 'Primary Source',
      },
      {
        id: 'ev-nasa-arch-1',
        title: 'Human Mars Mission ISRU Architecture Study',
        url: 'https://ntrs.nasa.gov/citations/20230008412',
        domain: 'nasa.gov',
        authors: 'NASA Exploration Systems Development Directorate',
        publicationDate: 'November 2023',
        excerpt:
          'Full-scale oxygen production would necessitate a 25 kW to 30 kW continuous power supply to liquefy and store 25 to 30 metric tons of liquid oxygen.',
        relevanceScore: 0.84,
        badgeType: 'Corroborating Source',
      },
    ],
    mockConfidenceScore: 92,
    groundingMetrics: {
      supported: 2,
      inferred: 1,
      contradicted: 0,
      insufficient: 0,
    },
  },
];

export const mockHistorySessions: HistorySession[] = [
  {
    id: 'session-1',
    title: 'R21 Malaria Vaccine Efficacy & Approval',
    preview: 'Phase 3 trials demonstrated 75%–78% efficacy; WHO prequalified in Dec 2023.',
    timeAgo: '15m ago',
    group: 'Today',
    confidenceLabel: '88% Grounded',
    claimsCount: 5,
    queryId: 'query-malaria-r21',
  },
  {
    id: 'session-2',
    title: 'NASA MOXIE Mars Oxygen Extraction',
    preview: 'Final mission milestones: 122g of >98% pure oxygen generated across 16 runs.',
    timeAgo: '3h ago',
    group: 'Today',
    confidenceLabel: '92% Grounded',
    claimsCount: 3,
    queryId: 'query-moxie-mars',
  },
  {
    id: 'session-3',
    title: 'LK-99 Replication Studies Verdict',
    preview: 'Global synthesis trials concluded ferromagnetism and Cu2S phase transition.',
    timeAgo: 'Yesterday',
    group: 'Yesterday',
    confidenceLabel: '96% Refuted',
    claimsCount: 6,
    queryId: 'query-malaria-r21', // maps to mock set
  },
  {
    id: 'session-4',
    title: 'Microplastics Detected in Human Placentas',
    preview: 'FTIR microscopy identified polymer particles in maternal and fetal tissue.',
    timeAgo: '2 days ago',
    group: 'Previous 7 Days',
    confidenceLabel: '91% Grounded',
    claimsCount: 4,
    queryId: 'query-malaria-r21',
  },
  {
    id: 'session-5',
    title: 'Solid-State Battery Dendrite Suppression',
    preview: 'LLZO ceramic electrolytes vs sulfide separators in lithium metal anodes.',
    timeAgo: '5 days ago',
    group: 'Previous 7 Days',
    confidenceLabel: '84% Grounded',
    claimsCount: 5,
    queryId: 'query-moxie-mars',
  },
];

export const suggestedPrompts = [
  'What is the verified clinical efficacy of the R21 malaria vaccine?',
  'What were the final achievements of NASA’s MOXIE oxygen experiment on Mars?',
  'Did independent laboratories replicate room-temperature superconductivity in LK-99?',
  'What are the confirmed health impacts of dietary microplastic ingestion?',
];
