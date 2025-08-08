import { useLocation } from 'react-router';

const useCrumbs = () => {
    const {pathname} = useLocation();    
    const [section=' ', page=' '] = pathname.split('/').filter(Boolean);

  return [section, page]
}

export default useCrumbs