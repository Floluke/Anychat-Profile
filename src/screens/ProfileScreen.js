import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground,Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormInput from '../components/FormInput';
import useStatsBar from '../utils/useStatusBar';
import { AuthContext } from '../navigation/AuthProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';
import storage from 'firebase/storage';

export default function ProfileScreen({ navigation }) {
  useStatsBar('dark-content');
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);


  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri };
        console.log(source);
        setImage(source);
      }
    });
  };
  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
  };


  return (

    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon='close-circle'
          size={36}
          color='#F86379'
          onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={selectImage}>
          <View style={{
            height: 100,
            width: 100,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <ImageBackground
              source={{
                uri: image.uri,
              }}
              style={{ height: 100, width: 100 }}
              imageStyle={{ borderRadius: 15 }}>
              <View style={{
                width: 100,
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Icon name="camera" size={35} color="#9A9A9A"
                  style={{
                    opacity: 0.3
                  }}
                />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome</Text>
        <Text>{user.uid}</Text>
        <Text>{user.email}</Text>
        <FormInput
          labelName='Change Name'
        />
        {image !== null ? (
          <Image source={{ uri: image.uri }} style={styles.imageBox} />
        ) : null}
        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>ยืนยัน</Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
}









const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 1
  },
  innerContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10
  },
  buttonLabel: {
    fontSize: 22
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#7DCEA0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500'
  }
});