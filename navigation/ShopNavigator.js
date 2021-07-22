import React from 'react';
import { Platform , SafeAreaView,Button,View} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator , DrawerItemList} from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import { createSwitchNavigator } from '@react-navigation/compat';
import { HeaderButtons ,Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import Colors from "../constants/Colors";
import OrdersScreen from '../screens/shop/OrdersScreen';
import CustomHeaderButton from '../components/UI/HeaderButton';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import * as authActions from '../store/actions/auth';

//creating a stack Navigator
const stack = createStackNavigator();

const ProductsNavigator = () =>(
    <stack.Navigator
      screenOptions = {{
          headerStyle : {
              backgroundColor : Platform.OS === 'android' ? Colors.primary : '',
          },
          headerTitleStyle:{
              fontFamily : 'open-sans-bold',
          },
          headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary,
      }}
    >
        <stack.Screen name="ProductsOverview" component={ProductsOverviewScreen}
           options = {({navigation})=>{
            return {
              title : 'All Products',
              headerLeft : () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                  <Item title = "Menu" iconName = 'ios-menu' onPress={() =>{
                    navigation.toggleDrawer();
                  }} />
                </HeaderButtons>
              )
            };
           }
          }
        />
        <stack.Screen name="ProductDetail" component={ProductDetailScreen}
          options = {({route})=>{
            const productTitle= route.params.title;
            return{
                headerTitle : productTitle,
            };
          }}
        />
        <stack.Screen name="CartItem" component={CartScreen} 
          options = {{
              headerTitle : 'Your Cart',
          }}
        />
    </stack.Navigator>
);

const order = createStackNavigator();
const OrdersNavigator = () => (
    <order.Navigator
    screenOptions = {{
        headerStyle : {
            backgroundColor : Platform.OS === 'android' ? Colors.primary : '',
        },
        headerTitleStyle:{
            fontFamily : 'open-sans-bold',
        },
        headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary,
    }}
    >
        <order.Screen name = "Orders" component ={OrdersScreen}
           options = {({navigation})=>{
            return {
              title : 'Your Orders',
              headerLeft : () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                  <Item title = "Menu" iconName = 'ios-menu' onPress={() =>{
                    navigation.toggleDrawer();
                  }} />
                </HeaderButtons>
              ), 
            };
           }
          }
        />
    </order.Navigator>
);

const user = createStackNavigator();
const AdminNavigator = () => (
  <user.Navigator
  screenOptions = {{
      headerStyle : {
          backgroundColor : Platform.OS === 'android' ? Colors.primary : '',
      },
      headerTitleStyle:{
          fontFamily : 'open-sans-bold',
      },
      headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary,
  }}
  >
      <user.Screen name = "UserProducts" component ={UserProductsScreen}
         options = {({navigation})=>{
          return {
            title : 'Your Products',
            headerLeft : () => (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title = "Menu" iconName = 'ios-menu' onPress={() =>{
                  navigation.toggleDrawer();
                }} />
              </HeaderButtons>
            ),
            headerRight : () => (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item title = "Add" iconName = 'ios-create' onPress={() =>{
                navigation.navigate('EditProducts',{
                  productId : 'add',
                });
              }} />
            </HeaderButtons>
            ) 
          };
         }
        }
      />
      <user.Screen name = "EditProducts" component = {EditProductScreen} />
  </user.Navigator>
);

const drawer = createDrawerNavigator();

export const AppNavigator = () => {
  const dispatch = useDispatch();
  return (
    <drawer.Navigator
      drawerContentOptions= {{
          activeTintColor : Colors.primary,
      }}
      drawerContent ={props => {
         
          return(
            <View style = {{flex : 1 , paddingTop : 20}}>
              <SafeAreaView forceInset = {{top : 'always' , horizontal : 'never'}}>
                 <DrawerItemList  {...props}/>
                 <View style = {{paddingHorizontal : 50}}>
                 <Button 
                  title = "Logout"
                  color = {Colors.primary}
                  onPress = {() => {
                    dispatch(authActions.logout());
                    props.navigation.navigate('Auth');
                  }}
                 />
                 </View>
              </SafeAreaView>
            </View>
          );
      }}
    >
        <drawer.Screen name = "Products" component = {ProductsNavigator}
          options  = {{
             drawerIcon : drawerconfig => <Ionicons 
               name = {Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
               size = {23}
               color = {drawerconfig.color}
             />
          }}
        />
        <drawer.Screen name = "Orders" component = {OrdersNavigator} 
          options  = {{
            drawerIcon : drawerconfig => <Ionicons 
              name = {Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size = {23}
              color = {drawerconfig.color}
            />
         }}
        />
        <drawer.Screen name = "Admin" component = {AdminNavigator} 
          options  = {{
            drawerIcon : drawerconfig => <Ionicons 
              name = {Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size = {23}
              color = {drawerconfig.color}
            />
         }}
        />
    </drawer.Navigator>);
};

const Auth = createStackNavigator();
 export const AuthNavigator = () => (
  <Auth.Navigator
  screenOptions = {{
    headerStyle : {
        backgroundColor : Platform.OS === 'android' ? Colors.primary : '',
    },
    headerTitleStyle:{
        fontFamily : 'open-sans-bold',
    },
    headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary,
}}
  >
    <Auth.Screen name = "Authentication" component={AuthScreen}
     options = {{
       headerTitle : 'Authenticate',
     }}
    />
  </Auth.Navigator>
);

const MainNavigator = createSwitchNavigator({
  Startup : StartupScreen,
  Auth : AuthNavigator,
  Shop : AppNavigator,
});

const ShopNavigator = () => (
    <NavigationContainer>
        <MainNavigator />
    </NavigationContainer>
);

export default ShopNavigator;

