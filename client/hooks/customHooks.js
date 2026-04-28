import { Alert } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useReduxStateHook = (navigation, path = "Login") => {
  const { loading, error, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch({ type: "clearErrors" });
    }

    if (message && navigation) {
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, navigation, path]);

  return { loading };
};
