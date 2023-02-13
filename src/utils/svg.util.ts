

const svgStart = '<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" version="1.1" id="billboard">';

const svgEnd = '</svg>';

const circleViewClipPath = `
<clipPath id="circleView">
    <circle cx="600" cy="600" r="300" fill="#FFFFFF" />
</clipPath>
`;

const background_light = `
<circle cx="300" cy="300" r="1300" fill="url(#darkLight)">
  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 600 600" to="360 600 600" begin="0" dur="5s" repeatCount="indefinite"/>
</circle>
`;

const background_black = `
<circle cx="600" cy="600" r="900" fill="#000" />
`;

const drawCircle = (level: number) => {
  return `<g stroke="${baseColors[level]}" fill="${baseColors[level]}">
  ${level === 3 ? '<circle cx="600" cy="600" r="480" stroke-width="10" fill="none" stroke-dasharray="230 20"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 600 600" to="360 600 600" begin="0" dur="30s" repeatCount="indefinite" /></circle>' : ''}
  <circle cx="600" cy="600" r="454" stroke-width="15" fill="none" />
  '<circle cx="600" cy="600" r="430" stroke-width="4" fill="none"/>'
  
  '<circle cx="600" cy="600" r="410" stroke-width="4" fill="none"/>'
  '<circle cx="600" cy="600" r="400" stroke-width="12" fill="none" stroke-dasharray="2 58">'
    '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 600 600" to="360 600 600" begin="0" dur="60s" repeatCount="indefinite"/>'
  "</circle>"
  '<circle cx="600" cy="600" r="355" stroke-width="4" fill="none"/>'
</g>`;
}

