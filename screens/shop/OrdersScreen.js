import React , {useEffect,useState}  from 'react';
import { View , FlatList,StyleSheet ,Text,ActivityIndicator} from 'react-native';
import { useSelector , useDispatch } from 'react-redux';

import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
     const [isLoading,setIsLoading] = useState(false);
      
      const dispatch = useDispatch();

      useEffect(() => {
            setIsLoading(true);
            dispatch(orderActions.fetchOrders()).then(() => {
               setIsLoading(false);
            });
      },[dispatch]);

        const orders = useSelector(state => state.orders.orders);
        if(isLoading){
         return(
             <View style = {styles.centered}>
                 <ActivityIndicator  size = 'large' color={Colors.primary}/>
             </View>
         );
     }

     if(orders.length === 0){
      return(
          <View style = {{flex : 1,justifyContent : 'center' ,alignItems : 'center'}}>
              <Text>No order Found.Start Ordering Products now!!!</Text>
          </View>
      );
  }

        return (
           <FlatList 
              data = {orders}
              keyExtractor = {item => item.id}
              renderItem = {itemData => 
               <OrderItem 
                 amount = {itemData.item.totalAmount}
                 date = {itemData.item.readableDate}
                 items = {itemData.item.items}
               />
            }
           />
        );
    
};

const styles = StyleSheet.create({
   centered : {
      flex : 1,
      justifyContent : 'center',
      alignItems : 'center',
   },

});

export default OrdersScreen;