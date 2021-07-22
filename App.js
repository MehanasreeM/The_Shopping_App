import React,{useState} from 'react';
import { Text, View } from 'react-native';
import { createStore,combineReducers,applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import CartReducer from './store/reducers/cart';
import OrderReducer from './store/reducers/orders';
import AuthReducer from './store/reducers/auth';
import ShopNavigator from './navigation/ShopNavigator';


//combining all the reducers

const rootReducer = combineReducers({
  products : productsReducer,
  cart : CartReducer,
  orders : OrderReducer,
  auth : AuthReducer,
});
 
//creating a store
const store = createStore(rootReducer,applyMiddleware(ReduxThunk));
 
//using custom fonts
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError = {(err) => console.log(err)}
      />
    );
  }
  return (
    <Provider store = {store}>
      <ShopNavigator />
    </Provider>
  );
}

