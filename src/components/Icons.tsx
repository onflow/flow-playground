import React from 'react'
import styled from 'styled-components'

interface IconSVGProps {
  size?: string,
  title?: string
}

const IconSVG = styled.svg<IconSVGProps>`
  width: ${(props) => props.size || '1em'};
  height: auto;
`

const Cadence = styled(IconSVG)`
  .withGradient {
    fill: currentColor;
  }
  &:hover{
    .withGradient{
      fill: url(#cadence-gradient);
    }
  }
`;

export const IconCadence = (props: IconSVGProps) => {
  const { title, size } = props
  return(
    <Cadence size={size} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 114 114" version="1.1">
      {title && <title>{title}</title>}
      <defs>
        <linearGradient x1="140.172697%" y1="-32.1134868%" x2="11.7358827%" y2="90.7346491%" id="cadence-gradient">
          <stop stop-color="#FFFFFF" stop-opacity="0" offset="0%"/>
          <stop stop-color="#00FAFA" offset="12.8329843%"/>
          <stop stop-color="#7F00FF" offset="100%"/>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Cadence">
          <circle id="cadence-icon-circle" className={"withGradient"} cx="57" cy="57" r="57"/>
          <g id="sport" transform="translate(1.000000, 32.000000)" fill="#FFFFFF" fill-rule="nonzero">
            <path d="M80.7784851,30.8431068 L64.9398901,30.8431068 L64.9398901,20.2837562 C64.9398901,15.6471453 59.3304167,13.2058235 56.0250237,16.5524337 L35.1405307,37.6695509 C33.100833,39.7319681 33.100833,43.0729466 35.1405307,45.1353638 L47.1132903,57.2414832 L24,81 C21.9603022,83.0624172 30.4900756,77.390836 32.5297733,79.4532531 C34.569297,81.5154943 37.8736457,81.5156703 39.9133434,79.4532531 L58.1886454,60.9743896 C60.2283432,58.9119725 60.2283432,55.5709939 58.1886454,53.5085768 L46.2158859,41.4024573 L54.4968604,33.0292443 L54.4968604,36.1227821 C54.4968604,39.0383947 56.8348807,41.4024573 59.7183752,41.4024573 L80.7784851,41.4024573 C83.6619797,41.4024573 86,39.0383947 86,36.1227821 C86,33.2071694 83.6619797,30.8431068 80.7784851,30.8431068 Z" id="Path"/>
            <path d="M45.3898359,4.88313221 C43.322515,3.49272675 40.579726,3.76782527 38.8272537,5.54105277 L24.5238343,20.0153052 C22.4920552,22.0713508 22.4920552,25.4020079 24.5238343,27.4580535 C26.5556133,29.5140991 29.8471336,29.5139237 31.8789126,27.4578781 L43.1676913,16.0342717 L46.9704938,18.8063104 L52.0514151,13.664705 C52.9012983,12.8046712 53.9037513,12.1371012 55,11.6158526 L45.3898359,4.88313221 Z" id="Path"/>
            <path d="M31.3570944,48.7777944 C30.0516526,47.436334 29.1802131,45.7853195 28.7207924,44 L1.50951903,71.9620629 C-0.503173008,74.0302874 -0.503173008,77.3806734 1.50951903,79.4488978 C3.52203931,81.5169458 6.78263819,81.5171223 8.79533022,79.4488978 L35,52.5212119 L31.3570944,48.7777944 Z" id="Path"/>
            <circle id="Oval" cx="67.5" cy="7.5" r="7.5"/>
          </g>
        </g>
      </g>
    </Cadence>
  )
}