import * as React from "react";

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;

  return "#" + r + g + b;
}

function blendWithWhite(hexColor, opacity = 0.168) {
  let c = hexColor.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map(char => char + char).join("");
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const blendedR = Math.round(r * opacity + 255 * (1 - opacity));
  const blendedG = Math.round(g * opacity + 255 * (1 - opacity));
  const blendedB = Math.round(b * opacity + 255 * (1 - opacity));

  return "#" + ((1 << 24) + (blendedR << 16) + (blendedG << 8) + blendedB).toString(16).slice(1);
}

function createPalette(baseColor = "#2150a9") {
  const { h, s, l } = hexToHSL(baseColor);

  const primary = baseColor;
  const secondary = hslToHex(h, Math.max(0, s - 10), Math.min(100, l + 10));
  const tertiary = hslToHex(h, Math.max(0, s - 20), Math.min(100, l + 25));
  
  const lightTint = blendWithWhite(tertiary, 0.168);
  const avatarBgTint = blendWithWhite(tertiary, 0.50);

  return {
    primary,
    secondary,
    tertiary,
    lightTint,
    avatarBgTint,
    accent: hslToHex(h, Math.min(100, s + 10), Math.max(0, l - 35)),
    accentSecondary: hslToHex(h, s, Math.max(0, l - 20)),
    accentTertiary: hslToHex(h, s, Math.max(0, l - 15)),
  };
}

