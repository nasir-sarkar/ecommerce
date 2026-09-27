import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const PACKAGE_BADGE = 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/gwtgT8PqqJn5yHwhJ8B8MsgjoR6FdKspovB9ijdg.webp'
const VERIFIED_IMG  = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/verified.png'
const PLACEHOLDER   = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'

// Inline SVG Icons

const IconProductBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64.001" height="64" viewBox="0 0 64.001 64">
    <path d="M146.431,117.56l-26.514-10.606a8.014,8.014,0,0,0-5.944,0L87.458,117.56a4,4,0,0,0-2.514,3.714v34.217a4,4,0,0,0,2.514,3.714l26.514,10.606a8.013,8.013,0,0,0,5.944,0L146.431,159.2a4,4,0,0,0,2.514-3.714V121.274a4,4,0,0,0-2.514-3.714m-31.714-8.748a5.981,5.981,0,0,1,4.456,0l26.1,10.44a1,1,0,0,1,0,1.858l-12.332,4.932-30.654-12.26Zm1.228,59.633L88.2,157.347a2,2,0,0,1-1.258-1.856V122.6l29,11.6Zm1-36L88.612,121.11a1,1,0,0,1,0-1.858L99.6,114.858l30.654,12.262Zm30,23.048a2,2,0,0,1-1.258,1.856l-27.742,11.1V134.2l13-5.2V146.61a1.035,1.035,0,0,0,2-.466V128.2l14-5.6Z" transform="translate(-84.944 -106.382)" fill="#FFFFFF" />
  </svg>
)

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="61.143" viewBox="0 0 64 61.143">
    <path d="M63.286,22.145a2.821,2.821,0,0,0-1.816-.926L43.958,19.455a2.816,2.816,0,0,1-2.294-1.666L34.574,1.68a2.813,2.813,0,0,0-5.148,0l-7.09,16.11a2.813,2.813,0,0,1-2.292,1.666L2.53,21.219a2.813,2.813,0,0,0-1.59,4.9l13.13,11.72a2.818,2.818,0,0,1,.876,2.7l-3.734,17.2a2.812,2.812,0,0,0,4.166,3.026L30.584,51.9a2.8,2.8,0,0,1,2.832,0l15.206,8.864a2.813,2.813,0,0,0,4.166-3.026l-3.734-17.2a2.818,2.818,0,0,1,.876-2.7l13.13-11.72a2.813,2.813,0,0,0,.226-3.972m-1.5,2.546L48.658,36.413a4.717,4.717,0,0,0-1.47,4.524l3.732,17.2a.9.9,0,0,1-1.336.97l-15.2-8.866a4.729,4.729,0,0,0-4.758,0L14.416,59.109a.9.9,0,0,1-1.336-.97l3.732-17.2a4.717,4.717,0,0,0-1.47-4.524L2.212,24.691a.9.9,0,0,1,.51-1.57l17.512-1.766a4.721,4.721,0,0,0,3.85-2.8l7.09-16.11a.9.9,0,0,1,1.652,0l7.09,16.11a4.721,4.721,0,0,0,3.85,2.8l17.512,1.766a.9.9,0,0,1,.51,1.57" transform="translate(0 0)" fill="#FFFFFF" />
  </svg>
)

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <g transform="translate(-1561.844 1020.618)">
      <path d="M229.23,106.382h-12a6,6,0,0,0,0,12h12a6,6,0,0,0,0-12m0,10h-12a4,4,0,0,1,0-8h12a4,4,0,0,1,0,8" transform="translate(1370.615 -1127)" fill="#FFFFFF" />
      <path d="M213.73,117.882h24a1,1,0,0,1,0,2h-24a1,1,0,0,1,0-2" transform="translate(1372.115 -1115.5)" fill="#FFFFFF" />
      <path d="M210.23,117.382a2,2,0,1,0,2,2,2,2,0,0,0-2-2" transform="translate(1367.615 -1116)" fill="#FFFFFF" />
      <path d="M213.73,123.882h24a1,1,0,0,1,0,2h-24a1,1,0,0,1,0-2" transform="translate(1372.115 -1109.5)" fill="#FFFFFF" />
      <path d="M210.23,123.382a2,2,0,1,0,2,2,2,2,0,0,0-2-2" transform="translate(1367.615 -1110)" fill="#FFFFFF" />
      <path d="M213.73,129.882h24a1,1,0,0,1,0,2h-24a1,1,0,1,1,0-2" transform="translate(1372.115 -1103.5)" fill="#FFFFFF" />
      <path d="M210.23,129.382a2,2,0,1,0,2,2,2,2,0,0,0-2-2" transform="translate(1367.615 -1104)" fill="#FFFFFF" />
      <path d="M265.23,116.382a8,8,0,0,0-8-8h-7.2a1,1,0,0,0,0,2h7.2a6,6,0,0,1,6,6v44a6,6,0,0,1-6,6h-48a6,6,0,0,1-6-6v-44a6,6,0,0,1,6-6h7.2a1,1,0,0,0,0-2h-7.2a8,8,0,0,0-8,8v44a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8Z" transform="translate(1360.615 -1125)" fill="#FFFFFF" />
    </g>
  </svg>
)

