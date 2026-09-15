import { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// Inline SVG Icons

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M18,12.286a1.715,1.715,0,0,0-1.714-1.714h-4a1.715,1.715,0,0,0-1.714,1.714v4A1.715,1.715,0,0,0,12.286,18h4A1.715,1.715,0,0,0,18,16.286Zm-8.571,0a1.715,1.715,0,0,0-1.714-1.714h-4A1.715,1.715,0,0,0,2,12.286v4A1.715,1.715,0,0,0,3.714,18h4a1.715,1.715,0,0,0,1.714-1.714Zm7.429,0v4a.57.57,0,0,1-.571.571h-4a.57.57,0,0,1-.571-.571v-4a.57.57,0,0,1,.571-.571h4a.57.57,0,0,1,.571.571Zm-8.571,0v4a.57.57,0,0,1-.571.571h-4a.57.57,0,0,1-.571-.571v-4a.57.57,0,0,1,.571-.571h4a.57.57,0,0,1,.571.571ZM9.429,3.714A1.715,1.715,0,0,0,7.714,2h-4A1.715,1.715,0,0,0,2,3.714v4A1.715,1.715,0,0,0,3.714,9.429h4A1.715,1.715,0,0,0,9.429,7.714Zm8.571,0A1.715,1.715,0,0,0,16.286,2h-4a1.715,1.715,0,0,0-1.714,1.714v4a1.715,1.715,0,0,0,1.714,1.714h4A1.715,1.715,0,0,0,18,7.714Zm-9.714,0v4a.57.57,0,0,1-.571.571h-4a.57.57,0,0,1-.571-.571v-4a.57.57,0,0,1,.571-.571h4a.57.57,0,0,1,.571.571Zm8.571,0v4a.57.57,0,0,1-.571.571h-4a.57.57,0,0,1-.571-.571v-4a.57.57,0,0,1,.571-.571h4a.57.57,0,0,1,.571.571Z" transform="translate(-2 -2)" fill="currentColor" fillRule="evenodd" />
  </svg>
)

const IconPos = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13.79" height="16" viewBox="0 0 13.79 16">
    <g transform="translate(-2.26 0)">
      <path d="M10.69,7H3.26a1.025,1.025,0,0,0-1,1V18.45a1.03,1.03,0,0,0,1,1.05h7.43a1.03,1.03,0,0,0,1.03-1.03V8A1.025,1.025,0,0,0,10.69,7ZM4.94,17.86H3.995v-.95H4.94Zm0-2.355H3.995v-.95H4.94Zm0-2.355H3.995V12.2H4.94Zm2.5,4.71H6.5v-.95h.955Zm0-2.355H6.5v-.95h.955Zm0-2.355H6.5V12.2h.955Zm2.5,4.71H8.99v-.95h.95Zm0-2.355H8.99v-.95h.95Zm0-2.355H8.99V12.2h.95Zm.325-3a.17.17,0,0,1-.165.17H3.835a.17.17,0,0,1-.165-.17V8.795a.165.165,0,0,1,.165-.165H10.13a.165.165,0,0,1,.165.165Zm5.09-1.45H15.13v9.09h.25a.67.67,0,0,0,.67-.67V9.375a.67.67,0,0,0-.695-.675Z" transform="translate(0 -3.5)" fill="currentColor" />
      <rect width="1.465" height="9.095" transform="translate(12.185 5.2)" fill="currentColor" />
      <rect width="0.63" height="9.095" transform="translate(14.06 5.2)" fill="currentColor" />
      <path d="M13.895.895a.89.89,0,0,0-.26-.635A.91.91,0,0,0,13,0a.895.895,0,0,0-.91.895v.53h1.79Zm-2.2,0a.76.76,0,0,1,0-.145.68.68,0,0,1,0-.1h.01A.5.5,0,0,1,11.755.5.43.43,0,0,1,11.79.4a1.2,1.2,0,0,1,.145-.26.5.5,0,0,1,.04-.055L12.045,0H7.995A.815.815,0,0,0,7.18.81V3.03h4.5Z" transform="translate(-2.46)" fill="currentColor" />
    </g>
  </svg>
)

const IconProducts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13.714" viewBox="0 0 16 13.714">
    <g transform="translate(-2 -4)">
      <path d="M17.429,4H2.571A.571.571,0,0,0,2,4.571V8a.571.571,0,0,0,.571.571h.571v8.571a.571.571,0,0,0,.571.571H16.286a.571.571,0,0,0,.571-.571V8.571h.571A.571.571,0,0,0,18,8V4.571A.571.571,0,0,0,17.429,4ZM15.714,16.571H4.286v-8H15.714Zm1.143-9.143H3.143V5.143H16.857Z" fill="currentColor" />
      <path d="M12.571,15.143H16A.571.571,0,0,0,16,14H12.571a.571.571,0,0,0,0,1.143Z" transform="translate(-4.286 -4.286)" fill="currentColor" />
    </g>
  </svg>
)

