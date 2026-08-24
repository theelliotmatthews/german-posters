import React from 'react';
import {
  User,
  Users,
  Baby,
  Home,
  Building,
  Building2,
  Landmark,
  Hotel,
  Dog,
  Cat,
  Bird,
  Fish,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Cloud,
  Waves,
  Trees,
  TreePine,
  Mountain,
  Snowflake,
  Wind,
  Zap,
  Apple,
  Banana,
  Citrus,
  Utensils,
  Coffee,
  Wine,
  Beer,
  Milk,
  Soup,
  Egg,
  Cake,
  Sandwich,
  Cookie,
  Pizza,
  CupSoda,
  Book,
  BookOpen,
  Calendar,
  Clock,
  Key,
  Lock,
  Unlock,
  Phone,
  Smartphone,
  Wifi,
  Battery,
  Plug,
  Tv,
  Radio,
  Camera,
  Music,
  Headphones,
  Guitar,
  Car,
  Train,
  Bus,
  Plane,
  Bike,
  Luggage,
  Navigation,
  Map,
  Compass,
  MapPin,
  Ticket,
  Shirt,
  Footprints,
  Eye,
  Ear,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Thermometer,
  Shield,
  Award,
  Sparkles,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  Hammer,
  Wrench,
  Settings,
  Search,
  Package,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Coins,
  Banknote,
  Receipt,
  FileText,
  Folder,
  Bed,
  Armchair,
  Bath,
  Lamp,
  Maximize2,
  LayoutGrid,
  Grid,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  RefreshCw,
  Layers,
  Flag,
  MessageSquare,
  Send,
  Bell,
  Scale,
  Sparkle,
  Sliders,
  Flame,
  Volume2,
} from 'lucide-react';
import { Gender, CardType } from '../types';

interface PictogramIconProps {
  name?: string;
  german?: string;
  gender?: Gender;
  type?: CardType;
  className?: string;
  size?: number;
  showBadge?: boolean;
}

// Swatch color mapping for colour cards
const SWATCH_COLORS: Record<string, string> = {
  'red swatch': '#C41E3A',
  'red': '#C41E3A',
  'blue swatch': '#1B4B8A',
  'blue': '#1B4B8A',
  'dark blue swatch': '#0F2C59',
  'light blue swatch': '#6BA4D9',
  'green swatch': '#2D6A4F',
  'green': '#2D6A4F',
  'yellow swatch': '#E5B800',
  'gelb': '#E5B800',
  'orange swatch': '#E86A17',
  'orange': '#E86A17',
  'pink swatch': '#D94678',
  'rosa': '#D94678',
  'purple swatch': '#6B4C9A',
  'lila': '#6B4C9A',
  'brown swatch': '#7A4B26',
  'braun': '#7A4B26',
  'black swatch': '#1A1A1A',
  'schwarz': '#1A1A1A',
  'grey swatch': '#7D7A75',
  'grau': '#7D7A75',
  'white swatch with thin rule': '#FFFFFF',
  'weiss': '#FFFFFF',
};

