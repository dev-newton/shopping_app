import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { removeFromCart } from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";
import Card from "../../components/UI/Card";

export default function CartScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const transformedCartItems = [];

    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error.message, [{ text: "Okay" }]);
    }
  }, [error]);

  const sendOrderHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(addOrder(cartItems, cartTotalAmount));
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round((cartTotalAmount.toFixed(2) * 100) / 100)}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primaryColor} />
        ) : (
          <Button
            disabled={cartItems.length === 0}
            color={Colors.accent}
            title="Order Now"
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <View>
        <Text style={{ fontFamily: "open-sans-bold" }}>CART ITEMS</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>
            NO PRODUCT HAS BEEN ADDED TO CART !
          </Text>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={item => item.productId}
            renderItem={itemData => (
              <CartItem
                quantity={itemData.item.quantity}
                title={itemData.item.productTitle}
                amount={itemData.item.sum}
                deletable
                onRemove={() => {
                  dispatch(removeFromCart(itemData.item.productId));
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

CartScreen.navigationOptions = navData => {
  return {
    headerTitle: "Your Cart"
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
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: Colors.primaryColor
  },
  emptyCartText: {
    color: "#888",
    textAlign: "center",
    marginVertical: "50%",
    fontFamily: "open-sans",
    fontSize: 14
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
