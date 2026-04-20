import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Home from "./screens/Home";
import About from "./screens/About";
import ProductDetails from "./screens/ProductDetails";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import Payment from "./screens/Payment";
import Login from "./screens/auth/Login";
import Signup from "./screens/auth/Signup";
import Account from "./screens/account/Account";
import Notification from "./screens/account/Notification";
import Profile from "./screens/account/Profile";
import MyOrders from "./screens/account/MyOrders";
import Dashboard from "./screens/admin/Dashboard";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
      // initialRouteName="Login"
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Product Details" component={ProductDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="My Orders" component={MyOrders} />
        <Stack.Screen name="Admin Panel" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
