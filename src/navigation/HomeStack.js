import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import { AuthContext } from './AuthProvider';
import EditProfire from '../screens/ProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import UploadScreen from '../screens/UploadScreen';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

/**
 * All chat app related screens
 */

function ChatApp() {
  const { logout } = useContext(AuthContext);

  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff5722'
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontSize: 20
        },
      }}
    >
      <ChatAppStack.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection:"row" }}>
              <IconButton
                icon='card-account-details'
                size={28}
                color='#000000'
                onPress={() => {}}
              />
              <IconButton
                icon='account-group'
                size={28}
                color='#000000'
                onPress={() => {}}
              />
              <IconButton
                icon='message-plus'
                size={28}
                color='#000000'
                onPress={() => navigation.navigate('AddRoom')}
              />
              <IconButton
                icon='account-edit'
                size={28}
                color='#000000'
                onPress={() => navigation.navigate('Profilescreen')}
              />
            </View>
          ),
          headerLeft: () => (
            <IconButton
              icon='logout-variant'
              size={28}
              color='#000000'
              onPress={() => logout()}
            />
          )
        })}
      />
      <ChatAppStack.Screen
        name='Room'
        component={RoomScreen}
        options={({ route }) => ({
          title: route.params.thread.name
        })}
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator screenOptions={{ presentation:"modal", headerShown:false }}>
      <ModalStack.Screen name='ChatApp' component={ChatApp} />
      <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
      <ModalStack.Screen name='Profilescreen' component={ProfileScreen} />
      {/* <ModalStack.Screen name='Uploadfilescreen' component={UploadScreen} /> */}

    </ModalStack.Navigator>
  );
}