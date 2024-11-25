import { Image, StyleSheet, Platform, View, Text, useWindowDimensions, Pressable } from 'react-native';
import type { WP_REST_API_Page, WP_REST_API_Post } from 'wp-types';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { wpFetch } from '@/utils/wp/wpFetch';
import { WP_URLS, BASE_URL, DEBUG} from '@/utils/wp/constants';
import { removeElement, isTag } from 'domutils';
import { Link } from 'expo-router';
import { classesStyles, tagsStyles } from '@/utils/wp/styles';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    wpFetch(BASE_URL, WP_URLS.CHALLENGES).then(challenges => setChallenges(challenges)).catch(err => console.log(err));
    wpFetch(BASE_URL, WP_URLS.POSTS).then(posts => setPosts(posts)).catch(err => console.log(err));
    wpFetch(BASE_URL, WP_URLS.PAGES).then(pages => setPages(pages)).catch(err => console.log(err));
  }, [])

  const onElement = (element) => {
    if (element.tagName === 'a') removeElement(element);
    if (element.tagName === 'ul') removeElement(element);

    // Remove the first two children of an ol tag.
    // if (element.tagName === 'ol') {
    //   let i = 0;
    //   for (const child of element.children) {
    //     // Children might be text node or comments.
    //     // We don't want to count these.
    //     if (isTag(child) && i < 2) {
    //       removeElement(child);
    //       i++;
    //     }
    //   }
    // }
  }
  const domVisitors = {
    onElement: onElement
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
     
      <ThemedView>
        {
          challenges.map((c : WP_REST_API_Page, idx) => <Link id={idx} href={`page/${c.slug}`}>
            <Pressable>
              <ThemedText>{c.title.rendered+ ''}</ThemedText>
            </Pressable>
          </Link>
          )
        }
      </ThemedView>

      {/* <ThemedView>
        {
          pages.map((p : WP_REST_API_Post, idx) => 
          <ThemedView key={idx}>
            <ThemedText>{ p.title.rendered }</ThemedText>
            <RenderHTML
              contentWidth={width}
              tagsStyles={tagsStyles}
              classesStyles={classesStyles}
              source={{html: p.content.rendered}}
              domVisitors={domVisitors}
            />
            { DEBUG ? <ThemedText>{ p.content.rendered }</ThemedText> : '' }
          </ThemedView>)
        }
      </ThemedView> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
