import { VStack, HStack, Heading } from "@gluestack-ui/themed";
import { BarChart as BChart } from "react-native-gifted-charts";

export function BarChart (){
    const data=[ 
        {value:50, dataPointText: '50', label: "Maquina", frontColor: '#F75A68'},
        {value:80, dataPointText: '80', label: "Deposito", frontColor: '#22c55e'},
        {value:90, dataPointText: '90', label: "Expedicao", frontColor: '#0077E6'},
        {value:70, dataPointText: '70', label: "Recebimento", frontColor: '#eab308'},
        {value:50, dataPointText: '50', label: "Outros", frontColor: '#29292E'},
    ]

    return(
        <VStack bg="$textLight0" alignItems="center" p="$2" pr="$4" m="$4" rounded="$md" mb="$3">
            <Heading fontSize="$sm" color="$gray500" fontFamily="$heading" mb="$3">Quantidade de apontamentos por tipo</Heading>
            <BChart 
                data={data}
                barWidth={40}
            />;
        </VStack>
    );
}