import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Inline SVG Icons

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(3495.144 -602)">
      <path d="M15.3,5.4,9.561.481A2,2,0,0,0,8.26,0H7.74a2,2,0,0,0-1.3.481L.7,5.4A2,2,0,0,0,0,6.92V14a2,2,0,0,0,2,2H14a2,2,0,0,0,2-2V6.92A2,2,0,0,0,15.3,5.4M10,15H6V9A1,1,0,0,1,7,8H9a1,1,0,0,1,1,1Zm5-1a1,1,0,0,1-1,1H11V9A2,2,0,0,0,9,7H7A2,2,0,0,0,5,9v6H2a1,1,0,0,1-1-1V6.92a1,1,0,0,1,.349-.76l5.74-4.92A1,1,0,0,1,7.74,1h.52a1,1,0,0,1,.651.24l5.74,4.92A1,1,0,0,1,15,6.92Z" transform="translate(-3495.144 602)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconPurchaseHistory = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-27.466 -542.963)">
      <path d="M14.5,5.963h-4a1.5,1.5,0,0,0,0,3h4a1.5,1.5,0,0,0,0-3m0,2h-4a.5.5,0,0,1,0-1h4a.5.5,0,0,1,0,1" transform="translate(22.966 537)" fill="#b5b5bf" />
      <path d="M12.991,8.963a.5.5,0,0,1,0-1H13.5a2.5,2.5,0,0,1,2.5,2.5v10a2.5,2.5,0,0,1-2.5,2.5H2.5a2.5,2.5,0,0,1-2.5-2.5v-10a2.5,2.5,0,0,1,2.5-2.5h.509a.5.5,0,0,1,0,1H2.5a1.5,1.5,0,0,0-1.5,1.5v10a1.5,1.5,0,0,0,1.5,1.5h11a1.5,1.5,0,0,0,1.5-1.5v-10a1.5,1.5,0,0,0-1.5-1.5Z" transform="translate(27.466 536)" fill="#b5b5bf" />
      <path d="M7.5,15.963h1a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5" transform="translate(23.966 532)" fill="#b5b5bf" />
      <path d="M7.5,21.963h1a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5" transform="translate(23.966 529)" fill="#b5b5bf" />
      <path d="M7.5,27.963h1a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5" transform="translate(23.966 526)" fill="#b5b5bf" />
      <path d="M13.5,16.963h5a.5.5,0,0,1,0,1h-5a.5.5,0,0,1,0-1" transform="translate(20.966 531.5)" fill="#b5b5bf" />
      <path d="M13.5,22.963h5a.5.5,0,0,1,0,1h-5a.5.5,0,0,1,0-1" transform="translate(20.966 528.5)" fill="#b5b5bf" />
      <path d="M13.5,28.963h5a.5.5,0,0,1,0,1h-5a.5.5,0,0,1,0-1" transform="translate(20.966 525.5)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconPreorder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.002" viewBox="0 0 16 16.002">
    <path d="M14072,894a8,8,0,1,1,8,8A8.011,8.011,0,0,1,14072,894Zm1,0a7,7,0,1,0,7-7A7.007,7.007,0,0,0,14073,894Zm10.652,3.674-3.2-2.781a1,1,0,0,1-.953-1.756V889.5a.5.5,0,1,1,1,0v3.634a1,1,0,0,1,.5.863c0,.015,0,.029,0,.044l3.311,2.876a.5.5,0,0,1,.05.7.5.5,0,0,1-.708.049Z" transform="translate(-14072 -885.998)" fill="#b5b5bf" />
  </svg>
)

