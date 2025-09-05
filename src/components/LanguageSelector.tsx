import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supportedLanguages, getTranslation } from "@/lib/languages";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageSelect }: LanguageSelectorProps) {
  const t = (key: string) => getTranslation(key, selectedLanguage);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{t('step1Title')}</h2>
        <p className="text-muted-foreground">
          {selectedLanguage === 'hi' ? 'अपनी भाषा चुनें' : 
           selectedLanguage === 'bn' ? 'আপনার ভাষা নির্বাচন করুন' :
           'Choose Your Language'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto max-h-96 overflow-y-auto">
        {supportedLanguages.map((language) => (
          <Card 
            key={language.code}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-medium ${
              selectedLanguage === language.code 
                ? 'ring-2 ring-primary shadow-medium bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onLanguageSelect(language.code)}
          >
            <div className={`text-center space-y-2 ${language.rtl ? 'rtl' : ''}`}>
              <div className="text-2xl">{language.flag}</div>
              <div className="font-medium text-sm">{language.nativeName}</div>
              <div className="text-xs text-muted-foreground">{language.name}</div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          🌐 {t('feature4Desc')}
        </p>
      </div>
    </div>
  );
}