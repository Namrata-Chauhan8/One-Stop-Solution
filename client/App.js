import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import store from "./redux/store";
import { useEffect, useState } from "react";
import { getUserData } from "./redux/features/auth/userAction";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
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
);

const GuestNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
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
  </Stack.Navigator>
);

const BootstrapNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(getUserData())
      .catch(() => {
        dispatch({ type: "clearErrors" });
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, [dispatch]);

  if (!authChecked) {
    return (
      <View style={styles.bootstrapContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthNavigator /> : <GuestNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <BootstrapNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  bootstrapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
