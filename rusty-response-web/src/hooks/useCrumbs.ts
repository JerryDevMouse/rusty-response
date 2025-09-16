import { useLocation } from 'react-router';
import capitalizeFirstLetter from '../helpers/capitalizeFirstLetter';

const useCrumbs = () => {
  const {pathname} = useLocation();    
  
  const [section=' ', page=' ', nested=' '] = pathname.split('/').filter(Boolean);
  const isNested = nested.trim();

  const sectionLink = `/${section}/${isNested ? page : ''}`;
  const sectionText = capitalizeFirstLetter(isNested ? page : section);

  const pageLink = pathname;
  const pageText = capitalizeFirstLetter(isNested ? nested : page);

  return {
    sectionLink, 
    sectionText, 
    pageLink,
    pageText
  }
}

export default useCrumbs