declare module 'lucide-react' {
  import * as React from 'react';
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: number | string;
  }
  export const Users: React.FC<IconProps>;
  export const MapPin: React.FC<IconProps>;
  export const Globe: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Mail: React.FC<IconProps>;
  export const Calendar: React.FC<IconProps>;
  export const MessageSquare: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const AlertTriangle: React.FC<IconProps>;
  export const Search: React.FC<IconProps>;
  export const Filter: React.FC<IconProps>;
  export const Eye: React.FC<IconProps>;
  export const CheckCircle: React.FC<IconProps>;
  export const XCircle: React.FC<IconProps>;
  export const Phone: React.FC<IconProps>;
  export const Loader2: React.FC<IconProps>;
}