const IconPreorder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.002" viewBox="0 0 16 16.002">
    <path d="M14072,894a8,8,0,1,1,8,8A8.011,8.011,0,0,1,14072,894Zm1,0a7,7,0,1,0,7-7A7.007,7.007,0,0,0,14073,894Zm10.652,3.674-3.2-2.781a1,1,0,0,1-.953-1.756V889.5a.5.5,0,1,1,1,0v3.634a1,1,0,0,1,.5.863c0,.015,0,.029,0,.044l3.311,2.876a.5.5,0,0,1,.05.7.5.5,0,0,1-.708.049Z" transform="translate(-14072 -885.998)" fill="currentColor" />
  </svg>
)

const IconNotes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.001" viewBox="0 0 16 16.001">
    <path d="M.333,16A.315.315,0,0,1,0,15.668V.335A.315.315,0,0,1,.333,0h9.31a.285.285,0,0,1,.123.014A.318.318,0,0,1,9.9.1l2.667,2.667.009.01a.293.293,0,0,1,.079.132.274.274,0,0,1,.012.112V5.835l1.267-1.267a.322.322,0,0,1,.466,0l1.5,1.5a.322.322,0,0,1,0,.466L12.667,9.768v5.9a.315.315,0,0,1-.333.333Zm.334-.666H12v-4.9L9.133,13.3a.3.3,0,0,1-.233.1H8.882L6.4,14.468a.2.2,0,0,1-.133.033.332.332,0,0,1-.3-.466l.589-1.368H2.667a.333.333,0,0,1,0-.667H6.843l.258-.6a.321.321,0,0,1,.176-.177L8.5,10H2.667a.333.333,0,0,1,0-.667h6.5L12,6.5V3.335H9.667A.315.315,0,0,1,9.333,3V.668H.667Zm6.233-1.8,1.4-.6-.8-.8-.1.239a.323.323,0,0,1-.074.172Zm2-.967,6.3-6.3-.283-.283-6.3,6.3ZM7.867,11.534l.284.284,6.3-6.3-.283-.283L12.624,6.777a.291.291,0,0,1-.115.115L9.558,9.844a.291.291,0,0,1-.115.115ZM10,2.668h1.533L10.767,1.9,10,1.135ZM2.667,7.335a.333.333,0,0,1,0-.667H10a.333.333,0,1,1,0,.667Zm0-2.668a.333.333,0,1,1,0-.666H10a.333.333,0,1,1,0,.666Z" fill="currentColor" />
  </svg>
)

const IconAuction = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15.964" height="16" viewBox="0 0 15.964 16">
    <path d="M4.993,20.456a.456.456,0,0,0,.456.456h8.389a.456.456,0,0,0,.456-.456V19.009a1.256,1.256,0,0,0-1.254-1.254h-.2V16.32a.456.456,0,0,0-.456-.456H6.9a.456.456,0,0,0-.456.456v1.435h-.2a1.255,1.255,0,0,0-1.254,1.254Zm2.363-3.68H11.93v.979H7.356ZM5.905,19.009a.342.342,0,0,1,.342-.342H13.04a.342.342,0,0,1,.342.342V20H5.905Zm13.717-1.79a1.405,1.405,0,0,0,1.334-1.4,1.411,1.411,0,0,0-.461-1.042l-4.466-4.009L17.6,9.031a.831.831,0,0,0-.06-1.172L14.513,5.127a.816.816,0,0,0-.6-.213.824.824,0,0,0-.574.272L8.27,10.8a.83.83,0,0,0,.059,1.173L11.354,14.7a.83.83,0,0,0,1.172-.06l1.622-1.795,4.464,4.008a1.392,1.392,0,0,0,1.011.361ZM13.779,11.9l0,0,0,0L11.9,13.972,9,11.35l4.961-5.492,2.9,2.622L13.779,11.9Zm.981.275.658-.728,4.466,4.008a.492.492,0,1,1-.661.728Z" transform="translate(-4.993 -4.912)" fill="currentColor" />
  </svg>
)

