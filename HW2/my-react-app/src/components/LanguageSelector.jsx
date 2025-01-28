import { useLanguage } from '../utils/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'en_us', label: 'English', flag: '🇺🇸' },
    { code: 'he', label: 'עברית', flag: '🇮🇱' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="flex gap-2 mb-4">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
            ${language === code 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;