const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64.001" viewBox="0 0 64 64.001">
    <g transform="translate(-1571.385 1123.29)">
      <path d="M214.771,65.71a2,2,0,0,1-2-2v-59a1,1,0,0,0-2,0v59a4,4,0,0,0,4,4h59a1,1,0,0,0,0-2Z" transform="translate(1360.615 -1127)" fill="#FFFFFF" />
      <path d="M264.6,10.027a3,3,0,0,0-4,4L247.536,27.1a2.994,2.994,0,0,0-2.594,0l-6.584-6.584a3,3,0,1,0-5.414,0L221.528,31.927a3,3,0,1,0,1.412,1.418l11.418-11.418a3,3,0,0,0,2.586,0l6.586,6.586a3,3,0,1,0,5.418,0l13.072-13.07a3,3,0,0,0,2.584-5.416M220.23,35.633a1,1,0,1,1,1-1,1,1,0,0,1-1,1m15.42-15.414a1,1,0,1,1,1-1,1,1,0,0,1-1,1M246.238,30.8a1,1,0,1,1,1-1,1,1,0,0,1-1,1m17.074-17.066a1,1,0,1,1,1-1,1,1,0,0,1-1,1" transform="translate(1367.074 -1120.976)" fill="#FFFFFF" />
    </g>
  </svg>
)

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M6.667,8.333A2.667,2.667,0,1,0,4,5.667,2.667,2.667,0,0,0,6.667,8.333Zm0-4A1.333,1.333,0,1,1,5.333,5.667,1.333,1.333,0,0,1,6.667,4.333ZM12,9.667a2,2,0,1,0-2-2A2,2,0,0,0,12,9.667ZM12,7a.667.667,0,1,1-.667.667A.667.667,0,0,1,12,7Zm0,3.333a3.333,3.333,0,0,0-2.04.7A4.667,4.667,0,0,0,2,14.333a.667.667,0,1,0,1.333,0,3.333,3.333,0,0,1,6.667,0,.667.667,0,0,0,1.333,0A4.6,4.6,0,0,0,10.76,12.1,2,2,0,0,1,14,13.667a.667.667,0,1,0,1.333,0A3.333,3.333,0,0,0,12,10.333Z" transform="translate(-0.667 -1)" fill="#fff" />
  </svg>
)

const IconUsersPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.5" height="16.5" viewBox="0 0 16.5 16.5">
    <g transform="translate(0 0.5)">
      <path d="M6.667,8.333A2.667,2.667,0,1,0,4,5.667,2.667,2.667,0,0,0,6.667,8.333Zm0-4A1.333,1.333,0,1,1,5.333,5.667,1.333,1.333,0,0,1,6.667,4.333ZM12,9.667a2,2,0,1,0-2-2A2,2,0,0,0,12,9.667ZM12,7a.667.667,0,1,1-.667.667A.667.667,0,0,1,12,7Zm0,3.333a3.333,3.333,0,0,0-2.04.7A4.667,4.667,0,0,0,2,14.333a.667.667,0,1,0,1.333,0,3.333,3.333,0,0,1,6.667,0,.667.667,0,0,0,1.333,0A4.6,4.6,0,0,0,10.76,12.1,2,2,0,0,1,14,13.667a.667.667,0,1,0,1.333,0A3.333,3.333,0,0,0,12,10.333Z" transform="translate(-0.667 -0.5)" fill="#fff" />
      <line x2="4" transform="translate(10 12)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1" />
      <line y1="4" transform="translate(12 10)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1" />
    </g>
  </svg>
)

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <path d="M4.355,30a12.083,12.083,0,0,1-1.6-.517A4.905,4.905,0,0,1,.029,24.5c.146-1.377.228-2.761.339-4.142Q.532,18.313.7,16.271c.106-1.332.206-2.665.316-4-.129-1.555.227-3.114.413-4.662a2,2,0,0,1,2-1.687c.782-.012,1.565,0,2.348,0h.336A5.77,5.77,0,0,1,8.275,1.3,5.615,5.615,0,0,1,12.367.018a5.841,5.841,0,0,1,5.38,5.9h.278c.753,0,1.507,0,2.26,0A2.116,2.116,0,0,1,22.5,7.986c.165,2.091.343,4.181.509,6.272s.322,4.183.488,6.273c.107,1.352.222,2.7.335,4.054a4.9,4.9,0,0,1-4.195,5.362A.61.61,0,0,0,19.5,30ZM6.118,7.678c-.893,0-1.743-.005-2.593,0-.282,0-.383.141-.407.463q-.151,1.97-.307,3.939Q2.559,15.2,2.3,18.325c-.156,1.935-.319,3.869-.455,5.806a6.248,6.248,0,0,0,.028,1.685,3.078,3.078,0,0,0,3.166,2.427q6.882,0,13.764,0c.088,0,.176,0,.264-.006a3.145,3.145,0,0,0,2.986-3.544c-.117-1.076-.177-2.158-.262-3.238-.105-1.342-.208-2.684-.315-4.026-.128-1.6-.261-3.209-.389-4.813q-.181-2.275-.357-4.551a.36.36,0,0,0-.365-.381c-.868-.009-1.735,0-2.63,0,0,.123,0,.218,0,.313,0,.615.006,1.23,0,1.845a.878.878,0,1,1-1.755-.006c-.006-.71,0-1.419,0-2.134h-8.1c0,.693,0,1.365,0,2.038a1.312,1.312,0,0,1-.034.347A.877.877,0,0,1,6.12,9.847c-.008-.711,0-1.422,0-2.168M7.894,5.9h8.069a4.036,4.036,0,1,0-8.069,0" transform="translate(0 0)" fill="#2E294E" />
    <path d="M156.63,290.4H153.2v-3.431a.872.872,0,1,0-1.744,0V290.4h-3.431a.872.872,0,1,0,0,1.744h3.431v3.431a.872.872,0,0,0,1.744,0v-3.431h3.431a.872.872,0,0,0,0-1.744" transform="translate(-140.298 -272.774)" fill="#2E294E" />
  </svg>
)

