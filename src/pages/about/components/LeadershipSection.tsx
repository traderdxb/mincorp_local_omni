import React from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { downloadVcfFile } from '@/lib/vcf';

const defaultLeaders = [
  {
    name: 'Ahmed Al-Mansoori',
    role: 'Founder & CEO',
    email: 'a.mansoori@mincorptrade.com',
    phone: '+971 4 292 5900',
    bio: 'Over 25 years in commodity trading across the Middle East and South Asia. Founded MinCorp in 2008 with a vision of transparent, relationship-driven trade.',
  },
  {
    name: 'Priya Venkatesh',
    role: 'Managing Director, Asia-Pacific',
    email: 'p.venkatesh@mincorptrade.com',
    phone: '+971 4 292 5901',
    bio: 'Former VP at a leading Indian steel conglomerate. Brings deep sourcing networks across iron ore, coal, and agricultural commodities.',
  },
  {
    name: 'David Okafor',
    role: 'Director, Africa Operations',
    email: 'd.okafor@mincorptrade.com',
    phone: '+971 4 292 5902',
    bio: '15+ years managing mineral supply chains from East and West Africa. Specializes in cement raw materials and agricultural exports.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Chief Quality Officer',
    email: 'quality@mincorptrade.com',
    phone: '+971 4 292 5903',
    bio: 'Chemical engineer with 20 years in third-party inspection and QA. Ensures every shipment meets or exceeds contractual specifications.',
  },
];

const DEFAULT_PORTRAITS = [
  'https://readdy.ai/api/search-image?query=Professional%20middle%20eastern%20male%20business%20executive%20in%20dark%20navy%20suit%20with%20warm%20confident%20expression%20against%20deep%20teal%20abstract%20gradient%20background%2C%20corporate%20portrait%20photography%2C%20soft%20studio%20lighting%2C%20clean%20minimal%20composition%2C%20polished%20and%20trustworthy%20aesthetic&width=400&height=500&seq=mincorp-leader-ceo&orientation=portrait',
  'https://readdy.ai/api/search-image?query=Professional%20east%20asian%20female%20business%20executive%20in%20tailored%20navy%20blazer%20with%20confident%20warm%20smile%20against%20deep%20teal%20abstract%20gradient%20background%2C%20corporate%20portrait%20photography%2C%20soft%20studio%20lighting%2C%20clean%20minimal%20composition%2C%20polished%20aesthetic&width=400&height=500&seq=mincorp-leader-apac&orientation=portrait',
  'https://readdy.ai/api/search-image?query=Professional%20african%20male%20business%20executive%20in%20charcoal%20gray%20suit%20with%20warm%20trustworthy%20expression%20against%20deep%20teal%20abstract%20gradient%20background%2C%20corporate%20portrait%20photography%2C%20soft%20studio%20lighting%2C%20clean%20minimal%20composition%2C%20polished%20aesthetic&width=400&height=500&seq=mincorp-leader-africa&orientation=portrait',
  'https://readdy.ai/api/search-image?query=Professional%20hispanic%20female%20business%20executive%20in%20navy%20blazer%20with%20warm%20confident%20expression%20against%20deep%20teal%20abstract%20gradient%20background%2C%20corporate%20portrait%20photography%2C%20soft%20studio%20lighting%2C%20clean%20minimal%20composition%2C%20polished%20aesthetic&width=400&height=500&seq=mincorp-leader-qa&orientation=portrait',
];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function LeadershipSection() {
  const { content } = useSiteContent('about_leadership');

  const heading = getVal(content, 'about_leadership', 'heading', 'Leadership');
  const description = getVal(content, 'about_leadership', 'description', 'Our leadership team brings decades of combined experience across commodities, logistics, and quality assurance.');

  const leaders = [0, 1, 2, 3].map((i) => {
    const rawName = getVal(content, 'about_leadership', `leader_${i}_name`, defaultLeaders[i].name);
    const role = getVal(content, 'about_leadership', `leader_${i}_role`, defaultLeaders[i].role);
    const bio = getVal(content, 'about_leadership', `leader_${i}_bio`, defaultLeaders[i].bio);
    const image = getVal(content, 'about_leadership', `portrait_${i}`, DEFAULT_PORTRAITS[i]);
    const email = defaultLeaders[i].email;
    const phone = defaultLeaders[i].phone;

    return {
      name: rawName,
      role,
      bio,
      image,
      email,
      phone,
    };
  });

  const handleDownloadLeaderVcf = (leader: typeof leaders[0]) => {
    const nameParts = leader.name.split(' ');
    const firstName = nameParts[0] || 'Leader';
    const lastName = nameParts.slice(1).join(' ') || '';

    downloadVcfFile({
      id: `leader-${firstName}`,
      firstName,
      lastName,
      organization: 'MinCorp Trading LLC',
      title: leader.role,
      email: leader.email,
      workPhone: leader.phone,
      bio: leader.bio,
      photoUrl: leader.image,
      address: '#304 Technic Building, Salah Al Din Road, Deira',
      city: 'Dubai',
      country: 'United Arab Emirates',
      website: 'https://mincorptrade.com',
    });
  };

  return (
    <section className="bg-background-50 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">{heading}</h2>
          <p className="mt-4 text-foreground-600 text-[15px] leading-[26px] max-w-xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {leaders.map((leader) => (
            <div key={leader.name} className="bg-background-100 rounded-lg overflow-hidden text-center flex flex-col justify-between border border-background-200 hover:border-primary-300 transition-all">
              <div>
                <div className="aspect-[4/5] bg-background-200 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-primary-500 text-[16px]">{leader.name}</h3>
                  <p className="text-[13px] text-accent-600 font-medium mt-1">{leader.role}</p>
                  <p className="text-[13px] text-foreground-600 mt-3 leading-[21px]">{leader.bio}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleDownloadLeaderVcf(leader)}
                  className="w-full bg-background-50 hover:bg-primary-500 hover:text-background-50 text-foreground-700 border border-background-300 hover:border-primary-500 text-xs font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <i className="ri-contacts-book-2-line text-sm"></i>
                  Save Contact (.vcf)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
