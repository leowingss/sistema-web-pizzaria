import { useState, useEffect, createContext, ReactNode } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    signOut: () => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {

    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/');
    } catch (error) {
        console.log('Erro ao deslogar');
    }
}


export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    useEffect(() => {
        // tentar pegar o token no cookie
        const { '@nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(res => {
                const { id, name, email } = res.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
                .catch(() => {
                    signOut();
                })
        }

    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expirar em 1 mes
                path: '/' // caminhos que tem acesso ao cookie
            });

            setUser({
                id,
                name,
                email
            });

            //Passar o token para as prox req

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success(`Bem vindo(a) novamente ${user.name}`);


            Router.push('/dashboard');


        } catch (error) {
            toast.error('Erro ao acessar');
            console.log('Erro ao acessar', error);
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {

        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            });

            toast.success('Conta criada com sucesso');

            Router.push('/');

        } catch (error) {
            toast.error('Erro ao cadastrar');
            console.log('Erro ao cadastrar', error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            signOut,
            signUp
        }}>
            {children}
        </AuthContext.Provider>
    )
}