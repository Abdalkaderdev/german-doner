import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/doner-hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "ku", name: "Kurdish", flag: "🇮🇶", nativeName: "کوردی" },
    { code: "ar", name: "العربية", flag: "🇸🇾", nativeName: "العربية" },
  ];

  const handleLanguageSelect = (langCode: string) => {
    localStorage.setItem('selectedLanguage', langCode);
    navigate(`/menu/${langCode}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
        duration: 1
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Admin Access Button */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin')}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </motion.div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div 
            className="w-28 h-28 mx-auto mb-6 bg-warm-gradient rounded-full flex items-center justify-center shadow-warm"
            variants={logoVariants}
          >
            <span className="text-5xl font-bold text-white">🥙</span>
          </motion.div>
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            variants={itemVariants}
          >
            Welcome to
          </motion.h1>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-berlin-gold mb-4 drop-shadow-lg"
            variants={itemVariants}
          >
            Berlin Doner
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-2 drop-shadow-md"
            variants={itemVariants}
          >
            Authentic German-Turkish Cuisine
          </motion.p>
          <motion.p 
            className="text-lg text-white/80 drop-shadow-md"
            variants={itemVariants}
          >
            Fresh Made – Premium Quality
          </motion.p>
        </motion.div>

        {/* Language Selection */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
            <CardContent className="p-8">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-6"
                variants={itemVariants}
              >
                <Languages className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Choose Your Language
                </h2>
              </motion.div>
              
              <div className="grid gap-4">
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.code}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                  >
                    <Button
                      variant={lang.code === "en" ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="w-full text-lg py-6 justify-start gap-4 border-2 hover:border-primary transition-all duration-300"
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{lang.name}</span>
                        <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Berlin Doner Info */}
        <motion.div 
          className="grid md:grid-cols-2 gap-4 mt-8"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">Hauptstraße 123, Berlin</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-warm transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🕐</div>
                <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                <p className="text-muted-foreground">Daily: 11:00 - 22:00</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