const frame_fire = `
  '<g stroke="#e37da2" stroke-width="4" filter="url(#light0)">'
  '<rect width="1180" height="1180" x="10" y="10" stroke-width="4" fill="none" rx="18" />'
  '<line x1="29.999" y1="30" x2="29.999" y2="1170" stroke-linecap="round" stroke-linejoin="round" />'
  '<line x1="1169.999" y1="30" x2="1169.999" y2="1170" stroke-linecap="round" stroke-linejoin="round" />'
  '<line x1="600.499" y1="-555.5" x2="600.499" y2="583.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(600.499000, 30.000000) scale(1, -1) rotate(90.000000) translate(-600.499000, -14.000000) " />'
  '<line x1="599.999" y1="600" x2="599.999" y2="1740" stroke-linecap="round" stroke-linejoin="round" transform="translate(599.999000, 1170.000000) scale(1, -1) rotate(90.000000) translate(-600.999000, -1170.000000) " />'
  '<g transform="translate(53.499000, 54.000000) rotate(-225.000000) translate(-53.499000, -54.000000) translate(31.999000, 20.000000)">'
  '<path d="M21.9097997,3.90608266 C26.170933,11.4659076 29.3361359,16.8171723 31.4028127,19.9615071 C32.9627669,22.3348914 34.7148315,24.4510487 36.3239968,26.389261 C38.7190073,29.2740105 41,31.6442511 41,34.0392981 C41,41.2737911 34.4771874,51.5925095 21.975433,65.1048441 C8.85845251,51.5900759 2,41.2762436 2,34.0392981 C2,31.7153744 4.5038242,29.0498098 6.98866431,26.00804 C8.54822997,24.0989273 10.194636,22.0782507 11.5931101,19.9677281 C13.7720223,16.679399 17.2108112,11.3245551 21.9097997,3.90608266 Z" />'
  '<path d="M21.4337465,24.2580374 C28.7435807,32.3258207 32.6464466,38.4941032 32.6464466,42.8636851 C32.6464466,47.2328868 28.7426179,53.3864682 21.431484,61.425663 C13.7581494,53.3849828 9.64644661,47.2355107 9.64644661,42.8636851 C9.64644661,38.4909332 13.7581469,32.3256763 21.4337465,24.2580374 Z" />'
  '</g>'
  '<g transform="translate(1146.499000, 54.000000) scale(-1, 1) rotate(-225.000000) translate(-1146.499000, -54.000000) translate(1124.999000, 20.000000)">'
  '<path d="M21.9097997,3.90608266 C26.170933,11.4659076 29.3361359,16.8171723 31.4028127,19.9615071 C32.9627669,22.3348914 34.7148315,24.4510487 36.3239968,26.389261 C38.7190073,29.2740105 41,31.6442511 41,34.0392981 C41,41.2737911 34.4771874,51.5925095 21.975433,65.1048441 C8.85845251,51.5900759 2,41.2762436 2,34.0392981 C2,31.7153744 4.5038242,29.0498098 6.98866431,26.00804 C8.54822997,24.0989273 10.194636,22.0782507 11.5931101,19.9677281 C13.7720223,16.679399 17.2108112,11.3245551 21.9097997,3.90608266 Z" />'
  '<path d="M21.4337465,24.2580374 C28.7435807,32.3258207 32.6464466,38.4941032 32.6464466,42.8636851 C32.6464466,47.2328868 28.7426179,53.3864682 21.431484,61.425663 C13.7581494,53.3849828 9.64644661,47.2355107 9.64644661,42.8636851 C9.64644661,38.4909332 13.7581469,32.3256763 21.4337465,24.2580374 Z" />'
  '</g>'
  '<g transform="translate(1146.499000, 1146.000000) scale(-1, -1) rotate(-225.000000) translate(-1146.499000, -1146.000000) translate(1124.999000, 1112.000000)">'
  '<path d="M21.9097997,3.90608266 C26.170933,11.4659076 29.3361359,16.8171723 31.4028127,19.9615071 C32.9627669,22.3348914 34.7148315,24.4510487 36.3239968,26.389261 C38.7190073,29.2740105 41,31.6442511 41,34.0392981 C41,41.2737911 34.4771874,51.5925095 21.975433,65.1048441 C8.85845251,51.5900759 2,41.2762436 2,34.0392981 C2,31.7153744 4.5038242,29.0498098 6.98866431,26.00804 C8.54822997,24.0989273 10.194636,22.0782507 11.5931101,19.9677281 C13.7720223,16.679399 17.2108112,11.3245551 21.9097997,3.90608266 Z" />'
  '<path d="M21.4337465,24.2580374 C28.7435807,32.3258207 32.6464466,38.4941032 32.6464466,42.8636851 C32.6464466,47.2328868 28.7426179,53.3864682 21.431484,61.425663 C13.7581494,53.3849828 9.64644661,47.2355107 9.64644661,42.8636851 C9.64644661,38.4909332 13.7581469,32.3256763 21.4337465,24.2580374 Z" />'
  '</g>'
  '<g transform="translate(53.499000, 1146.000000) scale(1, -1) rotate(-225.000000) translate(-45.499000, -1138.000000) translate(23.999000, 1104.000000)">'
  '<path d="M21.9097997,3.90608266 C26.170933,11.4659076 29.3361359,16.8171723 31.4028127,19.9615071 C32.9627669,22.3348914 34.7148315,24.4510487 36.3239968,26.389261 C38.7190073,29.2740105 41,31.6442511 41,34.0392981 C41,41.2737911 34.4771874,51.5925095 21.975433,65.1048441 C8.85845251,51.5900759 2,41.2762436 2,34.0392981 C2,31.7153744 4.5038242,29.0498098 6.98866431,26.00804 C8.54822997,24.0989273 10.194636,22.0782507 11.5931101,19.9677281 C13.7720223,16.679399 17.2108112,11.3245551 21.9097997,3.90608266 Z" />'
  '<path d="M21.4337465,24.2580374 C28.7435807,32.3258207 32.6464466,38.4941032 32.6464466,42.8636851 C32.6464466,47.2328868 28.7426179,53.3864682 21.431484,61.425663 C13.7581494,53.3849828 9.64644661,47.2355107 9.64644661,42.8636851 C9.64644661,38.4909332 13.7581469,32.3256763 21.4337465,24.2580374 Z" />'
  '</g>'
  '</g>'
  
  //fire's breath circle
  '<circle cy="600" cx="600" r="457" fill="#000" filter="url(#light4)">'
  '<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" filter="url(#light4)" />'
  '</circle>'
  '<circle cy="600" cx="600" r="457" fill="#000" filter="url(#light4)">'
  '<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" filter="url(#light4)"/>'
  '</circle>'
  '<circle cy="600" cx="600" r="457" fill="#000" filter="url(#light4)">'
  '<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" filter="url(#light4)"/>'
  '</circle>'
`;