const IconWholesale = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M1.2,14.236a1.762,1.762,0,0,1,1.2-1.657V2c0-.325-.268-.823-.6-.823H.6C.268,1.176,0,1.031,0,.7V.647A.645.645,0,0,1,.6,0H2.4A1.407,1.407,0,0,1,3.6,1.41v9.65h10a1.4,1.4,0,0,1,1.2,1.518,1.757,1.757,0,0,1,1.165,2.01,1.8,1.8,0,0,1-3.566-.353,1.761,1.761,0,0,1,1.2-1.656v-.342H3.6v.342a1.754,1.754,0,0,1,1.165,2.01A1.784,1.784,0,0,1,3.338,15.97,1.927,1.927,0,0,1,3,16,1.782,1.782,0,0,1,1.2,14.236Zm12.4,0a.594.594,0,0,0,.6.588h0a.6.6,0,0,0,.6-.589c0-.389-.272-.5-.6-.617C13.872,13.732,13.6,13.846,13.6,14.235Zm-11.2,0a.6.6,0,0,0,.6.588H3a.6.6,0,0,0,.6-.589c0-.389-.272-.5-.6-.617C2.671,13.732,2.4,13.846,2.4,14.235Zm4.216-4.158A1.615,1.615,0,0,1,5,8.462V6.692A1.615,1.615,0,0,1,6.615,5.077h5.77A1.616,1.616,0,0,1,14,6.692V8.462a1.616,1.616,0,0,1-1.616,1.615ZM6.234,6.311a.542.542,0,0,0-.157.382V8.462A.538.538,0,0,0,6.615,9h5.77a.538.538,0,0,0,.538-.538V6.692a.536.536,0,0,0-.538-.538H6.612A.535.535,0,0,0,6.234,6.311ZM5.473,3.527A1.617,1.617,0,0,1,5,2.385V1.616A1.615,1.615,0,0,1,6.615,0H9.384A1.616,1.616,0,0,1,11,1.616v.769A1.615,1.615,0,0,1,9.384,4H6.612A1.614,1.614,0,0,1,5.473,3.527Zm.761-2.293a.542.542,0,0,0-.157.382v.769a.538.538,0,0,0,.538.538H9.384a.538.538,0,0,0,.539-.538V1.616a.542.542,0,0,0-.157-.382.536.536,0,0,0-.382-.157H6.612A.535.535,0,0,0,6.234,1.234Z" fill="currentColor" />
  </svg>
)

const IconSales = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15.997" height="16" viewBox="0 0 15.997 16">
    <g transform="translate(-2 -1.994)">
      <path d="M4.857,12.571H3.714A1.714,1.714,0,0,0,2,14.285V20.57a1.714,1.714,0,0,0,1.714,1.714H4.857A1.714,1.714,0,0,0,6.571,20.57V14.285a1.714,1.714,0,0,0-1.714-1.714Zm.571,8a.571.571,0,0,1-.571.571H3.714a.571.571,0,0,1-.571-.571V14.285a.571.571,0,0,1,.571-.571H4.857a.571.571,0,0,1,.571.571Zm5.142-6.284H9.427A1.714,1.714,0,0,0,7.713,16V20.57a1.714,1.714,0,0,0,1.714,1.714H10.57a1.714,1.714,0,0,0,1.714-1.714V16A1.714,1.714,0,0,0,10.57,14.285Zm.571,6.284a.571.571,0,0,1-.571.571H9.427a.571.571,0,0,1-.571-.571V16a.571.571,0,0,1,.571-.571H10.57a.571.571,0,0,1,.571.571ZM16.283,12H15.14a1.714,1.714,0,0,0-1.714,1.714V20.57a1.714,1.714,0,0,0,1.714,1.714h1.143A1.714,1.714,0,0,0,18,20.57V13.714A1.714,1.714,0,0,0,16.283,12Zm.571,8.57a.571.571,0,0,1-.571.571H15.14a.571.571,0,0,1-.571-.571V13.714a.571.571,0,0,1,.571-.571h1.143a.571.571,0,0,1,.571.571Z" transform="translate(0 -4.289)" fill="currentColor" />
      <path d="M17.947,2.548a.571.571,0,0,0-.366-.24l-1.588-.3a.571.571,0,1,0-.213,1.122l.093.018L11.233,5.932l-5.45-2.18a.572.572,0,1,0-.424,1.062L11.072,7.1a.571.571,0,0,0,.506-.041L16.68,4l-.067.354a.571.571,0,0,0,.457.668.579.579,0,0,0,.107.01.571.571,0,0,0,.56-.465l.3-1.588A.568.568,0,0,0,17.947,2.548Z" transform="translate(-1.286)" fill="currentColor" />
    </g>
  </svg>
)

const IconDeliveryBoy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M12.406,9.375h-.625v-.84a3.28,3.28,0,0,0,1.406-2.691V4.375h2.344a.469.469,0,0,0,0-.937H13.5a3.594,3.594,0,0,0-7.184.156v.313a.469.469,0,0,0,.313.442v1.5A3.28,3.28,0,0,0,8.031,8.535v.84H7.406a3.605,3.605,0,0,0-2.113.688H1.406a.469.469,0,0,0-.419.259L.049,12.2h0a.466.466,0,0,0-.05.209v3.125A.469.469,0,0,0,.469,16H15.531A.469.469,0,0,0,16,15.531V12.969A3.6,3.6,0,0,0,12.406,9.375ZM9.906.938a2.66,2.66,0,0,1,2.652,2.5h-5.3A2.66,2.66,0,0,1,9.906.938ZM7.562,5.844V4.375H12.25V5.844a2.344,2.344,0,0,1-4.688,0ZM9.906,9.125a3.271,3.271,0,0,0,.938-.137V10a.938.938,0,0,1-1.875,0V8.988A3.27,3.27,0,0,0,9.906,9.125ZM1.7,11H5.554l.469.938h-4.8ZM.937,12.875H6.312v2.188H.937Zm14.125,2.188H7.25V12.406A.466.466,0,0,0,7.2,12.2h0l-.836-1.672a2.638,2.638,0,0,1,1.042-.212h.652a1.875,1.875,0,0,0,3.7,0h.652a2.659,2.659,0,0,1,2.656,2.656Z" fill="currentColor" />
    <path d="M376.719,405h-1.25a.469.469,0,0,0,0,.938h1.25a.469.469,0,0,0,0-.937Z" transform="translate(-363.281 -392.344)" fill="currentColor" />
  </svg>
)

