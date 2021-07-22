import React , {useEffect,useState,useCallback} from 'react';
import { View,Text,FlatList ,StyleSheet, Platform,Button,ActivityIndicator} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { HeaderButtons,Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as CartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import {  LogBox } from 'react-native';


LogBox.ignoreLogs([
    'Cannot update a component from inside the function body of a different component',
]);
const ProductsOverviewScreen = props => {
    
    props.navigation.setOptions({
        headerRight : () => (
           <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
               <Item title = "Cart" 
               iconName ={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
               onPress = {() => {
                   props.navigation.navigate('CartItem');
               }}
               />
           </HeaderButtons>
        )
    });

    const selectItemHandler = (id,title) => {
        props.navigation.navigate({name :'ProductDetail',
        params : {
            productId : id,
            title : title,
        }
   });
    };
  
    const [isLoading,setIsLoading]=useState(false);
    const [isRefreshing,setIsRefreshing] = useState(false);
    const [error,setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        console.log('Loaded');
        setError(null);
        setIsRefreshing(true);
        try {
        await dispatch(productsActions.fetchProducts());//return a promise
        }
        catch (err){
           setError(err.message);
        }
        setIsRefreshing(false)
        },[dispatch,setIsLoading,setError]);

    useEffect(() => {
       const willFocusSub = props.navigation.addListener('focus',loadProducts);

       //cleaning the listener
       return willFocusSub;

    },[loadProducts]);

    //this will run whenever the component is loaded
    useEffect (() => {
         setIsLoading(true)
         loadProducts().then(() => {
             setIsLoading(false);
         });
    },[dispatch,loadProducts]);

    if(error){
        return(
            <View style = {styles.centered}>
                <Text>An error occured!!!</Text>
                <Button 
                  title = "Try Again"
                  onPress = {loadProducts}
                  color = {Colors.primary}
                />
            </View>
        );
    }

    if(isLoading){
        return(
            <View style = {styles.centered}>
                <ActivityIndicator  size = 'large' color={Colors.primary}/>
            </View>
        );
    }

    if(!isLoading && products.length===0){
        return(
            <View style = {styles.centered}>
                <Text>No Products some.May be try to add some!!!</Text>
            </View>
        );
    }

    return(
        <FlatList
          onRefresh = {loadProducts}
          refreshing = {isRefreshing}
          data = {products}
          keyExtractor = {item => item.id}
          renderItem = {itemData =>
           <ProductItem 
             image = {itemData.item.imageUrl}
             title = {itemData.item.title}
             price = {itemData.item.price}
             onSelect = {() => {
                 selectItemHandler(itemData.item.id,itemData.item.title);
             }} >
              
              <Button 
                color = {Colors.primary}
                title="View Details"
                 onPress={() => {
                    selectItemHandler(itemData.item.id,itemData.item.title);
                }}
                 />
                <Button 
                color = {Colors.primary}
                title="To Cart" 
                onPress={() => {
                    dispatch(CartActions.addToCart(itemData.item));
                }}
                />
              
            </ProductItem>
        }
        
        />
    );

};

const styles = StyleSheet.create({
    centered : {
        flex : 1, 
        justifyContent : 'center' ,
        alignItems : 'center'
    },

});

export default ProductsOverviewScreen;
