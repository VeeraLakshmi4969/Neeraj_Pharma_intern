import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const products = [
  {
    id: 1,
    name: "Dolo 650 Tablet",
    company: "Micro Labs Ltd.",
    price: 35,
    image: "https://unsplash.com",
    description: "Dolo 650 Tablet is commonly used for temporary relief from fever and mild to moderate pain."
  },
  {
    id: 2,
    name: "Vitamin C Tablets",
    company: "HealthKart",
    price: 250,
    image: "https://unsplash.com",
    description: "Vitamin C Tablets are a dietary supplement that supports normal immune function."
  },
  {
    id: 3,
    name: "Foracort 200 Rotacaps",
    company: "Cipla Ltd.",
    price: 185,
    image: "https://unsplash.com",
    description: "Foracort 200 Rotacaps are prescribed for the management of certain respiratory conditions."
  },
  {
    id: 4,
    name: "Pantocid 40mg Tablet",
    company: "Sun Pharmaceutical Industries Ltd.",
    price: 165,
    image: "https://unsplash.com",
    description: "Pantocid 40mg Tablet is used as prescribed for conditions related to excess stomach acid."
  },
  {
    id: 5,
    name: "Volini Pain Relief Spray",
    company: "Sun Pharma Consumer Healthcare",
    price: 245,
    image: "https://unsplash.com",
    description: "Volini Pain Relief Spray is a topical product used for temporary relief from muscle and joint pain."
  },
  {
    id: 6,
    name: "Revital H",
    company: "Sun Pharma Consumer Healthcare",
    price: 310,
    image: "https://unsplash.com",
    description: "Revital H is a daily health supplement containing vitamins and minerals."
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home'); 
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const storedWishlist = await AsyncStorage.getItem('wishlist');
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  const saveCartData = async (newCart) => {
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const saveWishlistData = async (newWishlist) => {
    setWishlist(newWishlist);
    await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const addProductToCart = (product) => {
    let newCart = [...cart];
    const existingProduct = newCart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    saveCartData(newCart);
  };

  const updateCartQuantity = (productId, change) => {
    let newCart = cart.map(item => {
      if (item.id === productId) {
        const updatedQty = item.quantity + change;
        return updatedQty > 0 ? { ...item, quantity: updatedQty } : null;
      }
      return item;
    }).filter(Boolean);
    
    saveCartData(newCart);
  };

  const removeProductFromCart = (productId) => {
    let newCart = cart.filter(item => item.id !== productId);
    saveCartData(newCart);
  };

  const toggleWishlist = (product) => {
    let newWishlist = [...wishlist];
    const index = newWishlist.findIndex(item => item.id === product.id);

    if (index !== -1) {
      newWishlist.splice(index, 1);
    } else {
      newWishlist.push(product);
    }
    saveWishlistData(newWishlist);
  };

  const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalWishlistItems = wishlist.length;
  const orderSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const renderProductItem = ({ item }) => {
    const isInCart = cart.some(cartItem => cartItem.id === item.id);
    const isWishlisted = wishlist.some(wishItem => wishItem.id === item.id);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productCompany} numberOfLines={1}>{item.company}</Text>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.btn, isWishlisted ? styles.btnWishlisted : styles.btnOutline]} 
              onPress={() => toggleWishlist(item)}
            >
              <Text style={[styles.btnText, isWishlisted ? styles.wishTextActive : styles.btnTextDark]}>
                {isWishlisted ? "❤️ Saved" : "🤍 Wish"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, isInCart ? styles.btnAdded : styles.btnSuccess]} 
              onPress={() => !isInCart && addProductToCart(item)}
              disabled={isInCart}
            >
              <Text style={[styles.btnText, isInCart ? styles.btnAddedText : styles.btnTextLight]}>
                {isInCart ? "✓ Added" : "🛒 Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('Home')}>
          <Text style={styles.navTitle}>NeerajPharma</Text>
        </TouchableOpacity>
        
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => setCurrentScreen('Home')}>
            <Text style={[styles.linkText, currentScreen === 'Home' && styles.linkTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('Products')}>
            <Text style={[styles.linkText, currentScreen === 'Products' && styles.linkTextActive]}>Items</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setCurrentScreen('Wishlist')} style={styles.badgeWrapper}>
            <Text style={[styles.linkText, currentScreen === 'Wishlist' && styles.linkTextActive]}>Wish</Text>
            {totalWishlistItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalWishlistItems}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen('Cart')} style={styles.badgeWrapper}>
            <Text style={[styles.linkText, currentScreen === 'Cart' && styles.linkTextActive]}>Cart</Text>
            {totalCartItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {currentScreen === 'Home' && (
        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.heroIcon}>💊</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome to NeerajPharma</Text>
          <Text style={styles.subtitle}>Your Trusted Healthcare Partner</Text>
          <TouchableOpacity style={styles.shopNowBtn} onPress={() => setCurrentScreen('Products')}>
            <Text style={styles.btnTextLight}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'Products' && (
        <FlatList 
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.rowGridGap}
        />
      )}

            {currentScreen === 'Cart' && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.listContainer}>
            <Text style={styles.screenHeader}>Your Shopping Cart</Text>
            {cart.length === 0 ? (
              <Text style={styles.emptyText}>Your cart is empty.</Text>
            ) : (
              cart.map(item => (
                <View key={item.id} style={styles.horizontalCard}>
                  <Image source={{ uri: item.image }} style={styles.thumbnail} />
                  <View style={styles.horizontalCardDetails}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.productCompany}>{item.company}</Text>
                    <Text style={styles.productPrice}>₹{item.price * item.quantity}</Text>
                    
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity onPress={() => updateCartQuantity(item.id, -1)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValueText}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateCartQuantity(item.id, 1)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeProductFromCart(item.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {cart.length > 0 && (
            <View style={styles.summaryStickyCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>₹{orderSubtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charge:</Text>
                <Text style={[styles.summaryValue, { color: '#198754' }]}>FREE</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalDivider]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₹{orderSubtotal}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn}>
                <Text style={styles.btnTextLight}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
