import { VStack, HStack, Heading } from "@gluestack-ui/themed";
import { LineChart as Lchart } from "react-native-gifted-charts";

export function LineChart(){
    const data=[ 
        {value:50, dataPointText: '50', label: "JAN"},
        {value:80, dataPointText: '80', label: "FEV"},
        {value:90, dataPointText: '90', label: "MAR"},
        {value:70, dataPointText: '70', label: "ABR"},
        {value:50, dataPointText: '50', label: "MAI"},
        {value:80, dataPointText: '80', label: "JUN"},
        {value:90, dataPointText: '90', label: "JUL"},
        {value:70, dataPointText: '70', label: "AGO"},
        {value:50, dataPointText: '50', label: "SET"},
        {value:80, dataPointText: '80', label: "OUT"},
        {value:90, dataPointText: '90', label: "NOV"},
        {value:70, dataPointText: '70', label: "DEZ"},
    ]

    return(
        <VStack bg="$textLight0" alignItems="center" p="$2" pr="$4" m="$4" rounded="$md" mb="$3">
            <Heading fontSize="$sm" color="$gray500" fontFamily="$heading" mb="$3">Quantidade de apontamentos por mês</Heading>
            <Lchart 
                data = {data} 
                color={'#22c55e'}
                textShiftY={-8}
                textShiftX={-5}
                textFontSize={13}
                thickness={3}
                width={300}
            />
        </VStack>
    );
}