const IconDownloads = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
    <g transform="translate(-1388.154 -562.604)">
      <path d="M77.864,98.69V92.1a.5.5,0,1,0-1,0V98.69l-1.437-1.437a.5.5,0,0,0-.707.707l1.851,1.852a1,1,0,0,0,.707.293h.172a1,1,0,0,0,.707-.293l1.851-1.852a.5.5,0,0,0-.7-.713Z" transform="translate(1318.79 478.5)" fill="#b5b5bf" />
      <path d="M67.155,88.6a3,3,0,0,1-.474-5.963q-.009-.089-.015-.179a5.5,5.5,0,0,1,10.977-.718,3.5,3.5,0,0,1-.989,6.859h-1.5a.5.5,0,0,1,0-1l1.5,0a2.5,2.5,0,0,0,.417-4.967.5.5,0,0,1-.417-.5,4.5,4.5,0,1,0-8.908.866.512.512,0,0,1,.009.121.5.5,0,0,1-.52.479,2,2,0,1,0-.162,4l.081,0h2a.5.5,0,0,1,0,1Z" transform="translate(1324 486)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconRefund = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-134.153 -539.823)">
      <path d="M119.549,4.47h2.033a.5.5,0,0,0,0-1h-3.24a.5.5,0,0,0-.5.5v3.24a.5.5,0,0,0,1,0V5.189a7,7,0,1,1-4.155-1.366.5.5,0,0,0,0-1,8,8,0,1,0,4.862,1.647" transform="translate(27.466 537)" fill="#b5b5bf" />
      <path d="M120.688,9.323v-1a.5.5,0,0,0-1,0v1a2,2,0,0,0-2,2v.5a2,2,0,0,0,2,2h1a1,1,0,0,1,1,1v.5a1,1,0,0,1-1,1h-1a1,1,0,0,1-1-1,.5.5,0,1,0-1,0,2,2,0,0,0,2,2v1a.5.5,0,0,0,1,0v-1a2,2,0,0,0,2-2v-.5a2,2,0,0,0-2-2h-1a1,1,0,0,1-1-1v-.5a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1,.5.5,0,0,0,1,0,2,2,0,0,0-2-2" transform="translate(21.965 534.5)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconWishlist = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
    <defs>
      <clipPath id="clip-wishlist">
        <rect width="16" height="14" fill="#b5b5bf" />
      </clipPath>
    </defs>
    <g clipPath="url(#clip-wishlist)">
      <path d="M14.682,1.318a4.5,4.5,0,0,0-6.364,0L8,1.636l-.318-.318A4.5,4.5,0,0,0,1.318,7.682l6.046,6.054a.9.9,0,0,0,1.273,0l6.045-6.054a4.5,4.5,0,0,0,0-6.364m-.707,5.657L8,12.959,2.025,6.975a3.5,3.5,0,0,1,4.95-4.95l.389.389a.9.9,0,0,0,1.273,0l.388-.389a3.5,3.5,0,0,1,4.95,4.95" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconCompare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14.6" height="16" viewBox="0 0 14.6 16">
    <g transform="translate(0.158)">
      <path d="M304.755,426.408v-2.032a.5.5,0,1,1,.993,0v3.239a.5.5,0,0,1-.5.5h-3.216a.5.5,0,0,1,0-1h2.006a6.924,6.924,0,0,0-11.8,1,.5.5,0,0,1-.666.221.5.5,0,0,1-.219-.672,7.913,7.913,0,0,1,13.4-1.256Z" transform="translate(-291.306 -423.268)" fill="#b5b5bf" />
    </g>
    <g transform="translate(0 10.879)">
      <path d="M292.141,414.371V416.4a.5.5,0,1,1-.993,0v-3.238a.5.5,0,0,1,.5-.5h3.216a.5.5,0,0,1,0,1h-2.006a6.924,6.924,0,0,0,11.8-1,.493.493,0,0,1,.666-.221.5.5,0,0,1,.219.671,7.913,7.913,0,0,1-13.4,1.256Z" transform="translate(-291.148 -412.39)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconFollowedSellers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-1501.679 -486)">
      <path d="M193.408,3.756,192.05.862A1.5,1.5,0,0,0,190.692,0H180.666a1.5,1.5,0,0,0-1.357.862L177.95,3.756l.029-.062A3,3,0,0,0,179.373,7.7a3.091,3.091,0,0,0,.306.128V16h12V9.5a.5.5,0,0,0-1,0V15h-3V10.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V15h-3V8a3,3,0,0,0,2.5-1.342,3,3,0,0,0,5,0,3,3,0,0,0,5.229-2.9M184.679,11h2v4h-2Zm6.4-4.041A2,2,0,0,1,188.719,5.4a.5.5,0,0,0-.49-.4h-.1a.5.5,0,0,0-.49.4,2,2,0,0,1-3.919,0,.5.5,0,0,0-.49-.4h-.1a.5.5,0,0,0-.49.4,2,2,0,1,1-3.781-1.225l1.357-2.888A.5.5,0,0,1,180.666,1h10.025a.5.5,0,0,1,.452.288L192.5,4.175a2,2,0,0,1-1.422,2.784" transform="translate(1324 486)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconClassifiedProducts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.002" height="16.001" viewBox="0 0 16.002 16.001">
    <g transform="translate(-242.999 -1172.998)">
      <g transform="translate(85 -22)">
        <path d="M16260.5,1270h-5a1.5,1.5,0,0,1,0-3h5a1.5,1.5,0,1,1,0,3Zm-5-2a.5.5,0,0,0,0,1h5a.5.5,0,1,0,0-1Z" transform="translate(-16096 -67)" fill="#b5b5bf" />
        <path d="M16256,1271a2,2,0,1,1,2-2A2,2,0,0,1,16256,1271Zm0-3a1,1,0,1,0,1,1A1,1,0,0,0,16256,1268Z" transform="translate(-16094 -72)" fill="#b5b5bf" />
      </g>
      <g transform="translate(93 -14)">
        <path d="M16252.5,1262h-5a1.5,1.5,0,1,1,0-3h5a1.5,1.5,0,1,1,0,3Zm-5-2a.5.5,0,0,0,0,1h5a.5.5,0,0,0,0-1Z" transform="translate(-16088 -59)" fill="#b5b5bf" />
        <path d="M16248,1263a2,2,0,1,1,2-2A2,2,0,0,1,16248,1263Zm0-3a1,1,0,1,0,1,1A1,1,0,0,0,16248,1260Z" transform="translate(-16086 -64)" fill="#b5b5bf" />
      </g>
      <path d="M16418,892h-1v-1a4,4,0,0,0-4-4h-1v-1h1a5.006,5.006,0,0,1,5,5v1Z" transform="translate(-16159 287)" fill="#b5b5bf" />
      <path d="M6,6H5V5A4,4,0,0,0,1,1H0V0H1A5.005,5.005,0,0,1,6,5V6Z" transform="translate(249 1188.963) rotate(180)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconAuction = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <defs>
      <clipPath id="clip-auction">
        <rect width="16" height="16" fill="#b5b5bf" />
      </clipPath>
    </defs>
    <g clipPath="url(#clip-auction)">
      <path d="M5.3,13.642,11.217,5.2,9.58,4.059a.5.5,0,0,1-.819-.573L11.055.213a.5.5,0,0,1,.819.573L17.607,4.8a.5.5,0,0,1,.819.573L16.131,8.643a.5.5,0,0,1-.819-.573L13.675,6.924,7.762,15.361A1.5,1.5,0,0,1,5.3,13.642M15.886,7.251l1.147-1.637L11.3,1.6,10.153,3.241ZM6.246,14.91a.5.5,0,0,0,.7-.122l5.913-8.437-.819-.573L6.123,14.215a.5.5,0,0,0,.123.7" transform="translate(-5.033 0)" fill="#b5b5bf" />
      <path d="M3,30.472a.5.5,0,0,0,.5.5h7a.5.5,0,1,0,0-1h-7a.5.5,0,0,0-.5.5" transform="translate(3.5 -14.986)" fill="#b5b5bf" />
      <path d="M6.5,24.976h4a.5.5,0,0,1,.5.5v2H10v-1.5H7v1.5H6v-2a.5.5,0,0,1,.5-.5" transform="translate(2 -12.488)" fill="#b5b5bf" />
      <path d="M0,24.478H0a.5.5,0,0,0,.5.5h1a.5.5,0,1,0,0-1H.5a.5.5,0,0,0-.5.5" transform="translate(14 -11.989)" fill="#b5b5bf" />
      <path d="M4.439,19.007a.5.5,0,0,0-.707,0l-.707.706a.5.5,0,0,0,.707.706l.707-.706a.5.5,0,0,0,0-.706" transform="translate(9.975 -9.431)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconConversations = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(1053.151 256.688)">
      <path d="M134.849,88.312h-8a2,2,0,0,0-2,2v5a2,2,0,0,0,2,2v3l2.4-3h5.6a2,2,0,0,0,2-2v-5a2,2,0,0,0-2-2m1,7a1,1,0,0,1-1,1h-8a1,1,0,0,1-1-1v-5a1,1,0,0,1,1-1h8a1,1,0,0,1,1,1Z" transform="translate(-1178 -341)" fill="#b5b5bf" />
      <path d="M134.849,81.312h8a1,1,0,0,1,1,1v5a1,1,0,0,1-1,1h-.5a.5.5,0,0,0,0,1h.5a2,2,0,0,0,2-2v-5a2,2,0,0,0-2-2h-8a2,2,0,0,0-2,2v.5a.5.5,0,0,0,1,0v-.5a1,1,0,0,1,1-1" transform="translate(-1182 -337)" fill="#b5b5bf" />
      <path d="M131.349,93.312h5a.5.5,0,0,1,0,1h-5a.5.5,0,0,1,0-1" transform="translate(-1181 -343.5)" fill="#b5b5bf" />
      <path d="M131.349,99.312h5a.5.5,0,1,1,0,1h-5a.5.5,0,1,1,0-1" transform="translate(-1181 -346.5)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconWallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <defs>
      <clipPath id="clip-wallet">
        <rect width="16" height="16" fill="#b5b5bf" />
      </clipPath>
    </defs>
    <g clipPath="url(#clip-wallet)">
      <path d="M13.5,4H13V2.5A2.5,2.5,0,0,0,10.5,0h-8A2.5,2.5,0,0,0,0,2.5v11A2.5,2.5,0,0,0,2.5,16h11A2.5,2.5,0,0,0,16,13.5v-7A2.5,2.5,0,0,0,13.5,4M2.5,1h8A1.5,1.5,0,0,1,12,2.5V4H2.5a1.5,1.5,0,0,1,0-3M15,11H10a1,1,0,0,1,0-2h5Zm0-3H10a2,2,0,0,0,0,4h5v1.5A1.5,1.5,0,0,1,13.5,15H2.5A1.5,1.5,0,0,1,1,13.5v-9A2.5,2.5,0,0,0,2.5,5h11A1.5,1.5,0,0,1,15,6.5Z" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconEarningPoints = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-240.535 -537)">
      <path d="M221.069,0a8,8,0,1,0,8,8,8,8,0,0,0-8-8m0,15a7,7,0,1,1,7-7,7,7,0,0,1-7,7" transform="translate(27.466 537)" fill="#b5b5bf" />
      <path d="M16425.393,420.226l-3.777-5.039a.42.42,0,0,1-.012-.482l1.662-2.515a.416.416,0,0,1,.313-.186l0,0h4.26a.41.41,0,0,1,.346.19l1.674,2.515a.414.414,0,0,1-.012.482l-3.777,5.039a.413.413,0,0,1-.338.169A.419.419,0,0,1,16425.393,420.226Zm-2.775-5.245,3.113,4.148,3.109-4.148-1.32-1.983h-3.592Z" transform="translate(-16177.195 129)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconAffiliate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19.998" height="19.998" viewBox="0 0 19.998 19.998">
    <g transform="translate(-298 -935.05)">
      <path d="M8.931,6.946h.993a.5.5,0,1,1-.993,0ZM0,6.946V4.962a4.962,4.962,0,0,1,9.923,0V6.945H8.932V4.962a3.969,3.969,0,0,0-7.939,0V6.946h0a.5.5,0,1,1-.993,0Z" transform="translate(310.981 935.05) rotate(45)" fill="#b5b5bf" />
      <path d="M0,2.48V.5A.5.5,0,0,1,.993.5h0V2.48a3.969,3.969,0,1,0,7.939,0V.5h.992V2.48A4.962,4.962,0,0,1,0,2.48ZM8.931.5a.5.5,0,0,1,.993,0Z" transform="translate(303.263 942.769) rotate(45)" fill="#b5b5bf" />
      <rect width="0.992" height="7.939" rx="0.496" transform="translate(309.93 942.417) rotate(45)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconSupportTicket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.001" viewBox="0 0 16 16.001">
    <g transform="translate(-316 -1066)">
      <path d="M16427.109,902H16420a8.015,8.015,0,1,1,8-8,8.278,8.278,0,0,1-1.422,4.535l1.244,2.132a.81.81,0,0,1,0,.891A.791.791,0,0,1,16427.109,902ZM16420,887a7,7,0,1,0,0,14h6.283c.275,0,.414,0,.549-.111s-.209-.574-.34-.748l0,0-.018-.022-1.064-1.6A6.829,6.829,0,0,0,16427,894a6.964,6.964,0,0,0-7-7Z" transform="translate(-16096 180)" fill="#b5b5bf" />
      <path d="M16414,895a1,1,0,1,1,1,1A1,1,0,0,1,16414,895Zm.5-2.5V891h.5a2,2,0,1,0-2-2h-1a3,3,0,1,1,3.5,2.958v.54a.5.5,0,1,1-1,0Zm-2.5-3.5h1a.5.5,0,1,1-1,0Z" transform="translate(-16090.998 183.001)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconManageProfile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(3176 -602)">
      <path d="M331.144,0a4,4,0,1,0,4,4,4,4,0,0,0-4-4m0,7a3,3,0,1,1,3-3,3,3,0,0,1-3,3" transform="translate(-3499.144 602)" fill="#b5b5bf" />
      <path d="M332.144,20h-10a3,3,0,0,0,0,6h10a3,3,0,0,0,0-6m0,5h-10a2,2,0,0,1,0-4h10a2,2,0,0,1,0,4" transform="translate(-3495.144 592)" fill="#b5b5bf" />
    </g>
  </svg>
)