const frame_earth = `
<defs>
'<linearGradient id="gradient" gradientTransform="rotate(60)">'
    '<stop offset="0%" stop-color="hsl(211,54.4%,62.2%)" />'
    '<stop offset="100%" stop-color="hsl(121,54.4%,62.2%)" />'
    '</linearGradient>'
</defs>
'<g stroke="url(#gradient)">'
  '<rect width="1180" height="1180" x="10" y="10" stroke-width="4" fill="none" rx="18" />'
  '<path d="M30,30 H60 V80 H30 V1120 H60 V1170 H30 V1140 H80 V1170 H1120 V1140 H1170 V1170 H1140 V1120 H1170 V80 H1140 V30 H1170 V60 H1120 V30 H80 V60 H30 V30 Z" stroke-width="4" fill="none" />'
'</g>'
`;

const frame_water = `
'<g stroke="#4fb3bf" stroke-width="4">'
    '<rect width="1180" height="1180" x="10" y="10" stroke-width="4" fill="none" rx="18" />'
    '<line x1="29.999" y1="89" x2="29.999" y2="1110" stroke-linecap="round" stroke-linejoin="round" />'
    '<line x1="1169.999" y1="89" x2="1169.999" y2="1110" stroke-linecap="round" stroke-linejoin="round" />'
    '<line x1="599.999" y1="-481" x2="599.999" y2="541" stroke-linecap="round" stroke-linejoin="round" transform="translate(599.999000, 30.000000) scale(1, -1) rotate(90.000000) translate(-599.999000, -30.000000) " />'
    '<line x1="599.999" y1="659" x2="599.999" y2="1681" stroke-linecap="round" stroke-linejoin="round" transform="translate(599.999000, 1170.000000) scale(1, -1) rotate(90.000000) translate(-599.999000, -1170.000000) " />'
    '<g transform="translate(30.000000, 30.000000)">'
    '<circle stroke-linejoin="round" cx="13" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="13" r="13" />'
    '<path d="M13,46 C23.4255706,46 31.0922373,50.3333333 36,59 C40.9077627,67.6666667 48.5744294,72 59,72" />'
    '<path d="M36,21 C46.4255706,21 54.0922373,25.3333333 59,34 C63.9077627,42.6666667 71.5744294,47 82,47" transform="translate(59.000000, 34.000000) rotate(-270.000000) translate(-59.000000, -34.000000) " />'
    '</g>'
    '<g transform="translate(66.000000, 1134.000000) scale(1, -1) translate(-66.000000, -1134.000000) translate(30.000000, 1098.000000)">'
    '<circle stroke-linejoin="round" cx="13" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="13" r="13" />'
    '<path d="M13,46 C23.4255706,46 31.0922373,50.3333333 36,59 C40.9077627,67.6666667 48.5744294,72 59,72" />'
    '<path d="M36,21 C46.4255706,21 54.0922373,25.3333333 59,34 C63.9077627,42.6666667 71.5744294,47 82,47" transform="translate(59.000000, 34.000000) rotate(-270.000000) translate(-59.000000, -34.000000) " />'
    '</g>'
    '<g transform="translate(1134.000000, 66.000000) scale(-1, 1) translate(-1126.000000, -58.000000) translate(1090.000000, 22.000000)">'
    '<circle stroke-linejoin="round" cx="13" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="13" r="13" />'
    '<path d="M13,46 C23.4255706,46 31.0922373,50.3333333 36,59 C40.9077627,67.6666667 48.5744294,72 59,72" />'
    '<path d="M36,21 C46.4255706,21 54.0922373,25.3333333 59,34 C63.9077627,42.6666667 71.5744294,47 82,47" transform="translate(59.000000, 34.000000) rotate(-270.000000) translate(-59.000000, -34.000000) " />'
    '</g>'
    '<g transform="translate(1134.000000, 1134.000000) scale(-1, -1) translate(-1118.000000, -1118.000000) translate(1082.000000, 1082.000000)">'
    '<circle stroke-linejoin="round" cx="13" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="59" r="13" />'
    '<circle stroke-linejoin="round" cx="59" cy="13" r="13" />'
    '<path d="M13,46 C23.4255706,46 31.0922373,50.3333333 36,59 C40.9077627,67.6666667 48.5744294,72 59,72" />'
    '<path d="M36,21 C46.4255706,21 54.0922373,25.3333333 59,34 C63.9077627,42.6666667 71.5744294,47 82,47" transform="translate(59.000000, 34.000000) rotate(-270.000000) translate(-59.000000, -34.000000) " />'
    '</g>'
'</g>'
`