const IconRefunds = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M19.25,11.25a8.031,8.031,0,0,1-15.995,1,.688.688,0,0,1,1.365-.169A6.643,6.643,0,1,0,7.112,6.039h.866a.686.686,0,1,1,0,1.371H5.384A.687.687,0,0,1,4.7,6.724V4.138a.688.688,0,0,1,1.376,0v.987A8.024,8.024,0,0,1,19.25,11.25ZM11.278,6.907a.687.687,0,0,0-.688.686v.253a2.053,2.053,0,0,0-1.824,2.247,2.146,2.146,0,0,0,2.175,1.842h.8a.686.686,0,1,1,0,1.371h-1.6a.686.686,0,1,0,0,1.371h.458v.229a.688.688,0,0,0,1.376,0v-.26a2.113,2.113,0,0,0,1.824-1.811,2.062,2.062,0,0,0-2.053-2.272h-.917a.686.686,0,1,1,0-1.371h1.609a.686.686,0,1,0,0-1.371h-.462V7.593A.687.687,0,0,0,11.278,6.907Z" transform="translate(-3.25 -3.25)" fill="currentColor" />
  </svg>
)

const IconCustomers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M8,10.667A2.667,2.667,0,1,1,10.667,8,2.667,2.667,0,0,1,8,10.667Zm0-4A1.333,1.333,0,1,0,9.333,8,1.333,1.333,0,0,0,8,6.667Zm4,8.667a4,4,0,1,0-8,0,.667.667,0,0,0,1.333,0,2.667,2.667,0,1,1,5.333,0,.667.667,0,0,0,1.333,0Zm0-10a2.667,2.667,0,1,1,2.667-2.667A2.667,2.667,0,0,1,12,5.333Zm0-4a1.333,1.333,0,1,0,1.333,1.333A1.333,1.333,0,0,0,12,1.333ZM16,10a4,4,0,0,0-4-4,.667.667,0,0,0,0,1.333A2.667,2.667,0,0,1,14.667,10,.667.667,0,1,0,16,10ZM4,5.333A2.667,2.667,0,1,1,6.667,2.667,2.667,2.667,0,0,1,4,5.333Zm0-4A1.333,1.333,0,1,0,5.333,2.667,1.333,1.333,0,0,0,4,1.333ZM1.333,10A2.667,2.667,0,0,1,4,7.333.667.667,0,0,0,4,6a4,4,0,0,0-4,4,.667.667,0,0,0,1.333,0Z" fill="currentColor" />
  </svg>
)

const IconSellers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M19,9.625a.638.638,0,0,0-.079-.307l-2.779-5A.614.614,0,0,0,15.606,4H6.394a.614.614,0,0,0-.536.318l-2.779,5A.638.638,0,0,0,3,9.625a2.5,2.5,0,0,0,1.231,2.153V18.75A1.24,1.24,0,0,0,5.462,20H9.08a1.24,1.24,0,0,0,1.231-1.25V16.058a.759.759,0,0,1,.615-.773.684.684,0,0,1,.534.176.706.706,0,0,1,.229.521V18.75A1.24,1.24,0,0,0,12.92,20h3.618a1.24,1.24,0,0,0,1.231-1.25V11.777A2.5,2.5,0,0,0,19,9.625Zm-1.239.149a1.23,1.23,0,0,1-2.453-.149.578.578,0,0,0-.017-.086.548.548,0,0,0-.006-.084L14.114,5.25h1.132ZM9.164,5.25h1.22V9.625a1.23,1.23,0,0,1-2.455.063Zm2.451,0h1.22l1.235,4.437a1.23,1.23,0,0,1-2.455-.062Zm-4.862,0H7.886l-1.169,4.2a.548.548,0,0,0-.006.084.578.578,0,0,0-.018.086,1.23,1.23,0,0,1-2.453.149Zm9.785,13.5H12.92V15.981a1.964,1.964,0,0,0-.635-1.446,1.9,1.9,0,0,0-1.482-.491A2,2,0,0,0,9.08,16.061V18.75H5.462V12.125a2.439,2.439,0,0,0,1.846-.848A2.419,2.419,0,0,0,11,11.261a2.419,2.419,0,0,0,3.692.016,2.439,2.439,0,0,0,1.846.848Z" transform="translate(-3 -4)" fill="currentColor" />
  </svg>
)