const SvgComponent = ({
  avatar,
  verified = false,
  verificationIcon,
  size = 128,
  color = "#2150a9",
  avatarScale = 1,
  iconScale = 1,
  iconOffsetX = 0,
  iconOffsetY = 0,
  avatarFit = "contain",
  ...props
}) => {
  const uniqueId = React.useId();
  const idPrefix = uniqueId.replace(/[:]/g, "");
  const WHITE = "#FFFFFF";
  
  const { primary, secondary, tertiary, lightTint, avatarBgTint, accent, accentSecondary, accentTertiary } = createPalette(color);

  const AVATAR_SIZE = 18.52; // Radius 9.26 * 2
  const AVATAR_X = 16.933 - 9.26;
  const AVATAR_Y = 16.933 - 9.26;

  const scaledSize = AVATAR_SIZE * avatarScale;
  const offset = (AVATAR_SIZE - scaledSize) / 2;

  const avatarX = AVATAR_X + offset;
  const avatarY = AVATAR_Y + offset;

  const preserveAspectRatio = avatarFit === "cover" ? "xMidYMid slice" : "";

  const centerX = 16.9333;
  const baseY = 27.0322; 

  const iconX = centerX + iconOffsetX;
  const iconY = baseY + iconOffsetY;

  const IconSize = 4.5 * (iconScale || 1);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 33.867 33.867"
      {...props}
    >
      <defs>
        <linearGradient id={`${idPrefix}-d`}>
          <stop
            offset={0.096}
            style={{
              stopColor: lightTint,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.727}
            style={{
              stopColor: lightTint,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: tertiary,
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <linearGradient id={`${idPrefix}-c`}>
          <stop
            offset={0}
            style={{
              stopColor: accent,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.511}
            style={{
              stopColor: accentSecondary,
              stopOpacity: 0.90980393,
            }}
          />
          <stop
            offset={1}
            style={{
              stopColor: accentTertiary,
              stopOpacity: 0.87843138,
            }}
          />
        </linearGradient>
        <linearGradient id={`${idPrefix}-b`}>
          <stop
            offset={0.119}
            style={{
              stopColor: primary,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.592}
            style={{
              stopColor: secondary,
              stopOpacity: 0.9137255,
            }}
          />
          <stop
            offset={0.975}
            style={{
              stopColor: tertiary,
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <linearGradient id={`${idPrefix}-a`}>
          <stop
            offset={0}
            style={{
              stopColor: primary,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.131}
            style={{
              stopColor: secondary,
              stopOpacity: 1,
            }}
          />
          <stop
            offset={0.722}
            style={{
              stopColor: tertiary,
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <linearGradient
          xlinkHref={`#${idPrefix}-a`}
          id={`${idPrefix}-e`}
          x1={122.437}
          x2={122.437}
          y1={114.744}
          y2={224.685}
          gradientUnits="userSpaceOnUse"
        />
        <linearGradient
          xlinkHref={`#${idPrefix}-b`}
          id={`${idPrefix}-h`}
          x1={137.49}
          x2={106.757}
          y1={117.255}
          y2={216.547}
          gradientUnits="userSpaceOnUse"
        />
        <linearGradient
          xlinkHref={`#${idPrefix}-c`}
          id={`${idPrefix}-f`}
          x1={122.437}
          x2={122.437}
          y1={114.744}
          y2={224.685}
          gradientUnits="userSpaceOnUse"
        />
        <linearGradient
          xlinkHref={`#${idPrefix}-d`}
          id={`${idPrefix}-g`}
          x1={106.241}
          x2={141.746}
          y1={222.311}
          y2={115.781}
          gradientUnits="userSpaceOnUse"
        />
        <clipPath id={`${idPrefix}-avatar-clip`}>
          <circle
            cx={16.933}
            cy={-16.933}
            r={9.26}
            transform="rotate(90)"
          />
        </clipPath>
      </defs>
      <path
        d="m113.143 123.649 15.924 3.128 5.253 15.355-10.671 12.227-15.924-3.128-5.254-15.355z"
        style={{
          fill: "none",
          strokeWidth: 0.264583,
        }}
      />
      <path
        d="m99.808 145.065 16.455-14.762 21.013 6.87 4.557 21.631-16.456 14.763-21.012-6.87z"
        style={{
          fill: "none",
          strokeWidth: 0.264583,
        }}
      />
      <path
        d="M134.277 116.355c-1.629-.076-3.282.06-4.918.42l-35.468 7.823a18.749 18.749 0 0 0-13.838 12.65l-10.961 34.629a18.751 18.751 0 0 0 4.037 18.31l24.51 26.807a18.75 18.75 0 0 0 17.875 5.658l35.468-7.822a18.749 18.749 0 0 0 13.838-12.65l10.961-34.63a18.748 18.748 0 0 0-4.037-18.308l-24.51-26.806a18.75 18.75 0 0 0-12.957-6.08z"
        style={{
          fill: `url(#${idPrefix}-e)`,
          strokeWidth: 0.264227,
        }}
        transform="rotate(162.625 24.927 27.83) scale(.23932)"
      />
      <path
        d="m92.688 125.291 38.054-8.391a16.04 16.04 17.564 0 1 15.292 4.84l26.294 28.76a16.04 16.04 77.564 0 1 3.454 15.663l-11.759 37.151a16.04 16.04 137.564 0 1-11.838 10.823l-38.053 8.392a16.04 16.04 17.564 0 1-15.292-4.84l-26.295-28.76a16.04 16.04 77.564 0 1-3.454-15.663l11.76-37.152a16.04 16.04 137.564 0 1 11.837-10.823z"
        style={{
          fill: `url(#${idPrefix}-f)`,
          fillOpacity: 1,
          strokeWidth: 0.264583,
        }}
        transform="rotate(162.623 24.14 27.029) scale(.22871)"
      />
      <path
        d="M134.236 117.23a17.879 17.879 0 0 0-4.69.4l-35.468 7.823a17.872 17.872 0 0 0-13.191 12.06l-10.961 34.63a17.874 17.874 0 0 0 3.85 17.455l24.51 26.806a17.873 17.873 0 0 0 17.04 5.393l35.469-7.822a17.872 17.872 0 0 0 13.191-12.06l10.961-34.63a17.87 17.87 0 0 0-3.85-17.453l-24.51-26.807a17.872 17.872 0 0 0-12.35-5.795z"
        style={{
          opacity: 1,
          fill: WHITE,
          fillOpacity: 1,
          strokeWidth: 0.264583,
        }}
        transform="rotate(162.622 23.355 26.23) scale(.21813)"
      />
      <path
        d="M134.236 117.23a17.879 17.879 0 0 0-4.69.4l-35.468 7.823a17.872 17.872 0 0 0-13.191 12.06l-10.961 34.63a17.874 17.874 0 0 0 3.85 17.455l24.51 26.806a17.873 17.873 0 0 0 17.04 5.393l35.469-7.822a17.872 17.872 0 0 0 13.191-12.06l10.961-34.63a17.87 17.87 0 0 0-3.85-17.453l-24.51-26.807a17.872 17.872 0 0 0-12.35-5.795z"
        style={{
          opacity: 0.168,
          fill: tertiary,
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0.264583,
        }}
        transform="rotate(162.622 23.355 26.23) scale(.21813)"
      />

      <circle
        cx={16.933}
        cy={-16.933}
        r={9.26}
        style={{
          fill: avatarBgTint,
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0.438328,
        }}
        transform="rotate(90)"
      />

      {avatar && (
        <g clipPath={`url(#${idPrefix}-avatar-clip)`}>
          <image
            width={scaledSize}
            height={scaledSize}
            href={avatar}
            x={avatarX}
            y={avatarY}
            preserveAspectRatio={preserveAspectRatio}
          />
        </g>
      )}

      <path
        d="M137.096 114.271c-.933-.043-1.88.034-2.817.24l-45.804 10.102a10.73 10.73 0 0 0-7.924 7.242l-14.156 44.72a10.737 10.737 0 0 0 2.312 10.486l31.65 34.617a10.734 10.734 0 0 0 10.237 3.24l45.804-10.102a10.735 10.735 0 0 0 7.926-7.244l14.155-44.718a10.737 10.737 0 0 0-2.313-10.487l-31.65-34.617a10.732 10.732 0 0 0-7.42-3.479z"
        style={{
          fill: `url(#${idPrefix}-g)`,
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0.264583,
        }}
        transform="rotate(162.629 11.107 19.613) scale(.06365)"
      />
      <path
        d="M137.021 115.84a9.166 9.166 0 0 0-2.404.205l-45.804 10.101a9.163 9.163 0 0 0-6.764 6.184L67.893 177.05A9.167 9.167 0 0 0 69.867 186l31.65 34.617a9.166 9.166 0 0 0 8.739 2.766l45.805-10.1a9.168 9.168 0 0 0 6.765-6.185l14.154-44.72a9.167 9.167 0 0 0-1.974-8.95l-31.65-34.617a9.164 9.164 0 0 0-6.335-2.971z"
        style={{
          mixBlendMode: "normal",
          fill: `url(#${idPrefix}-h)`,
          fillRule: "evenodd",
          stroke: "none",
          strokeWidth: 0.264583,
        }}
        transform="matrix(-.05315 .01663 -.01663 -.05315 26.233 34.017)"
      />

      {verified && verificationIcon && (
        <g transform={`translate(${iconX}, ${iconY})`}>
          <g transform={`translate(${-IconSize / 2}, ${-IconSize / 2})`}>
            {React.isValidElement(verificationIcon) ? (
              React.cloneElement(verificationIcon, {
                width: IconSize,
                height: IconSize,
              })
            ) : (
              verificationIcon
            )}
          </g>
        </g>
      )}
    </svg>
  );
};

export default SvgComponent;