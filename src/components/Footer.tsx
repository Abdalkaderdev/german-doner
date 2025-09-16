import { Phone, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  isRTL?: boolean;
}

export default function Footer({ isRTL = false }: FooterProps) {
  return (
    <footer className="bg-[hsl(0_0%_17%)] text-[hsl(42_73%_94%)] py-8 px-4 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-6">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center">
            {/* Phone */}
            <a 
              href="tel:+9647505552421" 
              className="flex items-center gap-2 hover:text-[hsl(39_92%_53%)] transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">+964 750 555 2421</span>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/german_doner_rest/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[hsl(39_92%_53%)] transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="font-medium">@german_doner_rest</span>
            </a>
            
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/people/German-doner/61578288360345/?mibextid=wwXIfr&rdid=T9Jt65k1DGFEstZI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1E2AWyz51e%2F%3Fmibextid%3DwwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[hsl(39_92%_53%)] transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="font-medium">German Doner</span>
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-[hsl(42_73%_94%)]/70">
            <p>© 2024 German Doner. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}