const IconUploadedFiles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-0.53 -0.53)">
      <path d="M3.386.53A2.862,2.862,0,0,0,.53,3.386V13.67a2.865,2.865,0,0,0,2.856,2.86H13.67a2.869,2.869,0,0,0,2.86-2.86V3.386A2.865,2.865,0,0,0,13.67.53Zm0,1.143H13.67a1.7,1.7,0,0,1,1.718,1.713V13.67a1.7,1.7,0,0,1-1.718,1.718H3.386A1.7,1.7,0,0,1,1.673,13.67V3.386A1.7,1.7,0,0,1,3.386,1.673ZM8.12,3.557,5.34,6.37a.572.572,0,0,0,0,.809.564.564,0,0,0,.81,0l1.8-1.824V10.8a.571.571,0,0,0,1.143,0V5.347l1.8,1.829a.571.571,0,0,0,.81-.806L8.935,3.557a.511.511,0,0,0-.815,0Zm-4.156,8.97a.571.571,0,0,0,0,1.143h9.128a.571.571,0,0,0,0-1.143Z" fill="currentColor" />
    </g>
  </svg>
)

const IconReports = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M16,16H2a2,2,0,0,1-2-2V0H1.333V14A.667.667,0,0,0,2,14.667H16Z" fill="currentColor" />
    <rect width="1.333" height="6" transform="translate(9.333 7.333)" fill="currentColor" />
    <rect width="1.333" height="6" transform="translate(4 7.333)" fill="currentColor" />
    <rect width="1.333" height="9.333" transform="translate(12 4)" fill="currentColor" />
    <rect width="1.333" height="9.333" transform="translate(6.667 4)" fill="currentColor" />
  </svg>
)

const IconBlog = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M9.688,16H3.75A3.754,3.754,0,0,1,0,12.25V3.75A3.754,3.754,0,0,1,3.75,0h8.5A3.754,3.754,0,0,1,16,3.75V9.734a.625.625,0,0,1-1.25,0V3.75a2.5,2.5,0,0,0-2.5-2.5H3.75a2.5,2.5,0,0,0-2.5,2.5v8.5a2.5,2.5,0,0,0,2.5,2.5H9.688a.625.625,0,0,1,0,1.25ZM12.875,3.938a.625.625,0,0,0-.625-.625H6.531a.625.625,0,0,0,0,1.25H12.25A.625.625,0,0,0,12.875,3.938Zm0,2.5a.625.625,0,0,0-.625-.625H3.75a.625.625,0,0,0,0,1.25h8.5A.625.625,0,0,0,12.875,6.438Zm-6.25,2.5A.625.625,0,0,0,6,8.313H3.75a.625.625,0,0,0,0,1.25H6A.625.625,0,0,0,6.625,8.938Zm-3.5-5.062a.781.781,0,1,0,.781-.781A.781.781,0,0,0,3.125,3.875ZM15.332,15.332a2.284,2.284,0,0,0,0-3.226L13.141,9.915a4.506,4.506,0,0,0-2.31-1.236L9.06,8.325a.625.625,0,0,0-.735.735l.354,1.771a4.506,4.506,0,0,0,1.236,2.31l2.191,2.191a2.281,2.281,0,0,0,3.226,0ZM10.586,9.9a3.259,3.259,0,0,1,1.671.894l2.191,2.191a1.031,1.031,0,1,1-1.458,1.458L10.8,12.257A3.26,3.26,0,0,1,9.9,10.586l-.17-.852Z" fill="currentColor" />
  </svg>
)

const IconMarketing = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(0 -4.027)">
      <path d="M38.286,16.393a.555.555,0,0,1-.344-.119L34.032,13.2a.557.557,0,0,1-.213-.438v-5.1a.556.556,0,0,1,.212-.438l3.91-3.074a.557.557,0,0,1,.9.438V15.836a.556.556,0,0,1-.556.557Zm-3.354-3.9,2.8,2.2V5.73l-2.8,2.2Z" transform="translate(-25.364 0)" fill="currentColor" />
      <path d="M9.011,22.556H3.093a3.1,3.1,0,0,1,0-6.192H9.011a.557.557,0,0,1,.557.557V22A.557.557,0,0,1,9.011,22.556ZM3.093,17.478a1.982,1.982,0,0,0,0,3.964H8.455V17.478Z" transform="translate(0 -9.25)" fill="currentColor" />
      <path d="M10.2,31.9a1.895,1.895,0,0,1-1.847-1.5l-.974-5.455a.557.557,0,1,1,1.089-.229l.975,5.455a.777.777,0,1,0,1.521-.32l-.824-4.74a.557.557,0,1,1,1.089-.229l.824,4.74A1.894,1.894,0,0,1,10.2,31.9Zm8.487-7.6h-.862a.557.557,0,0,1,0-1.114h.862a1.105,1.105,0,0,0,1.1-1.105,1.106,1.106,0,0,0-1.1-1.105h-.862a.557.557,0,0,1,0-1.114h.862a2.22,2.22,0,0,1,1.566,3.79A2.2,2.2,0,0,1,18.683,24.3Z" transform="translate(-4.9 -11.875)" fill="currentColor" />
    </g>
  </svg>
)

