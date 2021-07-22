import React , {useState} from 'react';
import {View,FlatList,Text,StyleSheet,Button,ActivityIndicator} from 'react-native';
import { useSelector ,useDispatch} from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as CartActions from '../../store/actions/cart';
import * as OrderActions from '../../store/actions/orders';
import Card from '../../components/UI/Card';

const CartScreen = props => {

    const [isLoading,setIsLoading] = useState(false);

    const CartTotalAmount = useSelector(state => state.cart.totalAmount);
    const CartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items){
            transformedCartItems.push({
             productId : key,
             productTitle : state.cart.items[key].productTitle,
             productPrice : state.cart.items[key].productPrice,
             quantity : state.cart.items[key].quantity,
             sum : state.cart.items[key].sum,
            });
        }
        return transformedCartItems.sort((a,b) => 
           a.productId > b.productId ? 1 : -1
        );
    });
    const dispatch = useDispatch();

    const sendOrderHandler = async ()=>{
        setIsLoading(true);
       await dispatch(OrderActions.addOrder(CartItems,CartTotalAmount));
       setIsLoading(false);
    }

     return (
         <View style = {styles.screen}>
             <Card style = {styles.summary}>
                 <Text style={styles.summaryText}>Total Price : <Text style={styles.amount}>${Math.round(CartTotalAmount.toFixed(2)*100)/100}</Text></Text>
                {isLoading ? <ActivityIndicator  size = 'large' color={Colors.primary}/> :
                 <Button 
                 color = {Colors.accents}
                 title = "Order Now"
                 onPress = {sendOrderHandler}
                 disabled = {CartItems.length==0}
                 />}
                
             </Card>
             <FlatList 
               data = {CartItems}
               keyExtractor = {item => item.productId}
               renderItem = {itemData => (
                   <CartItem 
                     quantity = {itemData.item.quantity}
                     title = {itemData.item.productTitle}
                     amount = {itemData.item.sum}
                     deleteable
                     onRemove = {() =>{
                         dispatch(CartActions.removeFromCart(itemData.item.productId));
                     }}
                   />
               )}
             />
         </View>
     );
};

const styles = StyleSheet.create({
   screen : {
       margin : 20,
   },
   summary : {
       flexDirection : 'row',
       alignItems : 'center',
       justifyContent : 'space-between',
       marginBottom : 20,
       padding : 10,
   },
   summaryText : {
       fontFamily : 'open-sans-bold',
       fontSize : 18,
   },
   amount : {
       color : Colors.primary,
   },
});

export default CartScreen;