const IconDeleteAccount = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(-240.535 -537)">
      <path d="M221.069,0a8,8,0,1,0,8,8,8,8,0,0,0-8-8m0,15a7,7,0,1,1,7-7,7,7,0,0,1-7,7" transform="translate(27.466 537)" fill="#b5b5bf" />
      <rect width="8" height="1" rx="0.5" transform="translate(244.535 544.5)" fill="#b5b5bf" />
    </g>
  </svg>
)

// Arrow chevron for sub-menu items
const SideNavArrow = ({ open }) => (
  <span
    className={`ml-auto inline-block w-0 h-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
    style={{
      borderTop: '4px solid transparent',
      borderBottom: '4px solid transparent',
      borderLeft: '4px solid #b5b5bf',
    }}
  />
)

// Sub-menu Item

function SubMenu({ items, open }) {
  if (!open) return null
  return (
    <ul className="list-none pl-[2rem] m-0">
      {items.map(({ label, to }) => (
        <li className="block" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center px-[1rem] py-[0.5rem] text-[0.875rem] no-underline ${
                isActive ? 'text-[#0080ff] font-semibold' : 'text-[#292933] hover:text-[#0080ff]'
              }`
            }
          >
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

// Sidebar Nav Item with optional sub-menu

function NavItem({ icon, label, to, badge, subItems }) {
  const [open, setOpen] = useState(false)

  if (subItems) {
    return (
      <li className="block">
        <span
          className="flex items-center px-[1rem] py-[0.5rem] text-[0.875rem] text-[#292933] cursor-pointer hover:text-[#0080ff]"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="inline-flex items-center justify-center w-[16px] h-[16px] flex-shrink-0">{icon}</span>
          <span className="ml-[1rem]">{label}</span>
          <SideNavArrow open={open} />
        </span>
        <SubMenu items={subItems} open={open} />
      </li>
    )
  }

  return (
    <li className="block">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-[1rem] py-[0.5rem] text-[0.875rem] no-underline ${
            isActive ? 'text-[#0080ff] font-semibold [&_svg_path]:fill-[#0080ff] [&_svg_rect]:fill-[#0080ff]' : 'text-[#292933] hover:text-[#0080ff]'
          }`
        }
      >
        <span className="inline-flex items-center justify-center w-[16px] h-[16px] flex-shrink-0">{icon}</span>
        <span className="ml-[1rem]">{label}</span>
        {badge && (
          <span
            className={`ml-auto inline-block px-[0.5rem] py-[0.125rem] text-[0.6875rem] font-semibold leading-none rounded-[0.25rem] text-white ${
              badge.type === 'success' ? 'bg-[#85b567]' : 'bg-[#0080ff]'
            }`}
          >
            {badge.text}
          </span>
        )}
      </NavLink>
    </li>
  )
}

// Main Sidebar Export

export default function UserSidebar() {
  const { user, token: authToken, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = authToken || localStorage.getItem('ec_token')
      if (!token) {
        setLoading(false)
        return
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setProfile(data.user)
      } else if (data.message === 'Invalid or expired token') {
        logout()
        navigate('/login')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [authToken, logout, navigate])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  
  useEffect(() => {
    const handleFocus = () => {
      fetchUserProfile()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchUserProfile])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = profile?.fullName || user?.fullName || 'Guest User'
  const displayEmail = profile?.email || user?.email || 'user@example.com'
  const avatarUrl = profile?.avatar || user?.avatar || '/src/images/Placeholder.png'

  if (loading) {
    return (
      <div className="relative z-[1] rounded-none w-[260px] flex-shrink-0">
        <div className="overflow-auto px-[1.5rem] pb-[1.5rem]">
          <div className="p-[1.5rem] text-center mb-[1.5rem] border-b border-[#dfdfe6]">
            <div className="inline-block w-[64px] h-[64px] rounded-full overflow-hidden mb-[1rem] bg-gray-200 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-[1] rounded-none w-[260px] flex-shrink-0">
      <div className="overflow-auto px-[1.5rem] pb-[1.5rem]">

        {/* Customer Info */}
        <div className="p-[1.5rem] text-center mb-[1.5rem] border-b border-[#dfdfe6] relative">
          <span className="inline-block w-[64px] h-[64px] rounded-full overflow-hidden mb-[1rem]">
            <img
              src={avatarUrl}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/src/images/Placeholder.png'
              }}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </span>
          <h4 className="text-[14px] mb-[0.25rem] font-bold text-[#292933]">{displayName}</h4>
          <div className="truncate opacity-60 text-[12px]">
            {displayEmail}
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <ul className="list-none p-0 m-0 mb-[1rem] pb-[1rem] border-b border-[#dfdfe6]">

            <NavItem icon={<IconDashboard />} label="Dashboard" to="/user/dashboard" />
            <NavItem icon={<IconPurchaseHistory />} label="Purchase History" to="/user/purchase-history" />
            <NavItem icon={<IconWishlist />} label="Wishlist" to="/user/wishlist" />
            <NavItem icon={<IconFollowedSellers />} label="Followed Sellers" to="/user/followed-sellers" />
            <NavItem icon={<IconManageProfile />} label="Manage Profile" to="/user/profile" />
            <NavItem icon={<IconDeleteAccount />} label="Delete My Account" to="/user/account-delete" />
          </ul>

          {/* Sign Out */}
          <button
            className="block w-full bg-[#0080ff] hover:bg-[#0066cc] text-white text-[14px] font-bold py-[0.5rem] px-[1rem] mb-[3rem] md:mb-0 rounded-[25px] border-0"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}