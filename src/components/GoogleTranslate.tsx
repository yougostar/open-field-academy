import { useEffect } from "react";
import { Globe } from "lucide-react";

export const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,te,ta,mr,gu,kn,ml,pa",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <Globe className="h-5 w-5 text-primary" />
      <div id="google_translate_element" className="flex-1"></div>
    </div>
  );
};
