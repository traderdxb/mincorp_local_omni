import { Link } from 'react-router-dom';

type LogoProps = {
  variant?: 'dark' | 'light';
  showTagline?: boolean;
};

export default function Logo({ variant = 'dark', showTagline = true }: LogoProps) {
  const isDark = variant === 'dark';
  const subText = isDark ? 'text-foreground-600' : 'text-background-200';

  return (
    <Link to="/" className="inline-flex items-center gap-3 group cursor-pointer">
      <img
        src="https://storage.readdy-site.link/project_files/bf38076e-e26d-4afd-8788-1cfbbe9fe48f/9289016f-5f9e-4612-96c5-58c7e566edaf_compressed_micorp-logo-sample-1.webp"
        alt="MinCorp Trading"
        className="h-10 w-auto object-contain"
      />
      {showTagline && (
        <span className={`text-[10px] font-normal tracking-[0.18em] uppercase mt-1 ${subText}`}>
          Trading LLC
        </span>
      )}
    </Link>
  );
}