import React, { useState,useRef,useEffect } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, Button, Modal, KeyboardAvoidingView } from "react-native";

/* 
  transform = 변환이라는 의미
*/

/* 
 onStartShouldSetPanResponder = 터치에 반응할건지에 대한 함수 함수명 대로 panResponder 를 start 할때 set 해야한다 라고 이해
 onMoveShouldSetPanResponder = 터치에 반응할건지에 대한 함수 
 onPanResponderGrant = 터치 이벤트가 발생할때 실행
 onPanResponderMove = 터치 이벤트가 실행중 일때
 onPanResponderRelease = 터치 이벤트가 끝날때 실행 
 onPanResponderTerminate = 터치 이벤트가 끝날때 실행 

 dy : 제스쳐가 움직인 거리를 나타냄
*/

const SUPPORTED_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
];


const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpacity, setOpacity] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
  let animatedHeight = new Animated.Value(0)

  useEffect(() => {
    if(modalVisible) {
      Animated.timing(animatedHeight, {
        useNativeDriver: false,
        toValue: 400,
        duration: 300
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        useNativeDriver: false,
        toValue: 0
      }).start(() => {
        /* 
          여기서 pan.setValue 를 초기화 해주는 이유는
          onPanResponderRelease 함수에서 터치가 끝났을때 pan.y 의값이 그대로 저장되어있어
          그다음 모달이 올라오면 그저장된값에 위치되기때문에 부자연스럽다
        */
        pan.setValue({x: 0, y: 0});
        animatedHeight = new Animated.Value(0);

      })
    }
  },[modalVisible])
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, 
      onPanResponderMove: (e, gestureState) => {
          /* 
            이벤트가 발생하면 Animated.View 로 이벤트가 발생되며 dy 는 제스쳐 이동거리이기때문에 그 이동거리만큼 Animated.View 안에 자식 View 가 움직이게 된다
          */
         if(gestureState.dy > 0) {
           
           Animated.event([null, { dy: pan.y}], { useNativeDriver: false})(e, gestureState);

          }
          console.log(Number(gestureState.dy)/40)
      },
      onPanResponderRelease: (e, gestureState) => {
            if(500 / 4 - gestureState.dy < 0){
               setModalVisible(false);
            }else {
              
              Animated.spring(pan, {
                useNativeDriver: false,
                toValue: {x: 0, y: 0},
              }).start();
              
            }    
      }
    }) 
  ).current;

  return (
    <>
      <Modal
        transparent
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          behavior="padding"
          style={styles.wrapper}
        >
          <View style={styles.mask}/>

          <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getTranslateTransform(), styles.container, { height: animatedHeight}]}
            >
            
            <Text>안녕하세요~</Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      <Button title='start' onPress={() => {setModalVisible(true)}}/>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#00000077"
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: 0,
    overflow: "hidden"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 400,
    width: '100%',
    backgroundColor: "blue",
    borderRadius: 10
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#00000077"
  },
  mask: {
    flex: 1,
    backgroundColor: "transparent"
  },
  draggableContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  draggableIcon: {
    width: 35,
    height: 5,
    borderRadius: 5,
    margin: 10,
    backgroundColor: "#ccc"
  }
});
export default App;
