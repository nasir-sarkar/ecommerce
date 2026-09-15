import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


/* Social icon SVGs keyed by platform */
const SocialIcon = ({ platform }) => {
  const icons = {
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
      </svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
      </svg>
    ),
    youtube: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
      </svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
      </svg>
    ),
  }
  return icons[platform] || null
}

const socialBgClass = {
  facebook:  'bg-blue-600',
  twitter:   'bg-black',
  instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
  youtube:   'bg-red-600',
  linkedin:  'bg-blue-700',
}


/* Default data (used while loading / if API fails) */
const DEFAULT = {
  descriptionTitle: 'Active eCommerce CMS | AN ONLINE SHOPPING PLATFORM WITH GREAT DEALS',
  descriptionText: `Active eCommerce CMS is a leading online shopping site that brings you great deals, with platforms existing across Asia including Singapore, Thailand, Indonesia, Vietnam, Philippines, and Taiwan.`,
  logoUrl: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/zJsc9TxAO0PSMyIBwBz1WXFLAsF9YlBrfYIsrYuv.svg',
  googlePlayUrl: 'https://play.google.com/store/apps',
  appStoreUrl: 'https://www.apple.com/app-store/',
  socialLinks: [
    { platform: 'facebook',  url: 'https://facebook.com/',       enabled: true },
    { platform: 'twitter',   url: 'https://twitter.com/',        enabled: true },
    { platform: 'instagram', url: 'https://www.instagram.com/',  enabled: true },
    { platform: 'youtube',   url: 'https://youtube.com/',        enabled: true },
    { platform: 'linkedin',  url: 'https://linkedin.com/',       enabled: true },
  ],
  quickLinks: [
    { name: 'Support Policy Page',  path: '/support-policy' },
    { name: 'Return Policy Page',   path: '/return-policy' },
    { name: 'About Us',             path: '/about' },
    { name: 'Privacy Policy Page',  path: '/privacy-policy' },
    { name: 'Seller Policy',        path: '/seller-policy' },
    { name: 'Term Conditions Page', path: '/terms-conditions' },
  ],
  contact: { address: 'Demo', phone: '+01 234 567 890', email: 'yourmail@email.com' },
  myAccountLinks: [
    { name: 'Login',                   path: '/login' },
    { name: 'Order History',           path: '/order-history' },
    { name: 'My Wishlist',             path: '/wishlist' },
    { name: 'Track Order',             path: '/track-order' },
    { name: 'Be an affiliate partner', path: '/affiliate' },
  ],
  sellerLinks: [
    { name: 'Become A Seller',       path: '/become-seller' },
    { name: 'Login to Seller Panel', path: '/seller-login' },
    { name: 'Download Seller App',   path: '/seller-app' },
  ],
  deliveryLinks: [
    { name: 'Login to Delivery Boy Panel', path: '/delivery-login' },
    { name: 'Download Delivery Boy App',   path: '/delivery-app' },
  ],
  copyrightText: 'Active eCommerce CMS 2025',
}

