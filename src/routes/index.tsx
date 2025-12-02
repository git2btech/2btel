import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { useAuth } from "@hooks/useAuth";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

export function Routes(){
    const { user, isLoadingStorageData } = useAuth();
    const theme = DefaultTheme;
    theme.colors.background = gluestackUIConfig.tokens.colors.success100;

    if(isLoadingStorageData){
        return <Loading />
    }

    return (
        <Box flex={1} bg="$success100">
            <SafeAreaProvider>
                <NavigationContainer theme={theme}>
                    {user.id ? <AppRoutes /> : <AuthRoutes />}
                </NavigationContainer>
            </SafeAreaProvider>
        </Box>
    )
}

// Quantidade de apontamentos por tipo
// Quantidade de apontamentos por produto
// Quantidade de apontamentos por hora
// Quantidade de apontamentos por usuario (somente admin)

// Backlog - 5 dias
// Melhoria - 15 dias
// Desenvolvimento - 20 dias