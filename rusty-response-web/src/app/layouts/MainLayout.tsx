import { NavLink, Outlet } from 'react-router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addCount, setString } from '../store/slices/countSlice';
import Text from '../../components/ui/Text';

const MainLayout = () => {
  const {count, string} = useAppSelector(state => state.count);
  const dispatch = useAppDispatch();

  return (
    <>
        <header>
            <h1>Rusty Response</h1>
            <ul>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/example'>Example</NavLink>
                <NavLink to='/signin'>Sign In</NavLink>
                <NavLink to='/signup'>Sign Up</NavLink>
            </ul>
        </header>
        <main>
            <h2>Count: <p>{count}</p></h2>
            <button onClick={() => dispatch(addCount())}>Add count</button>
            <h2>String: <p>{string}</p></h2>
            <input type="text" 
              value={string}
              onChange={(e) => dispatch(setString(e.target.value))}/>
            <Outlet/>

            <Text type='xxl' weight={600}>Rusty Response XXL</Text>
            <Text type='small' color={5}>Rusty Response Small </Text>
            <Text type='xl'>Rusty Response XL</Text>
            <Text type='large'>Rusty Response Large</Text>
            <Text type='medium'>Rusty Response Medium</Text>
            <Text type='small'>Rusty Response Small</Text>
            <Text type='tiny'>Rusty Response Tiny</Text>
        </main>
    </>
  )
}

export default MainLayout