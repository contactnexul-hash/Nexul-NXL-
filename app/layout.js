import './globals.css'

export const metadata = {
  title: 'projetnexul - Nexul Vitrine & Dashboard',
  description: 'Vitrine et dashboard Nexul (Next.js + Tailwind + Web3)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
