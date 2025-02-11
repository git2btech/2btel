import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SignIn } from '@screens/SignIn';
import { ResetPassword } from '@screens/ResetPassword';

type AuthRoutes = {
    signIn: undefined;
    resetPassword: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes(){
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="signIn" component={SignIn} />
            <Screen name="resetPassword" component={ResetPassword} />
        </Navigator>
    )
}
