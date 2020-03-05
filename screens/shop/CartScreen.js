import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { removeFromCart } from "../../store/actions/cart";

export default function CartScreen() {
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

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            $
            {cartTotalAmount < 0
              ? (cartTotalAmount * -1).toFixed(2)
              : cartTotalAmount.toFixed(2)}
          </Text>
        </Text>
        <Button
          disabled={cartItems.length === 0}
          color={Colors.accent}
          title="Order Now"
        />
      </View>
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

// CartScreen.navigationOptions = navData => {
//   return {
//     headerTitle: "All Products",
//     headerRight: (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Menu"
//           iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//           onPress={() => {}}
//         />
//       </HeaderButtons>
//     )
//   };
// };

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5, //for android
    borderRadius: 10,
    backgroundColor: "#fff"
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
  }
});
