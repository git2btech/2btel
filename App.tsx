import { StatusBar } from "react-native"
import './src/patches/backHandlerPatch';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto"
import { GluestackUIProvider, Text, Center } from "@gluestack-ui/themed"
import { config } from './config/gluestack-ui.config';
import { Loading } from "@components/Loading";
import { Routes } from "@routes/index";
import { AuthContextProvider } from "@contexts/AuthContext";
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

export default function App (){
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

    return (
        <GluestackUIProvider config={config}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
            <AuthContextProvider>
                <AutocompleteDropdownContextProvider>
                    {fontsLoaded ? <Routes /> : <Loading />}
                </AutocompleteDropdownContextProvider>
            </AuthContextProvider>
        </GluestackUIProvider>
    );
}