const frame_wind = `
<defs>
  '<linearGradient id="gradient_wind" gradientTransform="rotate(60)">'
  '<stop offset="0%" stop-color="hsl(49,26%,63%)" />'
  '<stop offset="70%" stop-color="hsl(49,56%,43%)" />'
  '<stop offset="100%" stop-color="hsl(49,56%,43%)" />'
  '</linearGradient>'
</defs>
'<g stroke="url(#gradient_wind)" stroke-width="4">'
    '<rect width="1180" height="1180" x="10" y="10" stroke-width="4" fill="none" rx="18" />'
    '<line x1="29.999" y1="90" x2="29.998" y2="1110" stroke-linecap="round" stroke-linejoin="round" />'
    '<line x1="1169.999" y1="90" x2="1169.998" y2="1110" stroke-linecap="round" stroke-linejoin="round" />'
    '<line x1="599.999" y1="-481" x2="599.998" y2="541" stroke-linecap="round" stroke-linejoin="round" transform="translate(599.999000, 30.000000) scale(1, -1) rotate(90.000000) translate(-599.999000, -30.000000) " />'
    '<line x1="599.999" y1="659" x2="599.998" y2="1681" stroke-linecap="round" stroke-linejoin="round" transform="translate(599.999000, 1170.000000) scale(1, -1) rotate(90.000000) translate(-599.999000, -1170.000000) " />'
    '<g transform="translate(29.999000, 30.000000)">'
    '<path d="M0,60 C6.95638942,59.7567892 11.866387,55.8626531 14.7299928,48.3175919 C17.5935986,40.7725306 22.3502677,37 29,37" stroke-linecap="round" stroke-linejoin="round" />'
    '<path d="M30,23 C36.9563894,22.7567892 41.866387,18.8626531 44.7299928,11.3175919 C47.5935986,3.77253063 52.3502677,0 59,0" stroke-linecap="round" stroke-linejoin="round" />'
    '<circle cx="29.001" cy="30" r="7" />'
    '<path d="M42.1077896,16.2445146 C38.698469,12.9949978 34.0827128,11 29.001,11 C18.5075898,11 10.001,19.5065898 10.001,30 M16.8997613,44.6485395 C20.1863254,47.366665 24.4029198,49 29.001,49 C39.4944102,49 48.001,40.4934102 48.001,30" stroke-linecap="round" />'
    '</g>'
    '<g transform="translate(1140.499000, 60.000000) scale(-1, 1) translate(-1132.499000, -52.000000) translate(1102.999000, 22.000000)">'
    '<path d="M0,60 C6.95638942,59.7567892 11.866387,55.8626531 14.7299928,48.3175919 C17.5935986,40.7725306 22.3502677,37 29,37" stroke-linecap="round" stroke-linejoin="round" />'
    '<path d="M30,23 C36.9563894,22.7567892 41.866387,18.8626531 44.7299928,11.3175919 C47.5935986,3.77253063 52.3502677,0 59,0" stroke-linecap="round" stroke-linejoin="round" />'
    '<circle cx="29.001" cy="30" r="7" />'
    '<path d="M42.1077896,16.2445146 C38.698469,12.9949978 34.0827128,11 29.001,11 C18.5075898,11 10.001,19.5065898 10.001,30 M16.8997613,44.6485395 C20.1863254,47.366665 24.4029198,49 29.001,49 C39.4944102,49 48.001,40.4934102 48.001,30" stroke-linecap="round" />'
    '</g>'
    '<g transform="translate(1140.499000, 1140.000000) scale(-1, -1) translate(-1132.499000, -1132.000000) translate(1102.999000, 1102.000000)">'
    '<path d="M0,60 C6.95638942,59.7567892 11.866387,55.8626531 14.7299928,48.3175919 C17.5935986,40.7725306 22.3502677,37 29,37" stroke-linecap="round" stroke-linejoin="round" />'
    '<path d="M30,23 C36.9563894,22.7567892 41.866387,18.8626531 44.7299928,11.3175919 C47.5935986,3.77253063 52.3502677,0 59,0" stroke-linecap="round" stroke-linejoin="round" />'
    '<circle cx="29.001" cy="30" r="7" />'
    '<path d="M42.1077896,16.2445146 C38.698469,12.9949978 34.0827128,11 29.001,11 C18.5075898,11 10.001,19.5065898 10.001,30 M16.8997613,44.6485395 C20.1863254,47.366665 24.4029198,49 29.001,49 C39.4944102,49 48.001,40.4934102 48.001,30" stroke-linecap="round" />'
    '</g>'
    '<g transform="translate(59.499000, 1140.000000) scale(1, -1) translate(-51.499000, -1132.000000) translate(21.999000, 1102.000000)">'
    '<path d="M0,60 C6.95638942,59.7567892 11.866387,55.8626531 14.7299928,48.3175919 C17.5935986,40.7725306 22.3502677,37 29,37" stroke-linecap="round" stroke-linejoin="round" />'
    '<path d="M30,23 C36.9563894,22.7567892 41.866387,18.8626531 44.7299928,11.3175919 C47.5935986,3.77253063 52.3502677,0 59,0" stroke-linecap="round" stroke-linejoin="round" />'
    '<circle cx="29.001" cy="30" r="7" />'
    '<path d="M42.1077896,16.2445146 C38.698469,12.9949978 34.0827128,11 29.001,11 C18.5075898,11 10.001,19.5065898 10.001,30 M16.8997613,44.6485395 C20.1863254,47.366665 24.4029198,49 29.001,49 C39.4944102,49 48.001,40.4934102 48.001,30" stroke-linecap="round" />'
    '</g>'
    '</g>'
`;

