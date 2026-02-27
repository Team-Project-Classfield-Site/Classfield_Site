import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({ 
    username: null,
    setUsername: () => {},
    isAuth: () => null,
    clear: () => {},
});

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || null;
    });

    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);;
        } else {
            localStorage.removeItem('username');
        }
    }, [username]);

    const clear = () => { setUsername(null); localStorage.removeItem('access_token'); };
    const isAuth = () => username !== null;

    return (
        <UserContext.Provider value={{username, setUsername, clear, isAuth}}>
            {children}
        </UserContext.Provider>
    );
}