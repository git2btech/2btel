import { createContext, ReactNode, useEffect, useState } from "react";
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser'
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserDTO } from "@dtos/UserDTO";
import api from "@services/api";

export type AuthContextDataProps = {
    user: UserDTO;
    updateProfileAndPermissions: (userUpdated: UserDTO) => Promise<void>;
    signIn: (userName: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

interface MyJwtPayload extends JwtPayload {
    Dominio: string;
    EntidadeId: number;
    Id: string;
    Nome: string;
    email: string;
    role: string;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingStorageData, setIsLoadingStorageData] = useState<boolean>(true);

    async function signIn(userName: string, password: string){
        try{
            const { data } = await api.post('/auth/entrar', {userName, password});
            if(data && data?.accessToken){
                const { Dominio, EntidadeId, Id, Nome, email, role } = jwtDecode<MyJwtPayload>(data?.accessToken);
                setUser({accessToken: data.accessToken,refreshToken: data.refreshToken,expiresIn: data.expiresIn,id: Id,name: Nome,email: email,userName: userName,dominio: Dominio,entidadeId: EntidadeId,filialId: 0,role: role, hasSetGroup: false});
                await storageUserSave({accessToken: data.accessToken,refreshToken: data.refreshToken,expiresIn: data.expiresIn,id: Id,name: Nome,email: email,userName: userName,dominio: Dominio,entidadeId: EntidadeId,filialId: 0, role: role, hasSetGroup: false})
                //const groups = await getProfileAndPermissions(Id);
            }
        } catch (error) {
            throw error;
        }
    }

    async function signOut(){
        try{
            setIsLoadingStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingStorageData(false);
        }
    }

    async function updateProfileAndPermissions(userUpdated: UserDTO){
        try{
            setUser(userUpdated);
            await storageUserSave(userUpdated);
        } catch (error) {
            throw error;
        }
    }

    async function loadUserData(){
        try{
            const userLoggedd = await storageUserGet();
            if(userLoggedd){
                setUser(userLoggedd);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, [])

    return(
        <AuthContext.Provider value={{user, signIn, isLoadingStorageData, signOut, updateProfileAndPermissions}}>
            {children}
        </AuthContext.Provider>
    )
}