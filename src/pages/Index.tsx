import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/doner-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const languages = [
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  ];

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-warm-gradient rounded-full flex items-center justify-center shadow-warm">
            <span className="text-4xl font-bold text-white">🥙</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Deutscher Döner
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 drop-shadow-md">
            Frisch Gemacht – Nur bei uns.
          </p>
          <p className="text-lg text-white/80 drop-shadow-md">
            Fresh Made – Only at our place.
          </p>
        </div>

        {/* Language Selection */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Languages className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                Wähle deine Sprache / Choose Language
              </h2>
            </div>
            
            <div className="grid gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="hero"
                  size="lg"
                  onClick={() => navigate(`/menu/${lang.code}`)}
                  className="text-lg py-6 justify-start gap-4"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-semibold">{lang.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Standort / Location</h3>
              <p className="text-muted-foreground">Hauptstraße 123, Berlin</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Öffnungszeiten / Hours</h3>
              <p className="text-muted-foreground">Mo-So: 11:00 - 22:00</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