const IconMarketingAnalytics = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M5.5,16a.625.625,0,0,1,0-1.25H7.375V13.5H2.5A2.5,2.5,0,0,1,0,11V2.5A2.5,2.5,0,0,1,2.5,0h11A2.5,2.5,0,0,1,16,2.5V11a2.5,2.5,0,0,1-2.5,2.5h-3a.625.625,0,0,1,0-1.25h3A1.251,1.251,0,0,0,14.75,11V2.5A1.251,1.251,0,0,0,13.5,1.25H2.5A1.251,1.251,0,0,0,1.25,2.5V11A1.251,1.251,0,0,0,2.5,12.25H8a.625.625,0,0,1,.625.626V14.75H10.5a.625.625,0,1,1,0,1.25ZM2.377,9.539a1.105,1.105,0,0,1-.03-1.2,1.126,1.126,0,0,1,1.206-.495.988.988,0,0,1,.136.04L4.866,6.826l.5-.447a1.113,1.113,0,0,1,.322-1.087,1.13,1.13,0,0,1,1.245-.176,1.1,1.1,0,0,1,.607.9.434.434,0,0,1,.007.088.68.68,0,0,1-.006.09L9,7.1a1.1,1.1,0,0,1,.864-.13l.051-.057L11.169,5.5l.516-.578a1.136,1.136,0,0,1,.209-1.131,1.1,1.1,0,0,1,1.162-.319,1.13,1.13,0,0,1,.765.97.439.439,0,0,1,.006.084,1.124,1.124,0,0,1-.816,1.067,1.1,1.1,0,0,1-.578,0l-.052.059L11.122,7.059l-.52.584a1.156,1.156,0,0,1,.074.332.432.432,0,0,1,0,.059h0a.467.467,0,0,1,0,.078,1.122,1.122,0,0,1-.812.989A1.106,1.106,0,0,1,8.739,8.76a1.175,1.175,0,0,1-.27-.657.955.955,0,0,1,0-.154l-1.455-.9a1.193,1.193,0,0,1-.511.159,1,1,0,0,1-.474-.074L4.856,8.187l-.5.448a1.155,1.155,0,0,1,.042.281.469.469,0,0,1-.008.1,1.1,1.1,0,0,1-1.1,1.009,1.136,1.136,0,0,1-.913-.486Z" fill="currentColor" />
  </svg>
)

const IconAIStudio = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M47.948,55.953h-2.4a1.8,1.8,0,0,0-1.8,1.8V65.33a1.8,1.8,0,0,0,1.8,1.8h7.575a1.8,1.8,0,0,0,1.8-1.8V62.159l1.082-.742v3.913a2.886,2.886,0,0,1-2.885,2.885H45.552a2.886,2.886,0,0,1-2.885-2.885V57.756a2.885,2.885,0,0,1,2.885-2.886h3.03Z" transform="translate(-41.334 -53.155)" fill="currentColor" fillRule="evenodd" />
    <path d="M256.718,0a.206.206,0,0,1,.2.164,4.667,4.667,0,0,0,1.267,2.323,4.667,4.667,0,0,0,2.323,1.267.2.2,0,0,1,0,.4,4.691,4.691,0,0,0-3.6,3.624.2.2,0,0,1-.384,0,4.691,4.691,0,0,0-3.631-3.631.2.2,0,0,1,0-.384,4.667,4.667,0,0,0,2.357-1.275A4.667,4.667,0,0,0,256.519.164a.205.205,0,0,1,.2-.164Z" transform="translate(-244.838 0)" fill="currentColor" fillRule="evenodd" />
  </svg>
)

const IconSupport = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M16,9.125a3.122,3.122,0,0,0-1.255-2.5,6.9,6.9,0,0,0-1.94-4.6,6.725,6.725,0,0,0-9.61,0,6.9,6.9,0,0,0-1.94,4.6,3.124,3.124,0,0,0,1.87,5.627h1.25A.625.625,0,0,0,5,11.625v-5A.625.625,0,0,0,4.375,6H3.125a3.129,3.129,0,0,0-.569.052,5.487,5.487,0,0,1,10.887,0A3.129,3.129,0,0,0,12.875,6h-1.25A.625.625,0,0,0,11,6.625v5a.625.625,0,0,0,.625.625h.625v.625a1.877,1.877,0,0,1-1.875,1.875H8A.625.625,0,0,0,8,16h2.375A3.129,3.129,0,0,0,13.5,12.875v-.688A3.13,3.13,0,0,0,16,9.125ZM3.75,7.25V11H3.125a1.875,1.875,0,0,1,0-3.75ZM12.875,11H12.25V7.25h.625a1.875,1.875,0,1,1,0,3.75Z" fill="currentColor" />
    <path d="M197.875,113.25a.626.626,0,0,1,.625.625.618.618,0,0,1-.137.391,4.365,4.365,0,0,0-1.113,2.746v.613a.625.625,0,0,0,1.25,0v-.613a3.186,3.186,0,0,1,.838-1.964A1.875,1.875,0,1,0,196,113.875a.625.625,0,0,0,1.25,0A.626.626,0,0,1,197.875,113.25Z" transform="translate(-189.875 -108.5)" fill="currentColor" />
    <circle cx="0.625" cy="0.625" r="0.625" transform="translate(7.375 11)" fill="currentColor" />
  </svg>
)