export default function Footer() {
  const [data, setData] = useState(DEFAULT)

  useEffect(() => {
    fetch(`${API_URL}/footer`)
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json) setData(json) })
      .catch(() => {/* use defaults */})
  }, [])

  const {
    descriptionTitle, descriptionText,
    logoUrl, googlePlayUrl, appStoreUrl,
    socialLinks, quickLinks, contact,
    myAccountLinks, sellerLinks, deliveryLinks,
    copyrightText,
  } = data

  return (
    <footer>
      {/* Footer Description */}
      <section className="bg-[#f5f5f5] border-t border-b border-gray-200 mt-auto">
        <div className="container mx-auto max-w-[1280px] px-4 py-8">
          <h1 className="text-lg font-bold text-[#8d8d8d] mb-3">
            {descriptionTitle}
          </h1>
          <p className="text-[13px] text-[#8d8d8d] text-justify leading-relaxed whitespace-pre-line">
            {descriptionText}
          </p>
        </div>
      </section>


      {/* Policy Bar */}
      <section className="bg-[#f5f5f5] border-t border-gray-200">
        <div className="container mx-auto max-w-[1280px] px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-gray-200">
            {/* Terms */}
            <Link to="/terms-conditions" className="border-r border-b border-gray-200 text-center p-4 md:p-6 block hover:tracking-wide transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 26.004 32" className="mx-auto mb-3">
                <path d="M-14508,18932v-.01a6.01,6.01,0,0,1-5.975-5.492h-.021v-14h1v13.5h0a4.961,4.961,0,0,0,4.908,4.994h.091v0h14v1Zm17-4v-1a2,2,0,0,0,2-2h1a3,3,0,0,1-2.927,3Zm-16,0a3,3,0,0,1-3-3h1a2,2,0,0,0,2,2h16v1Zm18-3v-16.994h-4v-1h3.6l-5.6-5.6v3.6h-.01a2.01,2.01,0,0,0,2,2v1a3.009,3.009,0,0,1-3-3h.01v-4h.6l0,0H-14507a2,2,0,0,0-2,2v22h-1v-22a3,3,0,0,1,3-3v0h12l0,0,7,7-.01.01V18925Zm-16-4.992v-1h12v1Zm0-4.006v-1h12v1Zm0-4v-1h12v1Z" transform="translate(14513.998 -18900.002)" fill="#919199"/>
              </svg>
              <h4 className="text-[#292933] text-sm font-bold">Terms &amp; Conditions</h4>
            </Link>
            {/* Return Policy */}
            <Link to="/return-policy" className="border-r border-b border-gray-200 text-center p-4 md:p-6 block hover:tracking-wide transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32.001 23.971" className="mx-auto mb-3">
                <path d="M-14490,18922.967a6.972,6.972,0,0,0,4.949-2.051,6.944,6.944,0,0,0,2.052-4.943,7.008,7.008,0,0,0-7-7v0h-22.1l7.295,7.295-.707.707-7.779-7.779-.708-.707.708-.7,7.774-7.779.712.707-7.261,7.258H-14490v0a8.01,8.01,0,0,1,8,8,8.008,8.008,0,0,1-8,8Z" transform="translate(14514.001 -18900)" fill="#919199"/>
              </svg>
              <h4 className="text-[#292933] text-sm font-bold">Return Policy</h4>
            </Link>
            {/* Support Policy */}
            <Link to="/support-policy" className="border-r border-b border-gray-200 text-center p-4 md:p-6 block hover:tracking-wide transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32.002 32.002" className="mx-auto mb-3">
                <g transform="translate(-1113.999 -2398)">
                  <path d="M-14508,18916h0l-1,0a12.911,12.911,0,0,1,3.806-9.187A12.916,12.916,0,0,1-14496,18903a12.912,12.912,0,0,1,9.193,3.811A12.9,12.9,0,0,1-14483,18916l-1,0a11.918,11.918,0,0,0-3.516-8.484A11.919,11.919,0,0,0-14496,18904a11.921,11.921,0,0,0-8.486,3.516A11.913,11.913,0,0,0-14508,18916Z" transform="translate(15626 -16505)" fill="#919199"/>
                  <path d="M-14510,18912h-1a3,3,0,0,1-3-3v-6a3,3,0,0,1,3-3h1a2,2,0,0,1,2,2v8A2,2,0,0,1-14510,18912Z" transform="translate(15628 -16489)" fill="#919199"/>
                  <path d="M4,12H3A3,3,0,0,1,0,9V3A3,3,0,0,1,3,0H4A2,2,0,0,1,6,2v8A2,2,0,0,1,4,12Z" transform="translate(1146.002 2423) rotate(180)" fill="#919199"/>
                </g>
              </svg>
              <h4 className="text-[#292933] text-sm font-bold">Support Policy</h4>
            </Link>
            {/* Privacy Policy */}
            <Link to="/privacy-policy" className="border-r border-b border-gray-200 text-center p-4 md:p-6 block hover:tracking-wide transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="mx-auto mb-3">
                <g transform="translate(-1454.002 -2430.002)">
                  <path d="M-14498,18932a15.894,15.894,0,0,1-11.312-4.687A15.909,15.909,0,0,1-14514,18916a15.884,15.884,0,0,1,4.685-11.309A15.9,15.9,0,0,1-14498,18900a15.909,15.909,0,0,1,11.316,4.688A15.885,15.885,0,0,1-14482,18916a15.9,15.9,0,0,1-4.687,11.316A15.909,15.909,0,0,1-14498,18932Zm0-31a14.9,14.9,0,0,0-10.605,4.393A14.9,14.9,0,0,0-14513,18916a14.9,14.9,0,0,0,4.395,10.607A14.9,14.9,0,0,0-14498,18931a14.9,14.9,0,0,0,10.607-4.393A14.9,14.9,0,0,0-14483,18916a14.9,14.9,0,0,0-4.393-10.607A14.9,14.9,0,0,0-14498,18901Z" transform="translate(15968 -16470)" fill="#919199"/>
                  <rect width="2" height="10" transform="translate(1469 2440)" fill="#919199"/>
                  <rect width="2" height="2" transform="translate(1469 2452)" fill="#919199"/>
                </g>
              </svg>
              <h4 className="text-[#292933] text-sm font-bold">Privacy Policy</h4>
            </Link>
          </div>
        </div>
      </section>


      {/* Footer Dark - Social & Apps */}
      <section className="py-6 border-b border-[#3d3d46]" style={{ backgroundColor: '#212129' }}>
        <div className="container mx-auto max-w-[1280px] px-4">
          <div className="mb-4">
            <Link to="/">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-11"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
            </Link>
          </div>
          <div className="flex justify-end">
            <div>
              <h5 className="text-[14px] font-bold text-[#919199] uppercase mb-3">Follow Us</h5>
              <ul className="flex gap-3 mb-5">
                {(socialLinks || []).filter(s => s.enabled).map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-9 h-9 rounded-full ${socialBgClass[social.platform] || 'bg-gray-600'} flex items-center justify-center text-white hover:opacity-80 transition-opacity`}
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  </li>
                ))}
              </ul>
              <h5 className="text-[14px] font-bold text-[#919199] uppercase mb-3">Mobile Apps</h5>
              <div className="flex gap-3">
                {googlePlayUrl && (
                  <a href={googlePlayUrl} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                    <img
                      src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/play.png"
                      alt="Google Play"
                      className="h-11"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </a>
                )}
                {appStoreUrl && (
                  <a href={appStoreUrl} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                    <img
                      src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/app.png"
                      alt="App Store"
                      className="h-11"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer Links */}
      <section className="py-6" style={{ backgroundColor: '#212129' }}>
        <div className="container mx-auto max-w-[1280px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Links */}
            <div>
              <ul className="space-y-2">
                {(quickLinks || []).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[13px] text-[#b5b5bf] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Contacts */}
            <div>
              <h4 className="text-[14px] font-bold text-[#919199] uppercase mb-3">Contacts</h4>
              <ul className="space-y-3">
                {contact?.address && (
                  <li>
                    <p className="text-[13px] text-[#919199] mb-0.5">Address</p>
                    <p className="text-[13px] text-[#b5b5bf]">{contact.address}</p>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <p className="text-[13px] text-[#919199] mb-0.5">Phone</p>
                    <p className="text-[13px] text-[#b5b5bf]">{contact.phone}</p>
                  </li>
                )}
                {contact?.email && (
                  <li>
                    <p className="text-[13px] text-[#919199] mb-0.5">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-[13px] text-[#b5b5bf] hover:text-primary transition-colors">
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>


            {/* My Account */}
            <div>
              <h4 className="text-[14px] font-bold text-[#919199] uppercase mb-3">My Account</h4>
              <ul className="space-y-2">
                {(myAccountLinks || []).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[13px] text-[#b5b5bf] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Seller Zone & Delivery */}
            <div>
              <h4 className="text-[14px] font-bold text-[#919199] uppercase mb-3">Seller Zone</h4>
              <ul className="space-y-2 mb-5">
                {(sellerLinks || []).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[13px] text-[#b5b5bf] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 className="text-[14px] font-bold text-[#919199] uppercase mb-3">Delivery Boy</h4>
              <ul className="space-y-2">
                {(deliveryLinks || []).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[13px] text-[#b5b5bf] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Bottom Bar */}
      <div className="bg-black py-3">
        <div className="container mx-auto max-w-[1280px] px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[13px] text-[#b5b5bf]">{copyrightText}</p>
          <div className="flex items-center gap-2">
            <img src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/payment-icon/pay.png" alt="Payment" className="h-5" onError={(e) => e.target.style.display='none'} />
            <img src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/payment-icon/master.png" alt="Mastercard" className="h-5" onError={(e) => e.target.style.display='none'} />
            <img src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/payment-icon/visa.png" alt="Visa" className="h-5" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
      </div>
    </footer>
  )
}