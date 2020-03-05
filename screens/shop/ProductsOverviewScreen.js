import React, { useEffect } from "react";
import { View, Text, FlatList, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

export default function ProductsOverviewScreen(props) {
  const products = useSelector(state => state.products.availableProducts);

  const dispatch = useDispatch();
  const count = useSelector(state => state.cart.count);

  useEffect(() => {
    // props.navigation.setParams({ mealTitle: selectedMeal.title });
    props.navigation.setParams({ count: count });
  }, [count]);

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          title={itemData.item.title}
          price={itemData.item.price}
          image={itemData.item.imageUrl}
          onViewDetail={() => {
            props.navigation.navigate("ProductDetail", {
              productId: itemData.item.id,
              productTitle: itemData.item.title
              // productImage: itemData.item.imageUrl
            });
          }}
          onAddToCart={() => {
            dispatch(cartActions.addToCart(itemData.item));
          }}
        />
      )}
    />
  );
}

ProductsOverviewScreen.navigationOptions = navData => {
  const count = navData.navigation.getParam("count");
  return {
    headerTitle: "All Products",
    headerRight: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: Platform.OS === "android" ? "#fff" : Colors.primaryColor
          }}
        >
          {count}
        </Text>
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      </View>
    )
  };
};
