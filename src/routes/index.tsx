import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { AuthRoutes } from "./auth.routes";

export function Routes(){
    const theme = DefaultTheme;
    theme.colors.background = gluestackUIConfig.tokens.colors.success100;

    return (
        <Box flex={1} bg="$success100">
            <NavigationContainer theme={theme}>
                <AuthRoutes />
            </NavigationContainer>
        </Box>
    )
}