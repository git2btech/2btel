import { VStack, Text, HStack, Heading } from '@gluestack-ui/themed';
import { HomeHeader } from '@components/HomeHeader';
import { LineChart } from '@components/LineChart';
import { BarChart } from '@components/BarChart';


export function Home(){
    return (
        <VStack flex={1}>
            <HomeHeader />
            <LineChart />
            <BarChart />
        </VStack>
    )
}