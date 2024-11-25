import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import alert from '@/utils/alert';
import { BASE_URL, WP_URLS } from '@/utils/wp/constants';
import { classesStyles, tagsStyles } from '@/utils/wp/styles';
import { wpFetch } from '@/utils/wp/wpFetch';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import RenderHTML from 'react-native-render-html';
import type { WP_REST_API_Post } from 'wp-types';

export default function PageScreen() {
  const [page, setPage] = useState<WP_REST_API_Post | null>(null);
  const { width } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [code, onChangeCode] = useState<string>('');

  useEffect(() => {
    //wpFetch(BASE_URL, `${WP_URLS.PAGES}?slug=${slug}`).then(pages => setPage(pages[0])).catch(err => console.log(err));
    wpFetch(BASE_URL, `${WP_URLS.CHALLENGES}?slug=${slug}`).then(pages => setPage(pages[0])).catch(err => console.log(err));
  }, []);

  const showAlert = (title: string, message: string) => {
    alert(
      title,
      message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Ok", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: true }
    );
  };

  const validate = () => {
    if (page?.id) {
      console.log(page.id);
      fetch(`${BASE_URL}/${WP_URLS.CHALLENGESVALIDATION}/${page.id}`, {
        headers: {
          'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          code
        })
      }).then(res => res.json())
        .then(data => {
          console.log(data);
          switch(data.status_code) {
            case 200:
              showAlert("Correct", data.message);
              break;
            default:
              showAlert("Incorrect", data.message);
          };
        })
        .catch(data => showAlert("Error", data.message));
    }
  }

  console.log(page);

  if (page) {
    return (
      <ThemedView>
        <ThemedText>
          {page?.title?.rendered}
        </ThemedText>
  
        <RenderHTML
          contentWidth={width}
          tagsStyles={tagsStyles}
          classesStyles={classesStyles}
          source={{html: page.content.rendered}}
        />

        <ThemedView>
          <TextInput
            onChangeText={onChangeCode}
            value={code}
            placeholder="Challenge code"
            keyboardType="numeric"
          />
        </ThemedView>

         
        <Pressable onPress={validate}>
          <ThemedText>Valider</ThemedText>
        </Pressable>
      </ThemedView>
    );
  };
}
