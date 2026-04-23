import React, { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import i18n from '../utils/locale';

type langContextObj = {
  lang: string | null;
  toggleLanguage: (sLang: string) => void;
};

const LangContext = React.createContext<langContextObj>({
  lang: '',
  toggleLanguage: (slang) => {},
});

interface Props {
  children: React.ReactNode;
}
export const LangContextProvider: React.FC<Props> = (props) => {
  const [lang, setLang] = useLocalStorage('language', 'vn');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  function toggleLanguage(sLang: string) {
    setLang(sLang);
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const langValue: langContextObj = {
    lang,
    toggleLanguage,
  };

  // eslint-disable-next-line react/destructuring-assignment
  return <LangContext.Provider value={langValue}>{props.children}</LangContext.Provider>;
};

export default LangContext;
