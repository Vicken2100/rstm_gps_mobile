import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddTruckScreen from "./screens/AddTruckScreen";
import AddUserScreen from "./screens/AddUserScreen";
import HomeAdminScreen from "./screens/HomeAdminScreen";
import HomeDriverScreen from "./screens/HomeDriverScreen";
import HomeSalesScreen from "./screens/HomeSalesScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingScreen";
import MaintenanceScreen from "./screens/MaintenanceScreen";
import TruckDetailScreen from "./screens/DetailTruck";
import EditTruckScreen from "./screens/EditTruck";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SalesScreen from "./screens/SalesScreen";
import AddDeliveryScreen from "./screens/AddDeliveryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
        <Stack.Screen name="HomeSales" component={HomeSalesScreen} />
        <Stack.Screen name="HomeDriver" component={HomeDriverScreen} />
        <Stack.Screen name="User" component={AddUserScreen} />
        <Stack.Screen name="Truk" component={AddTruckScreen} />
        <Stack.Screen name="TruckDetail" component={TruckDetailScreen} />
        <Stack.Screen name="Delivery" component={SalesScreen} />
        <Stack.Screen name="AddDelivery" component={AddDeliveryScreen} />

        <Stack.Screen name="EditTruck" component={EditTruckScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="Maintenance" component={MaintenanceScreen} />

        {/* Tambahkan screen lain di sini ketika diperlukan */}
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}