export const PictogramIcon: React.FC<PictogramIconProps> = ({
  name = '',
  german = '',
  gender = null,
  type,
  className = '',
  size = 28,
  showBadge = true,
}) => {
  const norm = (name || '').toLowerCase().trim();
  const normGer = (german || '').toLowerCase().trim();

  // Check if it's a color swatch
  const swatchKey = Object.keys(SWATCH_COLORS).find(
    (k) => norm.includes(k) || normGer.includes(k)
  );
  if (swatchKey) {
    const hex = SWATCH_COLORS[swatchKey];
    return (
      <div
        className={`inline-flex items-center justify-center p-2 rounded-xl border-2 border-ink bg-cream-50 shadow-sm ${className}`}
        title={name || german}
      >
        <div
          className="w-7 h-7 rounded-lg border border-ink/30 shadow-inner"
          style={{ backgroundColor: hex }}
        />
      </div>
    );
  }

  // Choose icon component
  const getIconComponent = () => {
    // 1. Specific pictogram names
    if (norm.includes('man') || norm.includes('standing figure') || norm.includes('rising figure') || norm.includes('runner')) {
      if (norm.includes('two') || norm.includes('figures')) return Users;
      return User;
    }
    if (norm.includes('woman') || norm.includes('standing figure with skirt')) return User;
    if (norm.includes('child') || norm.includes('small figure') || norm.includes('baby')) return Baby;
    if (norm.includes('holding hands')) return Users;
    if (norm.includes('dog')) return Dog;
    if (norm.includes('cat')) return Cat;
    if (norm.includes('bird')) return Bird;
    if (norm.includes('fish')) return Fish;
    if (norm.includes('bear') || norm.includes('horse') || norm.includes('cow') || norm.includes('pig') || norm.includes('mouse')) return Activity;

    // Food & Drink
    if (norm.includes('apple')) return Apple;
    if (norm.includes('banana')) return Banana;
    if (norm.includes('orange') || norm.includes('citrus')) return Citrus;
    if (norm.includes('coffee') || norm.includes('cup') || norm.includes('tea')) return Coffee;
    if (norm.includes('beer') || norm.includes('bier')) return Beer;
    if (norm.includes('wine') || norm.includes('wein')) return Wine;
    if (norm.includes('water glass') || norm.includes('glass') || norm.includes('juice')) return CupSoda;
    if (norm.includes('milk')) return Milk;
    if (norm.includes('bread') || norm.includes('brot') || norm.includes('pretzel')) return Sandwich;
    if (norm.includes('egg') || norm.includes('ei')) return Egg;
    if (norm.includes('cake') || norm.includes('kuchen')) return Cake;
    if (norm.includes('chocolate') || norm.includes('schokolade') || norm.includes('cheese') || norm.includes('butter')) return Cookie;
    if (norm.includes('soup') || norm.includes('rice') || norm.includes('salad') || norm.includes('dessert') || norm.includes('bowl')) return Soup;
    if (norm.includes('meat') || norm.includes('chicken') || norm.includes('sausage')) return Pizza;
    if (norm.includes('ice cream')) return Cookie;
    if (norm.includes('fork and knife') || norm.includes('fork') || norm.includes('restaurant') || norm.includes('main plate') || norm.includes('starter') || norm.includes('plate')) return Utensils;

    // Home, Objects & City
    if (norm.includes('table') || norm.includes('desk')) return LayoutGrid;
    if (norm.includes('chair') || norm.includes('sofa') || norm.includes('armchair')) return Armchair;
    if (norm.includes('bed')) return Bed;
    if (norm.includes('bath') || norm.includes('shower') || norm.includes('washbasin')) return Bath;
    if (norm.includes('lamp') || norm.includes('light')) return Lamp;
    if (norm.includes('door')) return Building;
    if (norm.includes('window')) return Maximize2;
    if (norm.includes('room') || norm.includes('corner') || norm.includes('floor plan')) return LayoutGrid;
    if (norm.includes('house') || norm.includes('home') || norm.includes('flat')) return Home;
    if (norm.includes('building') || norm.includes('city') || norm.includes('bank') || norm.includes('hotel') || norm.includes('station')) return Building2;
    if (norm.includes('key')) return Key;
    if (norm.includes('book') || norm.includes('open book') || norm.includes('sheet') || norm.includes('menu')) return BookOpen;
    if (norm.includes('clock') || norm.includes('time') || norm.includes('zeit')) return Clock;
    if (norm.includes('calendar') || norm.includes('date') || norm.includes('year') || norm.includes('datum')) return Calendar;
    if (norm.includes('sun') || norm.includes('day') || norm.includes('tag')) return Sun;
    if (norm.includes('moon') || norm.includes('night') || norm.includes('crescent')) return Moon;
    if (norm.includes('wave') || norm.includes('water') || norm.includes('sea') || norm.includes('lake') || norm.includes('river') || norm.includes('swimmer')) return Waves;
    if (norm.includes('tree') || norm.includes('forest') || norm.includes('wald')) return Trees;
    if (norm.includes('mountain') || norm.includes('berg') || norm.includes('peak')) return Mountain;
    if (norm.includes('flower') || norm.includes('blume')) return Sparkles;

    // Tech & Travel
    if (norm.includes('car') || norm.includes('auto')) return Car;
    if (norm.includes('train') || norm.includes('zug') || norm.includes('platform')) return Train;
    if (norm.includes('bus')) return Bus;
    if (norm.includes('plane') || norm.includes('aeroplane') || norm.includes('airport')) return Plane;
    if (norm.includes('bicycle') || norm.includes('bike') || norm.includes('rad')) return Bike;
    if (norm.includes('bag') || norm.includes('suitcase') || norm.includes('rucksack') || norm.includes('luggage') || norm.includes('trolley')) return Luggage;
    if (norm.includes('ticket') || norm.includes('passport') || norm.includes('id card')) return Ticket;
    if (norm.includes('map') || norm.includes('street') || norm.includes('crossing')) return Map;
    if (norm.includes('phone') || norm.includes('handy') || norm.includes('telephone') || norm.includes('handset')) return Smartphone;
    if (norm.includes('wifi')) return Wifi;
    if (norm.includes('battery') || norm.includes('akku')) return Battery;
    if (norm.includes('plug') || norm.includes('charger')) return Plug;
    if (norm.includes('camera') || norm.includes('photography')) return Camera;
    if (norm.includes('guitar') || norm.includes('music') || norm.includes('radio')) return Music;
    if (norm.includes('television') || norm.includes('tv')) return Tv;
    if (norm.includes('hammer') || norm.includes('work') || norm.includes('arbeit') || norm.includes('tool')) return Hammer;
    if (norm.includes('machine') || norm.includes('cog') || norm.includes('settings')) return Settings;
    if (norm.includes('magnifier') || norm.includes('search')) return Search;

    // Medical & Doctor
    if (norm.includes('cross') || norm.includes('doctor') || norm.includes('hospital') || norm.includes('bed cross')) return Stethoscope;
    if (norm.includes('pill') || norm.includes('mortar')) return Pill;
    if (norm.includes('thermometer') || norm.includes('cough') || norm.includes('nose') || norm.includes('throat')) return Thermometer;

    // Clothes
    if (norm.includes('shirt') || norm.includes('t-shirt') || norm.includes('pullover') || norm.includes('coat') || norm.includes('jacket') || norm.includes('dress') || norm.includes('skirt') || norm.includes('trousers') || norm.includes('belt') || norm.includes('scarf') || norm.includes('hat') || norm.includes('sock') || norm.includes('glove')) return Shirt;
    if (norm.includes('shoe') || norm.includes('footprints')) return Footprints;
    if (norm.includes('glasses')) return Eye;

    // Body
    if (norm.includes('eye')) return Eye;
    if (norm.includes('ear')) return Ear;
    if (norm.includes('head') || norm.includes('belly')) return User;

    // Money & Bureaucracy
    if (norm.includes('coin') || norm.includes('coins') || norm.includes('geld')) return Coins;
    if (norm.includes('card') || norm.includes('karte') || norm.includes('bank')) return CreditCard;
    if (norm.includes('receipt') || norm.includes('quittung') || norm.includes('formular') || norm.includes('note') || norm.includes('pen')) return Receipt;
    if (norm.includes('scale')) return Scale;

    // Symbols & Arrows
    if (norm.includes('speech') || norm.includes('sprache')) return MessageSquare;
    if (norm.includes('party') || norm.includes('mask') || norm.includes('reception bell') || norm.includes('celebration')) return Sparkles;
    if (norm.includes('caution') || norm.includes('triangle')) return AlertTriangle;
    if (norm.includes('check') || norm.includes('tick')) return CheckCircle2;
    if (norm.includes('cross')) return XCircle;
    if (norm.includes('exclamation')) return AlertTriangle;
    if (norm.includes('arrow')) {
      if (norm.includes('left')) return ArrowLeft;
      if (norm.includes('right')) return ArrowRight;
      if (norm.includes('up')) return ArrowUp;
      if (norm.includes('down')) return ArrowDown;
      return ArrowRight;
    }

    // Fallbacks based on card type
    if (type === 'noun') return Package;
    if (type === 'verb') return Zap;
    if (type === 'sentence') return MessageSquare;
    if (type === 'false_friend') return AlertTriangle;
    return Sparkles;
  };

  const IconComp = getIconComponent();

  // Determine color styling based on gender
  let genderColor = 'text-ink';
  let badgeBg = 'bg-cream-200 border-ink/20';

  if (gender === 'masculine') {
    genderColor = 'text-german-der';
    badgeBg = 'bg-german-der/10 border-german-der/30';
  } else if (gender === 'feminine') {
    genderColor = 'text-german-die';
    badgeBg = 'bg-german-die/10 border-german-die/30';
  } else if (gender === 'neuter') {
    genderColor = 'text-german-das';
    badgeBg = 'bg-german-das/10 border-german-das/30';
  } else if (type === 'false_friend') {
    genderColor = 'text-german-amber';
    badgeBg = 'bg-german-amber/15 border-german-amber/40';
  }

  if (!showBadge) {
    return <IconComp size={size} className={`${genderColor} ${className}`} />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center p-2.5 rounded-xl border-2 shadow-sm transition-transform group-hover:scale-105 ${badgeBg} ${className}`}
      title={name || german}
    >
      <IconComp size={size} className={genderColor} strokeWidth={2.2} />
    </div>
  );
};
