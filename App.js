import React, {Component} from 'react';
import {StyleSheet,SafeAreaView,} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';

import AsyncStorage from '@react-native-community/async-storage';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.currentUrl = '';
    this.myWebView = React.createRef();

    this.provideMeSavedCookies().then((savedCookies) => {
      console.log('==== savedCookies =======');
      console.log(savedCookies);
    });
  }

  onLoadEnd = (syntheticEvent) => {
    setTimeout(() => {
      this.myWebView.current.postMessage('document.title');
    }, 100);

    console.log('onLoadEnd');
    console.log('===============================================');
    console.log(this.currentUrl);

    let successUrl = 'https://hisably.com/app/report.php';

    // Get & Save cookies here
    if (this.currentUrl === successUrl) {
      // Get cookies as a request header string
      CookieManager.get(successUrl).then((res) => {
        console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
        AsyncStorage.setItem('savedCookies', JSON.stringify(res));
        AsyncStorage.setItem('isLoggedInStatus', '1');
      });
    }
  };
  onNavigationStateChange = (navState) => {
    console.log('onNavigationStateChange');
    this.currentUrl = navState.url;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <WebView
          ref={this.myWebView}
          source={{
            uri: "https://hisably.com/app/",
            // headers: {
            //   Cookie: 'cookie1=asdf; cookie2=dfasdfdas',
            // },
          }}
          scalesPageToFit
          onMessage={this.handleMessage}
          useWebKit
          onLoadEnd={this.onLoadEnd}
          onNavigationStateChange={this.onNavigationStateChange}
          sharedCookiesEnabled
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.WebViewStyle}
          injectedJavaScript="window.postMessage(document.title)"
        />
      </SafeAreaView>
    );
  }

  handleMessage = (message) => {
    console.log('App received a message');
    console.log(message);
  };

  async provideMeSavedCookies() {
    try {
      let value = await AsyncStorage.getItem('savedCookies');
      if (value !== null) {
        return Promise.resolve(JSON.stringify(value));
      }
    } catch (error) {
      console.log('=====  checkIfWeHavePocStoredInSqLite =====');
      console.log(error);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  WebViewStyle: {
    flex: 1,
    resizeMode: 'cover',
  },
});
