import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  Button,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

export default function ProductsOverviewScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const products = useSelector(state => state.products.availableProducts);

  const dispatch = useDispatch();
  const count = useSelector(state => state.cart.count);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
      // productImage: itemData.item.imageUrl
    });
  };

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", () => {
      loadProducts();
    });

    //runs when component is destroyed or about to be re-run
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    // props.navigation.setParams({ mealTitle: selectedMeal.title });
    props.navigation.setParams({ count: count });
  }, [count]);

  const loadProducts = useCallback(async () => {
    setError(null);
    // setIsLoading(true);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }

    // setIsLoading(false);
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
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

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          title={itemData.item.title}
          price={itemData.item.price}
          image={itemData.item.imageUrl}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primaryColor}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primaryColor}
            title="Add To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
}

ProductsOverviewScreen.navigationOptions = navData => {
  const count = navData.navigation.getParam("count");
  return {
    headerTitle: "All Products",
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
            title="Cart"
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

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});
