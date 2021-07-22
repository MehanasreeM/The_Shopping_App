import React , {useReducer,useCallback,useState, useEffect} from 'react';
import { View,StyleSheet,KeyboardAvoidingView,ScrollView,Alert ,ActivityIndicator} from 'react-native';
import { HeaderButtons ,Item } from 'react-navigation-header-buttons';
import { useSelector,useDispatch } from 'react-redux';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';
import Input from '../../components/UI/Input';
import {  LogBox } from 'react-native';


LogBox.ignoreLogs([
    'Cannot update a component from inside the function body of a different component',
]);

//like redux-reducer useReducer also accept state and action
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';//action
const formReducer = (state,action) => {
    
    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input] : action.value,
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid,
        }
        let updatedformIsValid = true;
        for(const key in updatedValidities){
            updatedformIsValid =updatedformIsValid  && updatedValidities[key];
        }
        return {
            formIsValid : updatedformIsValid,
            inputValues : updatedValues,
            inputValidities : updatedValidities,
        };
    }
    return state;

}

const EditProductScreen = props => {

    const [isLoading,setIsLoading] = useState(false);
    const [error , setError] = useState();
   
    const prodId = props.route.params.productId;
    const editedProduct = useSelector (state => state.products.userProducts.find(prod => prod.id === prodId));

   const [formState,dispatchFormState] = useReducer (formReducer,{
        //inital State for our form Reducer
        inputValues : {
            title : editedProduct ? editedProduct.title : '',
            imageUrl : editedProduct ? editedProduct.imageUrl : '',
            description : editedProduct ? editedProduct.description : '',
            price : '',
        },
        inputValidities : {
            title : editedProduct ? true : false,
            imageUrl : editedProduct ? true : false,
            description : editedProduct ? true : false,
            price : editedProduct ? true : false,
        },
        formIsValid : editedProduct ? true : false,
     });

     
 
     const dispatch = useDispatch();
     
     

    props.navigation.setOptions({
        headerTitle : prodId !== 'add' ? 'Edit Product' : 'Add Product',
        headerRight : () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title = "Save" iconName = 'ios-checkmark' onPress={submitHandler} />
          </HeaderButtons>
          ) ,
    });

    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);

    const submitHandler = async () => {
        if(!formState.formIsValid){
            //giving alert when user doesn't give a vaild title
            Alert.alert('Wrong input!','Please correct the error in the form',[{
                text : 'Okay'
            }]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try{
        if(editedProduct){
            await dispatch(productsActions.updateProduct(prodId,
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl));
        }
        else{
           await dispatch(productsActions.createProduct(
                formState.inputValues.title,
                formState.inputValues.description,
                formState.inputValues.imageUrl,
                 +formState.inputValues.price));
        }
        props.navigation.goBack();
    }catch (err){
        setError(err.message);
    }
        setIsLoading(false);
       
    };

    const inputChangeHandler = useCallback((inputIdentifier,inputValue,inputValidity) => {
        
       dispatchFormState({
           type : FORM_INPUT_UPDATE,
           value : inputValue,
           isValid : inputValidity,
           input : inputIdentifier,
        });
    },[dispatchFormState]);
   

    if(isLoading){
        return(
            <View style = {styles.centered}>
                <ActivityIndicator  size = 'large' color={Colors.primary}/>
            </View>
        );
    }

    

    return (
    <KeyboardAvoidingView
    style = {{flex : 1}}
    behavior="padding"
    keyboardVerticalOffset={50}
    >  
    <ScrollView>
       <View style={styles.form}>
         <Input 
            id = 'title'
            label = 'Title'
            errorText = 'Please enter a Valid title!'
            keyboardType = 'default'
            autoCapitalize = 'sentences'
            autoCorrect
            returnKeyType = 'next'
            onInputChange = {inputChangeHandler}
            initialValue = {editedProduct ? editedProduct.title : ''}
            initiallyValid = {!!editedProduct}
            required
         />
        
        <Input 
             id = 'imageUrl'
            label = 'Image Url'
            errorText = 'Please enter a Valid image Url!'
            keyboardType = 'default'
            returnKeyType = 'next'
            onInputChange = {inputChangeHandler}
            initialValue = {editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid = {!!editedProduct}
            required
         />
      {editedProduct ? null :  
         <Input 
         id = 'price'
         label = 'Price'
         errorText = 'Please enter a Valid price!'
         keyboardType = 'decimal-pad'
         returnKeyType = 'next'
         onInputChange = {inputChangeHandler}
         required
         min={0.1}
       
      />}
         <Input 
            id = 'description'
            label = 'Description'
            errorText = 'Please enter a Valid Description!'
            keyboardType = 'default'
            autoCapitalize = 'sentences'
            autoCorrect
            multiline
            numberOfLines = {3}
            onInputChange = {inputChangeHandler}
            initialValue = {editedProduct ? editedProduct.description : ''}
            initiallyValid = {!!editedProduct}
            required
            minLength = {5}
        />
      </View>   
    </ScrollView>  
    </KeyboardAvoidingView>  
    );
};

const styles = StyleSheet.create({
    form : {
        margin : 20,
    },
    centered : {
        flex : 1, 
        justifyContent : 'center' ,
        alignItems : 'center'
    },

    
});

export default EditProductScreen;