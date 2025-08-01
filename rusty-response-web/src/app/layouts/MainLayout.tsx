import { NavLink, Outlet } from 'react-router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addCount, setString } from '../store/slices/countSlice';

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
        </main>
    </>
  )
}

export default MainLayout