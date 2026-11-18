import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  color?: string;
}

type IconNode = [
  tag: 'path' | 'circle' | 'line' | 'rect' | 'polygon',
  attrs: Record<string, string | number>
][];

function createIcon(displayName: string, iconNode: IconNode) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(
    (
      {
        color = 'currentColor',
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth = false,
        className = '',
        children,
        ...rest
      },
      ref
    ) => {
      const computedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : strokeWidth;

      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={computedStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden={!rest['aria-label'] ? true : undefined}
          {...rest}
        >
          {iconNode.map(([Tag, attrs], idx) => {
            const { key, ...elProps } = attrs;
            return <Tag key={(key as string) ?? idx} {...elProps} />;
          })}
          {children}
        </svg>
      );
    }
  );
  Component.displayName = displayName;
  return Component;
}

export const AlertCircle = createIcon('AlertCircle', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['line', { x1: '12', x2: '12', y1: '8', y2: '12', key: '1pkeuh' }],
  ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16', key: '4dfq90' }],
]);

export const ArrowRight = createIcon('ArrowRight', [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
]);

export const BarChart3 = createIcon('BarChart3', [
  ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
  ['path', { d: 'M18 17V9', key: '2bz60n' }],
  ['path', { d: 'M13 17V5', key: '1frdt8' }],
  ['path', { d: 'M8 17v-3', key: '17ska0' }],
]);

export const Bookmark = createIcon('Bookmark', [
  ['path', { d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z', key: '1fy3hk' }],
]);

export const Briefcase = createIcon('Briefcase', [
  ['path', { d: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', key: 'jecpp' }],
  ['rect', { width: '20', height: '14', x: '2', y: '6', rx: '2', key: 'i6l2r4' }],
]);

export const Car = createIcon('Car', [
  [
    'path',
    {
      d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2',
      key: '5owen',
    },
  ],
  ['circle', { cx: '7', cy: '17', r: '2', key: 'u2ysq9' }],
  ['path', { d: 'M9 17h6', key: 'r8uit2' }],
  ['circle', { cx: '17', cy: '17', r: '2', key: 'axvx0g' }],
]);

export const Check = createIcon('Check', [
  ['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }],
]);

export const CheckCircle2 = createIcon('CheckCircle2', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
]);

export const ChevronLeft = createIcon('ChevronLeft', [
  ['path', { d: 'm15 18-6-6 6-6', key: '1wnfg3' }],
]);

export const ChevronRight = createIcon('ChevronRight', [
  ['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }],
]);

export const Circle = createIcon('Circle', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
]);

export const Compass = createIcon('Compass', [
  [
    'path',
    {
      d: 'm16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z',
      key: '9ktpf1',
    },
  ],
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
]);

export const Copy = createIcon('Copy', [
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
]);

export const Crosshair = createIcon('Crosshair', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['line', { x1: '22', x2: '18', y1: '12', y2: '12', key: 'l9bcsi' }],
  ['line', { x1: '6', x2: '2', y1: '12', y2: '12', key: '13hhkx' }],
  ['line', { x1: '12', x2: '12', y1: '6', y2: '2', key: '10w3f3' }],
  ['line', { x1: '12', x2: '12', y1: '22', y2: '18', key: '15g9kq' }],
]);

export const Diamond = createIcon('Diamond', [
  [
    'path',
    {
      d: 'M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z',
      key: '1f1r0c',
    },
  ],
]);

export const Edit3 = createIcon('Edit3', [
  ['path', { d: 'M13 21h8', key: '1jsn5i' }],
  [
    'path',
    {
      d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
      key: '1a8usu',
    },
  ],
]);

export const Eye = createIcon('Eye', [
  [
    'path',
    {
      d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
      key: '1nclc0',
    },
  ],
  ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
]);

export const EyeOff = createIcon('EyeOff', [
  [
    'path',
    {
      d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
      key: 'ct8e1f',
    },
  ],
  ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242', key: '151rxh' }],
  [
    'path',
    {
      d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
      key: '13bj9a',
    },
  ],
  ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
]);

export const Filter = createIcon('Filter', [
  [
    'path',
    {
      d: 'M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z',
      key: 'sc7q7i',
    },
  ],
]);

export const Home = createIcon('Home', [
  ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
  [
    'path',
    {
      d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      key: 'r6nss1',
    },
  ],
]);

export const Info = createIcon('Info', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M12 16v-4', key: '1dtifu' }],
  ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
]);

export const Layers = createIcon('Layers', [
  [
    'path',
    {
      d: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z',
      key: 'zw3jo',
    },
  ],
  [
    'path',
    {
      d: 'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
      key: '1wduqc',
    },
  ],
  [
    'path',
    {
      d: 'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
      key: 'kqbvx6',
    },
  ],
]);

export const Map = createIcon('Map', [
  [
    'path',
    {
      d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
      key: '169xi5',
    },
  ],
  ['path', { d: 'M15 5.764v15', key: '1pn4in' }],
  ['path', { d: 'M9 3.236v15', key: '1uimfh' }],
]);

export const MapPin = createIcon('MapPin', [
  [
    'path',
    {
      d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
      key: '1r0f0z',
    },
  ],
  ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
]);

export const Maximize2 = createIcon('Maximize2', [
  ['path', { d: 'M15 3h6v6', key: '1q9fwt' }],
  ['path', { d: 'm21 3-7 7', key: '1l2asr' }],
  ['path', { d: 'm3 21 7-7', key: 'tjx5ai' }],
  ['path', { d: 'M9 21H3v-6', key: 'wtvkvv' }],
]);

export const Menu = createIcon('Menu', [
  ['path', { d: 'M4 5h16', key: '1tepv9' }],
  ['path', { d: 'M4 12h16', key: '1lakjw' }],
  ['path', { d: 'M4 19h16', key: '1djgab' }],
]);

export const Minus = createIcon('Minus', [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
]);

export const Moon = createIcon('Moon', [
  [
    'path',
    {
      d: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401',
      key: 'kfwtm',
    },
  ],
]);

export const Navigation = createIcon('Navigation', [
  ['polygon', { points: '3 11 22 2 13 21 11 13 3 11', key: '1ltx0t' }],
]);

export const Plus = createIcon('Plus', [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'M12 5v14', key: 's699le' }],
]);