// Red "addon" badge icon (premium/paid module marker), exact source SVG
const AddonBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14.001" viewBox="0 0 16 14.001" className="mx-2 flex-shrink-0">
    <path d="M-19322,3342.5v-5a2.007,2.007,0,0,0-2-2v1.5a3,3,0,0,1-3,3h-4v-10h4a3,3,0,0,1,3,3v1.5a3,3,0,0,1,3,3v5a.506.506,0,0,1-.5.5A.5.5,0,0,1-19322,3342.5Zm-11-2V3339h-3a1,1,0,0,1-1-1,1,1,0,0,1,1-1h3v-7.5a.5.5,0,0,1,.5-.5.5.5,0,0,1,.5.5v11a.5.5,0,0,1-.5.5A.506.506,0,0,1-19333,3340.5Zm-3-7.5a1,1,0,0,1-1-1,1,1,0,0,1,1-1h3v2Z" transform="translate(19337 -3329)" fill="#f51350" />
  </svg>
)

const ChevronArrow = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" className={`ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
    <path d="M2,1 L6,4 L2,7" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M176.921-769.231l6.255-6.255a5.99,5.99,0,0,0,1.733.949,5.687,5.687,0,0,0,1.885.329,5.317,5.317,0,0,0,3.9-1.608,5.31,5.31,0,0,0,1.609-3.9,5.322,5.322,0,0,0-1.608-3.9,5.306,5.306,0,0,0-3.9-1.611,5.321,5.321,0,0,0-3.9,1.609,5.312,5.312,0,0,0-1.611,3.9,5.554,5.554,0,0,0,.35,1.946,6.043,6.043,0,0,0,.929,1.672l-6.255,6.255Zm9.874-5.82a4.51,4.51,0,0,1-3.317-1.352,4.51,4.51,0,0,1-1.352-3.317,4.51,4.51,0,0,1,1.352-3.317,4.51,4.51,0,0,1,3.317-1.352,4.51,4.51,0,0,1,3.317,1.352,4.51,4.51,0,0,1,1.352,3.317,4.51,4.51,0,0,1-1.352,3.317A4.51,4.51,0,0,1,186.8-775.051Z" transform="translate(-176.307 785.231)" fill="#4e5767" />
  </svg>
)

// All menu items definition (used for both rendering and search) 

const MENU_ITEMS = [
  { icon: <IconDashboard />, label: 'Dashboard', to: '/admin/dashboard', exact: true },
  {
    icon: <IconProducts />, label: 'Products', hasSubmenu: true,
    subItems: [
      { label: 'Add New Product',          to: '/admin/products/create' },
      { label: 'All products',             to: '/admin/products/all' },
      { label: 'In House Products',        to: '/admin/products/in-house' },
      { label: 'Seller Product',           to: '/admin/products/seller' },
      { label: 'Category',                 to: '/admin/categories/all' },
      { label: 'Brand',                    to: '/admin/brands/all' },
      { label: 'Product Reviews',          to: '/admin/reviews' },
    ],
  },
  {
    icon: <IconSales />, label: 'Sales', hasSubmenu: true,
    subItems: [
      { label: 'All Orders',           to: '/admin/sales/all' },
      { label: 'Inhouse orders',       to: '/admin/sales/inhouse' },
      { label: 'Seller Orders',        to: '/admin/sales/seller' },
      { label: 'Pickup Point Orders',  to: '/admin/sales/pickup-point' },
      { label: 'Unpaid Orders',        to: '/admin/sales/unpaid' },
    ],
  },
  {
    icon: <IconCustomers />, label: 'Customers', hasSubmenu: true,
    subItems: [
      { label: 'Customer list', to: '/admin/customers/list' },
    ],
  },
  {
    icon: <IconSellers />, label: 'Sellers', hasSubmenu: true,
    subItems: [
      { label: 'All Seller',                to: '/admin/sellers/list' },
      { label: 'Applied Seller',            to: '/admin/sellers/applied' },
      { label: 'Seller Rating & Followers', to: '/admin/sellers/rating' },
    ],
  },
  {
    icon: <IconBlog />, label: 'Blog System', hasSubmenu: true,
    subItems: [
      { label: 'All Posts',   to: '/admin/blog/posts' },
      { label: 'Categories',  to: '/admin/blog/categories' },
    ],
  },
]

// Single nav item with optional submenu

