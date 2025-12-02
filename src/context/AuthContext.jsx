import { createContext, useContext, useState, useEffect } from "react";
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if(storedUser && storedToken){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);

    const register = async (userData) => {
        try{
            const response = await api.post('/auth/register',userData);
            const {user,token} = response.data.data;

            localStorage.setItem('token',token);
            localStorage.setItem('user',JSON.stringify(user));
            setUser(user);

            return {success : true};
        }catch(error){
            return {
                success : false,
                message : error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login',credentials);
            const {user,token} = response.data.data;

            localStorage.setItem('token',token);
            localStorage.setItem('user',JSON.stringify(user));
            setUser(user);
            return {success: true};
        } catch(error){
            return{
                success : false,
                message : error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be user within AuthProvider');
    }
    return context;
};

