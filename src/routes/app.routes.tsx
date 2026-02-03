import { Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import { Points } from '@screens/Points';
import { PointsItens } from '@screens/PointsItens';
import { CreatePoint } from '@screens/CreatePoint';
import { CreatePointIten } from '@screens/CreatePointIten';
import { ScanPoint } from '@screens/ScanPoint';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeSvg from '@assets/home.svg';
import ProfileSvg from "@assets/profile.svg";
import HistorySvg from "@assets/history.svg"



type AppRoutes = {
    home: undefined;
    profile: undefined;
    points: undefined;
    pointsItens: { pointID: number };
    createPoint: undefined;
    createPointIten: undefined;
    scanPoint: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes(){
    const { tokens } = gluestackUIConfig;
    const iconSize = tokens.space["6"];
    const insets = useSafeAreaInsets();

    const baseHeight = 40;
    const safeBottom = insets.bottom || 0;
    
    return (
        <Navigator screenOptions={{ 
            headerShown: false, 
            tabBarShowLabel: false, 
            tabBarActiveTintColor: tokens.colors.green500, 
            tabBarInactiveTintColor: tokens.colors.gray200,
            tabBarStyle: {
                height: baseHeight + safeBottom,
                paddingBottom: safeBottom || 8,
                paddingTop: 8,
            }
        }}>
            <Screen name="points" component={Points} options={{ tabBarIcon: ({ color }) => <HistorySvg fill={color} width={iconSize} height={iconSize}/>}}/>
            <Screen name="home" component={Home} options={{ tabBarIcon: ({ color }) => <HomeSvg fill={color} width={iconSize} height={iconSize}/>}}/>
            <Screen name="profile" component={Profile} options={{ tabBarIcon: ({ color }) => <ProfileSvg fill={color} width={iconSize} height={iconSize}/>}}/>
            <Screen name="pointsItens" component={PointsItens} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }}}/>
            <Screen name="createPoint" component={CreatePoint} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }}}/>
            <Screen name="createPointIten" component={CreatePointIten} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }}}/>
            <Screen name="scanPoint" component={ScanPoint} options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }}}/>
        </Navigator>
    )
}