export const Radar = createIcon('Radar', [
  ['path', { d: 'M19.07 4.93A10 10 0 0 0 6.99 3.34', key: 'z3du51' }],
  ['path', { d: 'M4 6h.01', key: 'oypzma' }],
  ['path', { d: 'M2.29 9.62A10 10 0 1 0 21.31 8.35', key: 'qzzz0' }],
  ['path', { d: 'M16.24 7.76A6 6 0 1 0 8.23 16.67', key: '1yjesh' }],
  ['path', { d: 'M12 18h.01', key: 'mhygvu' }],
  ['path', { d: 'M17.99 11.66A6 6 0 0 1 15.77 16.67', key: '1u2y91' }],
  ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
  ['path', { d: 'm13.41 10.59 5.66-5.66', key: 'mhq4k0' }],
]);

export const RotateCcw = createIcon('RotateCcw', [
  ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', key: '1357e3' }],
  ['path', { d: 'M3 3v5h5', key: '1xhq8a' }],
]);

export const Search = createIcon('Search', [
  ['path', { d: 'm21 21-4.34-4.34', key: '14j7rj' }],
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
]);

export const Share2 = createIcon('Share2', [
  ['circle', { cx: '18', cy: '5', r: '3', key: 'gq8acd' }],
  ['circle', { cx: '6', cy: '12', r: '3', key: 'w7nqdw' }],
  ['circle', { cx: '18', cy: '19', r: '3', key: '1xt0gg' }],
  ['line', { x1: '8.59', x2: '15.42', y1: '13.51', y2: '17.49', key: '47mynk' }],
  ['line', { x1: '15.41', x2: '8.59', y1: '6.51', y2: '10.49', key: '1n3mei' }],
]);

export const ShieldAlert = createIcon('ShieldAlert', [
  [
    'path',
    {
      d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
      key: 'oel41y',
    },
  ],
  ['path', { d: 'M12 8v4', key: '1got3b' }],
  ['path', { d: 'M12 16h.01', key: '1drbdi' }],
]);

