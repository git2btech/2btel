import { View, Text, StatusBar } from "react-native"
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto"

export default function Index (){
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems:"center",
            backgroundColor: "#25c998"
        }}>
            <StatusBar barStyle="light-content" backgroundColor="#25c998" translucent/>
            {fontsLoaded ? <Text style={{ fontFamily: "Roboto_700Bold", color: "#fff"}}>Hello World</Text> : <View/>}
        </View>
    );
}