const frame_common = `
'<g stroke="#989898">'
    '<rect width="1180" height="1180" x="10" y="10" stroke-width="4" fill="none"/>'
    '<path d="M30,30 H60 V80 H30 V1120 H60 V1170 H30 V1140 H80 V1170 H1120 V1140 H1170 V1170 H1140 V1120 H1170 V80 H1140 V30 H1170 V60 H1120 V30 H80 V60 H30 V30 Z" stroke-width="4" fill="none"/>'
  "</g>"
`;

const frames = [frame_common, frame_wind, frame_earth, frame_water, frame_fire];

const baseColors = ['#989898', 'url(#gradient_wind)', 'url(#gradient)', '#4fb3bf', '#e37da2'];

export const generateSvg = (imageUrl: string, level: number = 0) => {

  level = Math.min(Math.max(0, level), 4);

  let svg = `${svgStart}
    <defs>
      ${circleViewClipPath}

      '<radialGradient id="darkLight">'
        '<stop offset="0%" stop-color="#484848"/>'
        '<stop offset="3%" stop-color="#1b1b1b"/>'
        '<stop offset="8%" stop-color="#000000"/>'
      "</radialGradient>"

      '<filter id="light0">'
      '<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#e37da2" />'
      '</filter>'
      '<filter id="light1">'
      '<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#e37da2" />'
      '</filter>'
      '<filter id="light2">'
      '<feGaussianBlur in="SourceGraphic" stdDeviation="1" />'
      '<feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#e37da2" />'
      '</filter>'
      '<filter id="light3">'
      '<feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#e37da2" />'
      '</filter>'
      '<filter id="light4">'
      '<feGaussianBlur in="SourceGraphic" stdDeviation="1" />'
      '<feDropShadow dx="0" dy="0" stdDeviation="40" flood-color="#e37da2" />'
      '</filter>'
    </defs>
    
    ${level=== 2 ? background_light : background_black}
    ${frames[level]}
    ${drawCircle(level)}
    
    <image
      x="300"
      y="300"
      width="600"
      height="600"
      xlink:href="${imageUrl}"
      clip-path="url(#circleView)"
    />
  ${svgEnd}`;

  return svg;
}