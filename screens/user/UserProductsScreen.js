import React from 'react';
import { FlatList,Button ,Alert, View,Text , StyleSheet} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products'

const UserProductsScreen = props => {
 
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();
    const editProductHandler = (id) =>{
        props.navigation.navigate('EditProducts',{
              productId : id,
        });
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure ?','Want to delete this item ?',[
            {text : 'No',style : 'default'},
            {text : 'Yes' ,style : 'destructive',
             onPress : () => {
                dispatch(productActions.deleteProduct(id));
             },
        }
        ])
    }

    if(userProducts.length === 0){
        return(
            <View style = {{flex : 1,justifyContent : 'center' ,alignItems : 'center'}}>
                <Text>No Products Found.Start creating them now!!!</Text>
            </View>
        );
    }

    return (
        <FlatList 
          data = {userProducts}
          keyExtractor = {item => item.id}
          renderItem = {itemData => 
           <ProductItem 
              image = {itemData.item.imageUrl}
              title = {itemData.item.title}
              price = {itemData.item.price}
              onSelect = {() => {
                  editProductHandler (itemData.item.id);
              }}
           >
               <Button 
                color = {Colors.primary}
                title="Edit"
                 onPress={() => {
                    editProductHandler(itemData.item.id);
                }}
                 />
                <Button 
                color = {Colors.primary}
                title="Delete" 
                onPress={() => {
                    deleteHandler(itemData.item.id)}}
                />
           </ProductItem>
        }
        />
    );

};

export default UserProductsScreen;