const IconCancelled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <path d="M13.122,30H7.03A7.041,7.041,0,0,1,0,22.959V7.03A7.041,7.041,0,0,1,7.03,0H22.959A7.041,7.041,0,0,1,30,7.03v5.857a1.172,1.172,0,1,1-2.343,0V7.03a4.691,4.691,0,0,0-4.7-4.687H7.03A4.691,4.691,0,0,0,2.343,7.03V22.959A4.691,4.691,0,0,0,7.03,27.646h6.092a1.177,1.177,0,0,1,0,2.354" transform="translate(0 0)" fill="#2E294E" />
    <path d="M193.376,91.163a1.171,1.171,0,0,0-1.171-1.171h-5.969a1.172,1.172,0,1,0,0,2.343h5.969a1.171,1.171,0,0,0,1.171-1.171v0" transform="translate(-174.22 -84.719)" fill="#2E294E" />
    <path d="M249.953,242.05a7.909,7.909,0,1,0,7.916,7.9,7.909,7.909,0,0,0-7.916-7.9m.008,13.467a5.563,5.563,0,1,1,5.558-5.566h.008a5.566,5.566,0,0,1-5.566,5.566" transform="translate(-227.869 -227.867)" fill="#2E294E" />
    <path d="M331.615,329.84l.929-.929a1.172,1.172,0,0,0-1.658-1.656l-.929.929-.929-.929a1.172,1.172,0,0,0-1.658,1.656l.929.929-.929.929a1.172,1.172,0,1,0,1.658,1.656l.929-.929.929.929a1.172,1.172,0,1,0,1.658-1.656Z" transform="translate(-307.867 -307.756)" fill="#2E294E" />
  </svg>
)

const IconOnDelivery = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <g transform="translate(-867.487 654.098)">
      <path d="M1352.884,172.262h-4.464a.88.88,0,1,0,0,1.761h4.464a.88.88,0,1,0,0-1.761" transform="translate(-2379.291 -827.175)" fill="#2E294E" />
      <path d="M1352.884,292.455h-4.464a.88.88,0,1,0,0,1.761h4.464a.88.88,0,1,0,0-1.761" transform="translate(-2379.291 -940.326)" fill="#2E294E" />
      <path d="M1322.832,232.366h-4.464a.88.88,0,1,0,0,1.761h4.464a.88.88,0,0,0,0-1.761" transform="translate(-2351 -883.757)" fill="#2E294E" />
      <path d="M1531.056,222.736h-5.341v-3.52a1.763,1.763,0,0,0-3-1.244l-7.04,7.04a1.76,1.76,0,0,0,0,2.489h0l4.035,4.035-4.918,4.918a1.761,1.761,0,0,0,2.49,2.49l6.162-6.163a1.76,1.76,0,0,0,0-2.489h0l-4.035-4.035,2.792-2.792v1.03a1.761,1.761,0,0,0,1.761,1.761h7.1a1.761,1.761,0,0,0,0-3.52Z" transform="translate(-2536.278 -869.726)" fill="#2E294E" />
      <path d="M1475.968,150.029a1.761,1.761,0,0,0-2.222.22l-4.842,4.842a1.761,1.761,0,0,0,2.441,2.538l.049-.049,3.821-3.821,1.288.927,1.717-1.717a3.5,3.5,0,0,1,1-.687Z" transform="translate(-2493.036 -805.966)" fill="#2E294E" />
      <path d="M1344.676,384.535a3.489,3.489,0,0,1-.9-1.589l-9.3,9.3a1.761,1.761,0,0,0,2.49,2.49l8.955-8.954Z" transform="translate(-2366.531 -1025.515)" fill="#2E294E" />
      <path d="M1690.437,117.9a2.5,2.5,0,1,1-2.5,2.5,2.5,2.5,0,0,1,2.5-2.5" transform="translate(-2699.74 -776)" fill="#2E294E" />
    </g>
  </svg>
)