export const Sliders = createIcon('Sliders', [
  ['path', { d: 'M10 8h4', key: '1sr2af' }],
  ['path', { d: 'M12 21v-9', key: '17s77i' }],
  ['path', { d: 'M12 8V3', key: '13r4qs' }],
  ['path', { d: 'M17 16h4', key: 'h1uq16' }],
  ['path', { d: 'M19 12V3', key: 'o1uvq1' }],
  ['path', { d: 'M19 21v-5', key: 'qua636' }],
  ['path', { d: 'M3 14h4', key: 'bcjad9' }],
  ['path', { d: 'M5 10V3', key: 'cb8scm' }],
  ['path', { d: 'M5 21v-7', key: '1w1uti' }],
]);

export const SlidersHorizontal = createIcon('SlidersHorizontal', [
  ['path', { d: 'M10 5H3', key: '1qgfaw' }],
  ['path', { d: 'M12 19H3', key: 'yhmn1j' }],
  ['path', { d: 'M14 3v4', key: '1sua03' }],
  ['path', { d: 'M16 17v4', key: '1q0r14' }],
  ['path', { d: 'M21 12h-9', key: '1o4lsq' }],
  ['path', { d: 'M21 19h-5', key: '1rlt1p' }],
  ['path', { d: 'M21 5h-7', key: '1oszz2' }],
  ['path', { d: 'M8 10v4', key: 'tgpxqk' }],
  ['path', { d: 'M8 12H3', key: 'a7s4jb' }],
]);

export const Sparkles = createIcon('Sparkles', [
  [
    'path',
    {
      d: 'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z',
      key: '1s2grr',
    },
  ],
  ['path', { d: 'M20 2v4', key: '1rf3ol' }],
  ['path', { d: 'M22 4h-4', key: 'gwowj6' }],
  ['circle', { cx: '4', cy: '20', r: '2', key: '6kqj1y' }],
]);

export const Sun = createIcon('Sun', [
  ['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
  ['path', { d: 'M12 2v2', key: 'tus03m' }],
  ['path', { d: 'M12 20v2', key: '1lh1kg' }],
  ['path', { d: 'm4.93 4.93 1.41 1.41', key: '149t6j' }],
  ['path', { d: 'm17.66 17.66 1.41 1.41', key: 'ptbguv' }],
  ['path', { d: 'M2 12h2', key: '1t8f8n' }],
  ['path', { d: 'M20 12h2', key: '1q8mjw' }],
  ['path', { d: 'm6.34 17.66-1.41 1.41', key: '1m8zz5' }],
  ['path', { d: 'm19.07 4.93-1.41 1.41', key: '1shlcs' }],
]);

export const Trophy = createIcon('Trophy', [
  ['path', { d: 'M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978', key: '1n3hpd' }],
  ['path', { d: 'M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978', key: 'rfe1zi' }],
  ['path', { d: 'M18 9h1.5a1 1 0 0 0 0-5H18', key: '7xy6bh' }],
  ['path', { d: 'M4 22h16', key: '57wxv0' }],
  ['path', { d: 'M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z', key: '1mhfuq' }],
  ['path', { d: 'M6 9H4.5a1 1 0 0 1 0-5H6', key: 'tex48p' }],
]);

export const Volume2 = createIcon('Volume2', [
  [
    'path',
    {
      d: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
      key: 'uqj9uw',
    },
  ],
  ['path', { d: 'M16 9a5 5 0 0 1 0 6', key: '1q6k2b' }],
  ['path', { d: 'M19.364 18.364a9 9 0 0 0 0-12.728', key: 'ijwkga' }],
]);

export const VolumeX = createIcon('VolumeX', [
  [
    'path',
    {
      d: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
      key: 'uqj9uw',
    },
  ],
  ['line', { x1: '22', x2: '16', y1: '9', y2: '15', key: '1ewh16' }],
  ['line', { x1: '16', x2: '22', y1: '9', y2: '15', key: '5ykzw1' }],
]);

export const X = createIcon('X', [
  ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
  ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
]);
