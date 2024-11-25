import { BASE_URL, WP_URLS } from '@/utils/wp/constants';
import { wpFetch } from '@/utils/wp/wpFetch';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function PageScreen() {
  const [page, setPage] = useState({});
  const { width } = useWindowDimensions();
  const { pageId } = useLocalSearchParams<{ page: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 20,
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
  
  useEffect(() => {
    wpFetch(BASE_URL, WP_URLS.PAGES).then(posts => setPage(posts)).catch(err => console.log(err));
  }, [])

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