const IconDelivered = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <g transform="translate(-1599.983 686.845)">
      <path d="M2077.33,84.3v.4q0,3.482,0,6.963a1.069,1.069,0,0,1-.7,1.137,1.082,1.082,0,0,1-1.236-.336c-.411-.424-.836-.834-1.273-1.268-.4.4-.806.792-1.206,1.191a1.126,1.126,0,0,1-1.887-.009c-.392-.393-.791-.78-1.208-1.192-.46.464-.9.934-1.371,1.375a1.071,1.071,0,0,1-1.789-.482,1.63,1.63,0,0,1-.036-.43q0-3.465,0-6.93V84.3h-.363q-2.409,0-4.819,0a2.166,2.166,0,0,0-2.317,2.325q0,10.529,0,21.058a2.17,2.17,0,0,0,2.343,2.333q4.183,0,8.366,0a1.07,1.07,0,0,1,.3,2.1,1.345,1.345,0,0,1-.363.038c-2.867,0-5.734.008-8.6,0a4.261,4.261,0,0,1-4.181-4.194q-.008-10.8,0-21.593a4.254,4.254,0,0,1,4.2-4.2q10.792-.007,21.584,0a4.259,4.259,0,0,1,4.192,4.182c.008,2.868,0,5.736,0,8.6a1.071,1.071,0,1,1-2.138,0q0-4.134,0-8.269a2.177,2.177,0,0,0-2.365-2.378h-5.133m-2.163,4.811V84.324h-6.387v4.842c.063-.051.1-.074.125-.1.709-.676,1.2-.671,1.884.017.392.392.789.78,1.194,1.179.459-.458.909-.9,1.357-1.353a.991.991,0,0,1,1.1-.271,3.98,3.98,0,0,1,.726.472" transform="translate(-2351 -776)" fill="#2E294E" />
      <path d="M2276.429,310.26a8.566,8.566,0,1,1,8.554,8.574,8.552,8.552,0,0,1-8.554-8.574m14.992,0a6.426,6.426,0,1,0-6.388,6.431,6.451,6.451,0,0,0,6.388-6.431" transform="translate(-2557.593 -982.681)" fill="#2E294E" />
      <path d="M2352.663,396.855c.43-.437.848-.866,1.271-1.292q1.072-1.08,2.148-2.155a1.083,1.083,0,1,1,1.531,1.519q-2.064,2.073-4.137,4.139a1.071,1.071,0,0,1-1.672,0q-1-.99-1.986-1.986a1.085,1.085,0,1,1,1.538-1.513l1.305,1.29" transform="translate(-2626.31 -1068.65)" fill="#2E294E" />
    </g>
  </svg>
)

const IconShop = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M2,25.723a1,1,0,0,0,.629.928L16,32l3.361-1.344a.5.5,0,0,0-.186-.965.491.491,0,0,0-.185.036L16,30.923l-13-5.2v-11.6a4.428,4.428,0,0,1-1-.2Z" fill="#2E294E" />
    <path d="M19.681,24.189a.5.5,0,0,0-.5-.5.493.493,0,0,0-.186.036l-3,1.2L7.432,21.5a.5.5,0,0,0-.65.278.512.512,0,0,0-.035.186.5.5,0,0,0,.314.464L16,26l3.367-1.347a.5.5,0,0,0,.314-.464" fill="#2E294E" />
    <path d="M31.5,25.126h-.087a1.368,1.368,0,0,1-.967-2.336l.061-.061a.5.5,0,0,0,0-.707l-.265-.265-.264-.264a.5.5,0,0,0-.707,0l-.061.06a1.368,1.368,0,0,1-2.336-.967V20.5a.5.5,0,0,0-.5-.5h-.748a.5.5,0,0,0-.5.5v.086a1.368,1.368,0,0,1-2.336.967l-.061-.06a.5.5,0,0,0-.707,0l-.265.264-.265.265a.5.5,0,0,0,0,.707l.061.061a1.368,1.368,0,0,1-.967,2.336H20.5a.5.5,0,0,0-.5.5v.748a.5.5,0,0,0,.5.5h.086a1.368,1.368,0,0,1,.967,2.336l-.061.061a.5.5,0,0,0,0,.707l.265.264.265.265a.5.5,0,0,0,.707,0l.061-.061a1.368,1.368,0,0,1,2.336.968V31.5a.5.5,0,0,0,.5.5h.748a.5.5,0,0,0,.5-.5v-.086a1.368,1.368,0,0,1,2.336-.968l.061.061a.5.5,0,0,0,.707,0l.264-.265.265-.264a.5.5,0,0,0,0-.707l-.061-.061a1.368,1.368,0,0,1,.967-2.336H31.5a.5.5,0,0,0,.5-.5v-.748a.5.5,0,0,0-.5-.5M29.171,29a2.373,2.373,0,0,0,.118.285,2.368,2.368,0,0,0-3.171,1.078,2.22,2.22,0,0,0-.118.285,2.369,2.369,0,0,0-3-1.481,2.516,2.516,0,0,0-.285.118A2.367,2.367,0,0,0,21.348,26a2.369,2.369,0,0,0,1.48-3,2.344,2.344,0,0,0-.118-.285,2.37,2.37,0,0,0,3.172-1.077A2.516,2.516,0,0,0,26,21.348a2.367,2.367,0,0,0,3,1.48,2.28,2.28,0,0,0,.285-.118,2.37,2.37,0,0,0,1.077,3.172,2.457,2.457,0,0,0,.286.118,2.367,2.367,0,0,0-1.481,3" fill="#2E294E" />
    <path d="M27.5,26A1.5,1.5,0,1,0,26,27.5,1.5,1.5,0,0,0,27.5,26" fill="#2E294E" />
    <path d="M16,0A46.43,46.43,0,0,1,0,8.4v2a3.451,3.451,0,0,0,5.333,2.133,3.452,3.452,0,0,0,5.333,2.134A3.453,3.453,0,0,0,16,16.8a3.451,3.451,0,0,0,5.333-2.133,3.451,3.451,0,0,0,5.333-2.134A3.454,3.454,0,0,0,32,10.4v-2A46.421,46.421,0,0,1,16,0M31.021,10.194a2.452,2.452,0,0,1-3.788,1.515,1,1,0,0,0-1.545.618A2.453,2.453,0,0,1,21.9,13.843a1,1,0,0,0-1.545.618A2.451,2.451,0,0,1,16,15.434a2.452,2.452,0,0,1-4.355-.973,1,1,0,0,0-1.545-.618,2.454,2.454,0,0,1-3.789-1.516,1,1,0,0,0-1.184-.772,1.015,1.015,0,0,0-.361.154A2.451,2.451,0,0,1,.978,10.194V9.148A47.458,47.458,0,0,0,16,1.277,47.442,47.442,0,0,0,31.021,9.148Z" fill="#2E294E" />
  </svg>
)

const StarIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 576 512" fill={active ? '#fbb03b' : '#e0e0e0'} className="mr-[1px]">
    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
  </svg>
)

export default function Dashboard_Seller() {
  const navigate = useNavigate()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('ec_token') || sessionStorage.getItem('ec_token')
        const res  = await fetch(`${API_URL}/dashboard/seller-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success) setStats(json.data)
      } catch (err) {
        console.error('Seller dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="p-8 text-center text-[#2E294E]">Loading dashboard...</div>

  // Fallback defaults when stats not yet loaded
  const s = stats || {}
  const totalProducts      = s.totalProducts      ?? 0
  const avgRating          = s.avgRating          ?? 0
  const followers          = s.followers          ?? 0
  const customFollowers    = s.customFollowers     ?? 0
  const totalOrders        = s.totalOrders        ?? 0
  const totalSales         = s.totalSales         ?? 0
  const salesLastMonth     = s.salesLastMonth     ?? 0
  const soldAmountThisMonth = s.soldAmountThisMonth ?? 0
  const soldAmountLastMonth = s.soldAmountLastMonth ?? 0
  const orders             = s.orders             || { new: 0, cancelled: 0, onDelivery: 0, delivered: 0 }
  const categoryWiseCount  = s.categoryWiseCount  || []
  const topProducts        = s.topProducts        || []
  const packageInfo        = s.packageInfo        || {}
  const isVerified         = s.isVerified         || false

  return (
    <div>
      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Products */}
        <div className="bg-[#2E294E] rounded-[6px] p-[20px] flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-white/70 mb-0">Products</p>
              <h3 className="text-[30px] font-normal text-white mb-0 leading-tight">{totalProducts}</h3>
            </div>
            <div className="text-right">
              <IconProductBox />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <a 
              href="/seller/products/create" 
              onClick={(e) => { e.preventDefault(); navigate('/seller/products/create'); }}
              className="flex items-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] text-white/70 ml-1">Add New Product</span>
            </a>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-[#2E294E] rounded-[6px] p-[20px] flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-white/70 mb-0">Rating</p>
              <h3 className="text-[30px] font-normal text-white mb-0 leading-tight">{avgRating || 0}</h3>
            </div>
            <div className="text-right">
              <IconStar />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <IconUsers />
              <p className="text-[12px] text-white/70 ml-1 mb-0">Followers {followers}</p>
            </div>
            <div className="flex items-center">
              <IconUsersPlus />
              <p className="text-[12px] text-white/70 ml-1 mb-0">Custom Followers {customFollowers}</p>
            </div>
          </div>
        </div>

        {/* Total Order */}
        <div className="bg-[#2E294E] rounded-[6px] p-[20px] flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-white/70 mb-0">Total Order</p>
              <h3 className="text-[30px] font-normal text-white mb-0 leading-tight">{totalOrders}</h3>
            </div>
            <div className="text-right">
              <IconClipboard />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <a 
              href="/seller/orders" 
              onClick={(e) => { e.preventDefault(); navigate('/seller/orders'); }}
              className="flex items-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 576 512" fill="currentColor">
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32m0 96a128 128 0 1 1 0 256 128 128 0 1 1 0-256m0 96a32 32 0 1 0-64 0c0 35.3 28.7 64 64 64a32 32 0 1 0 0-64" />
              </svg>
              <span className="text-[12px] text-white/70 ml-1">View All Order</span>
            </a>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-[#2E294E] rounded-[6px] p-[20px] flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-white/70 mb-0">Total Sales</p>
              <h3 className="text-[30px] font-normal text-white mb-0 leading-tight">${totalSales.toFixed(2)}</h3>
            </div>
            <div className="text-right">
              <IconChart />
            </div>
          </div>
          <div className="flex items-center mt-3">
            <p className="text-[12px] text-white/70 mb-0">Last Month: ${salesLastMonth.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Second row: Shop Setting / Category / Orders / Purchased Package */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Shop Setting + Sold Amount */}
        <div className="flex flex-col gap-4">
          {/* Shop Settings card (replaces Sales Stat) */}
          <div className="bg-[#e9eaee] rounded-[6px] p-4 text-center flex flex-col items-center">
            <div className="text-[16px] font-semibold text-[#2E294E]">Shop Settings</div>
            <div className="m-3"><IconShop /></div>
            <button
              onClick={() => navigate('/seller/profile')}
              className="bg-[#2E294E] text-white text-[13px] px-4 py-[7px] rounded-[4px] block w-full hover:bg-[#1f1b35]"
            >
              Go to setting
            </button>
          </div>

          {/* Sold Amount */}
          <div className="bg-[#e9eaee] rounded-[6px] p-[20px]">
            <div className="text-[#2E294E] text-[16px] font-semibold mb-1">Sold Amount</div>
            <p className="text-[12px] mb-1 text-[#2E294E]/80">Your sold amount (current month)</p>
            <h3 className="text-[#2E294E] font-semibold text-[30px] mb-0">${soldAmountThisMonth.toFixed(2)}</h3>
            <p className="my-2 text-[12px] text-[#2E294E]/80">Last Month: ${soldAmountLastMonth.toFixed(2)}</p>
          </div>
        </div>

        {/* Category wise product count */}
        <div className="bg-white rounded-[6px] p-[20px] h-full">
          <div className="text-[#2E294E] text-[16px] font-semibold">Category wise product count</div>
          <hr className="my-3 border-[#e4e5eb]" />
          <ul className="list-none p-0 m-0">
            {categoryWiseCount.length > 0 ? (
              categoryWiseCount.map((cat, i) => (
                <li key={i} className="flex justify-between items-center my-2 text-[#2E294E] text-[13px]">
                  <span>{cat.name}</span>
                  <span>{cat.count}</span>
                </li>
              ))
            ) : (
              <li className="text-[#2E294E]/60 text-[13px] my-2">No products yet</li>
            )}
          </ul>
        </div>

        {/* Orders this month */}
        <div className="bg-white rounded-[6px] p-[20px] h-full">
          <div className="text-[#2E294E] text-[16px] font-semibold">Orders</div>
          <p className="text-[12px] font-semibold text-[#2E294E]/80 mb-0">This Month</p>
          <div className="flex items-center mt-4 mb-4">
            <div className="text-left mr-3"><IconShoppingBag /></div>
            <div>
              <p className="text-[13px] text-[#2E294E] font-semibold mb-0">New Order</p>
              <h3 className="mb-0 text-[20px]" style={{ color: '#A9A3CC' }}>{orders.new}</h3>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="text-left mr-3"><IconCancelled /></div>
            <div>
              <p className="text-[13px] text-[#2E294E] font-semibold mb-0">Cancelled</p>
              <h3 className="mb-0 text-[20px]" style={{ color: '#A9A3CC' }}>{orders.cancelled}</h3>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="text-left mr-3"><IconOnDelivery /></div>
            <div>
              <p className="text-[13px] text-[#2E294E] font-semibold mb-0">On delivery</p>
              <h3 className="mb-0 text-[20px]" style={{ color: '#A9A3CC' }}>{orders.onDelivery}</h3>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="text-left mr-3"><IconDelivered /></div>
            <div>
              <p className="text-[13px] text-[#2E294E] font-semibold mb-0">Delivered</p>
              <h3 className="mb-0 text-[20px]" style={{ color: '#A9A3CC' }}>{orders.delivered}</h3>
            </div>
          </div>
        </div>

        {/* Purchased Package + Verified */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[6px] p-[20px]">
            <h6 className="mb-2 text-[#2E294E] text-[16px] font-semibold">Purchased Package</h6>
            <div className="flex">
              <div className="w-1/4">
                <img src={packageInfo.badge || PACKAGE_BADGE} className="mb-4 w-[64px]" alt="package" />
              </div>
              <div className="w-3/4">
                <a className="font-semibold mb-3 text-[#2E294E] text-[13px] block">Current Package:</a>
                <h6 className="text-[#2E294E] text-[14px] font-medium">{packageInfo.name || 'Platinum'}</h6>
                <p className="mb-1 text-[#a1a5b3] text-[12px]">
                  Product Upload Limit: {packageInfo.productUploadLimit ?? 500} Times
                </p>
                <p className="mb-1 text-[#a1a5b3] text-[12px]">
                  Preorder Upload Limit: {packageInfo.preorderUploadLimit ?? 0} Times
                </p>
                <p className="text-[#a1a5b3] text-[12px] mb-4">
                  Package Expires at:{' '}
                  {packageInfo.expiresAt
                    ? new Date(packageInfo.expiresAt).toISOString().split('T')[0]
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {isVerified && (
            <div className="bg-white rounded-[6px] px-4 py-4 flex items-center justify-center">
              <div className="my-2 py-1">
                <img src={VERIFIED_IMG} alt="verified" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top 12 Products */}
      <div className="bg-white rounded-[6px] p-[20px] mt-4">
        <h6 className="mb-3 text-[16px] font-semibold text-[#2E294E]">Top 12 Products</h6>

        {topProducts.length === 0 ? (
          <p className="text-[13px] text-[#2E294E]/60">No sales data yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[10px]">
            {topProducts.map((p, i) => (
              <div key={i} className="border border-[#f1f1f4] rounded-[6px] shadow-sm bg-white">
                <div className="relative">
                  <a href="#" className="block">
                    <img
                      className="mx-auto h-[210px] object-contain"
                      src={p.image || PLACEHOLDER}
                      alt={p.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
                    />
                  </a>
                </div>
                <div className="p-3 text-left">
                  <div className="text-[15px]">
                    {p.oldPrice && <del className="font-semibold opacity-50 mr-1">{p.oldPrice}</del>}
                    <span className="font-bold text-[#2E294E]">{p.price}</span>
                  </div>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((n) => <StarIcon key={n} active={n <= Math.round(p.rating || 0)} />)}
                  </div>
                  <h3 className="font-semibold text-[13px] leading-[1.4] mb-0 mt-1 line-clamp-2">
                    <a href="#" className="block text-[#2E294E]">{p.name}</a>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}