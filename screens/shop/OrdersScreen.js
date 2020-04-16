import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import Colors from "../../constants/Colors";
import * as ordersActions from "../../store/actions/orders";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", () => {
      loadOrders();
    });

    //runs when component is destroyed or about to be re-run
    return () => {
      willFocusSub.remove();
    };
  }, [loadOrders]);

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(ordersActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadOrders}
          color={Colors.primaryColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    // headerRight: (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       title="Menu"
    //       iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
    //       onPress={() => {}}
    //     />
    //   </HeaderButtons>
    // )
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default OrdersScreen;
