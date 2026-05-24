import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  FlaskConical,
  Hash,
  Rocket,
  Shirt,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  hash: Hash,
  rocket: Rocket,
  shirt: Shirt,
  calendar: Calendar,
  users: Users,
  flask: FlaskConical,
  trending: TrendingUp,
  star: Star,
};

export function FounderBenefitIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? Star;
  return <Icon size={20} strokeWidth={1.75} style={{ color: 'var(--founder-teal)' }} />;
}