function NavItem({ icon, label, to, addon, hasSubmenu, subItems, exact, forceOpen }) {
  // Default open = true so all submenus start expanded
  const [open, setOpen] = useState(true)
  const location = useLocation()

  if (hasSubmenu) {
    const childActive = Array.isArray(subItems) && subItems.some((s) => s.to && location.pathname.toLowerCase().startsWith(s.to.toLowerCase()))
    // forceOpen is set during search; otherwise use local open state or childActive
    const isOpen = forceOpen !== undefined ? forceOpen : (open || childActive)

    return (
      <li className="block">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setOpen((o) => !o) }}
          className={`flex items-center px-[20px] py-[9px] text-[13px] leading-[20px] font-normal hover:bg-[#0e1019] hover:text-white cursor-pointer ${isOpen || childActive ? 'bg-[#0e1019] text-white' : 'text-[#9da3ae]'}`}
        >
          <span className={`w-[16px] h-[16px] flex items-center justify-center mr-[14px] flex-shrink-0 ${isOpen || childActive ? 'text-white' : 'text-[#575b6a]'}`}>{icon}</span>
          <span className="text-[13px] leading-[20px] flex-1">{label}</span>
          {addon && <AddonBadge />}
          <ChevronArrow open={isOpen} />
        </a>
        {isOpen && subItems && (
          <ul className="bg-[#161a26] py-1">
            {subItems.map((s) => {
              const inner = ({ isActive }) => (
                <span className="flex items-center">
                  <span className={`inline-block w-[5px] h-[5px] rounded-full mr-[12px] flex-shrink-0 ${isActive ? 'bg-white' : 'border border-[#4e5767]'}`} />
                  <span>{s.label}</span>
                </span>
              )
              return (
                <li key={s.label}>
                  {s.to ? (
                    <NavLink to={s.to}
                      className={({ isActive }) =>
                        `block pl-[34px] pr-[20px] py-[7px] text-[12px] leading-[18px] hover:text-white hover:bg-[#0e1019] ${isActive ? 'text-white font-medium' : 'text-[#9da3ae]'}`
                      }
                    >
                      {inner}
                    </NavLink>
                  ) : (
                    <a href="#" className="block pl-[34px] pr-[20px] py-[7px] text-[12px] leading-[18px] text-[#9da3ae] hover:text-white hover:bg-[#0e1019]">
                      {inner({ isActive: false })}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  // Plain link item
  return (
    <li className="block">
      <NavLink
        to={to}
        end={exact}
        className={({ isActive }) =>
          `flex items-center px-[20px] py-[9px] text-[13px] leading-[20px] font-normal hover:bg-[#0e1019] hover:text-white ${
            isActive ? 'bg-[#0e1019] text-white' : 'text-[#9da3ae]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={`w-[16px] h-[16px] flex items-center justify-center mr-[14px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#575b6a]'}`}>
              {icon}
            </span>
            <span className="text-[13px] leading-[20px] flex-1">{label}</span>
            {addon && <AddonBadge />}
          </>
        )}
      </NavLink>
    </li>
  )
}

// Search-filtered menu renderer

function FilteredMenu({ query }) {
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return MENU_ITEMS

    return MENU_ITEMS.reduce((acc, item) => {
      // Parent label matches → show parent with all its children expanded
      if (item.label.toLowerCase().includes(q)) {
        acc.push({ ...item, _forceOpen: true })
        return acc
      }
      // Check children
      if (item.hasSubmenu) {
        const matchedSubs = (item.subItems || []).filter(s =>
          s.label.toLowerCase().includes(q)
        )
        if (matchedSubs.length > 0) {
          acc.push({ ...item, subItems: matchedSubs, _forceOpen: true })
        }
      }
      return acc
    }, [])
  }, [q])

  if (filtered.length === 0) {
    return (
      <li className="px-[20px] py-[12px] text-[12px] text-[#4e5767]">No results found.</li>
    )
  }

  return filtered.map((item) => (
    <NavItem
      key={item.label}
      icon={item.icon}
      label={item.label}
      to={item.to}
      addon={item.addon}
      hasSubmenu={item.hasSubmenu}
      subItems={item.subItems}
      exact={item.exact}
      forceOpen={item._forceOpen}
    />
  ))
}

// Main Sidebar Export

export default function AdminSidebar({ open = true, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-[260px] bg-[#1b2133] flex flex-col flex-shrink-0 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-[20px] py-[14px] flex items-center min-h-[60px]">
          <NavLink to="/" className="flex items-center text-left">
            <img
              className="max-w-full h-auto"
              src="https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/mPdWKtL45hXAENvO1mo5gXDTQUz2ZICs3VZgtBCh.svg"
              alt="Active eCommerce CMS"
            />
          </NavLink>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#3a3f4f] [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Search */}
          <div className="px-[12px] mb-[12px] relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in menu"
              className="w-full bg-transparent border border-[#2d3142] rounded-[6px] text-white text-[14px] leading-[20px] placeholder:text-[#4e5767] px-[12px] py-[7px] focus:outline-none focus:border-[#3a3f4f]"
            />
            <span className="absolute right-[24px] top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
          </div>

          {/* Menu */}
          <ul className="list-none p-0 m-0">
            <FilteredMenu query={searchQuery} />
          </ul>
        </div>
      </aside>
    </>
  )
}