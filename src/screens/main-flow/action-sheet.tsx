import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
// import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import { ActionSheetProps } from '../../models';
import LinearGradient from 'react-native-linear-gradient';
import { bottomSpace } from '../../utils/layout';
import {
  clamp,
  withSpring,
  onGestureEvent,
  timing as redashTiming,
} from 'react-native-redash';
import Animated, { Easing } from 'react-native-reanimated';
import { State, PanGestureHandler } from 'react-native-gesture-handler';
import sharedNavigationService from '../../services/navigation-service';
const {
  cond,
  set,
  clockRunning,
  not,
  Value,
  interpolate,
  useCode,
  block,
  eq,
  call,
} = Animated;

const ActionSheet = (props: ActionSheetProps) => {
  const { options } = props.route.params;

  let onPressed: () => void;
  const clock = new Animated.Clock();
  const actionSheetHeight =
    4 + 16 + 36 + options.length * (50 + 8) + 16 + bottomSpace();
  const SNAP_TOP = 0;
  const SNAP_BOTTOM = actionSheetHeight;
  const translationY = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const offset = new Value(SNAP_BOTTOM);
  const springConfig = {
    damping: 50,
    mass: 0.2,
    stiffness: 300,
    overshootClamping: false,
    restSpeedThreshold: 0.1,
    restDisplacementThreshold: 0.1,
  };
  const translateY = clamp(
    withSpring({
      value: translationY,
      velocity: velocityY,
      state,
      snapPoints: [SNAP_TOP, SNAP_BOTTOM],
      config: springConfig,
      offset,
      onSnap: val => {
        const offset = val[0];
        switch (offset) {
          case SNAP_BOTTOM:
            sharedNavigationService.goBack();
        }
      },
    }),
    SNAP_TOP,
    SNAP_BOTTOM,
  );
  const triggerShowActionSheet: Animated.Value<1 | 0> = new Value(0);
  const triggerDismissActionSheet: Animated.Value<1 | 0> = new Value(0);
  const gestureHandler = onGestureEvent({ translationY, velocityY, state });

  useCode(
    () =>
      block([
        cond(eq(triggerDismissActionSheet, new Value(1)), [
          set(
            offset,
            redashTiming({
              clock,
              duration: 200,
              from: offset,
              to: SNAP_BOTTOM,
              easing: Easing.ease,
            }),
          ),
          cond(
            not(clockRunning(clock)),
            block([
              set(triggerDismissActionSheet, 0),
              call([], () => {
                sharedNavigationService.goBack();
                onPressed && onPressed();
              }),
            ]),
          ),
        ]),
        cond(eq(triggerShowActionSheet, new Value(1)), [
          set(
            offset,
            redashTiming({
              clock,
              duration: 200,
              from: offset,
              to: SNAP_TOP,
              easing: Easing.ease,
            }),
          ),
          cond(
            not(clockRunning(clock)),
            block([set(triggerShowActionSheet, 0), call([], () => {})]),
          ),
        ]),
      ]),
    [],
  );

  useEffect(() => {
    // Show action sheet
    triggerShowActionSheet.setValue(1);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: interpolate(translateY, {
              inputRange: [SNAP_TOP, SNAP_BOTTOM],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => triggerDismissActionSheet.setValue(1)}
          style={styles.fill}
        />
      </Animated.View>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: translateY as any }],
            },
          ]}
        >
          <View style={styles.notchBar} />
          {options.map(actionButton => {
            const { onPress, title } = actionButton;
            let buttonStyle: StyleProp<ViewStyle> = styles.baseButtonStyle;
            let textStyle: StyleProp<TextStyle> = styles.baseTextStyle;
            let gradientColors = ['transparent', 'transparent'];

            switch (actionButton.buttonType) {
              case 'first':
                {
                  buttonStyle = { backgroundColor: colors.honeyYellow };
                  textStyle = { color: colors.white };
                  gradientColors = [colors.honeyOrange, colors.honeyYellow];
                }
                break;
              case 'second':
                {
                  buttonStyle = {
                    borderColor: colors.lightGray,
                    borderWidth: 2,
                  };
                  textStyle = { color: colors.offBlack };
                }
                break;
              case 'third':
                {
                  textStyle = { color: colors.offBlack };
                }
                break;
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  // Trigger animation before press
                  // onPress();
                  onPressed = onPress;
                  triggerDismissActionSheet.setValue(1);
                }}
              >
                <LinearGradient
                  style={[styles.baseButtonStyle, buttonStyle]}
                  start={{ x: 0, y: -5 }}
                  end={{ x: 1, y: 5 }}
                  colors={gradientColors}
                >
                  <HiveText
                    style={[styles.baseTextStyle, textStyle]}
                    variant={'bold'}
                  >
                    {title}
                  </HiveText>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: bottomSpace() + 16,
  },
  notchBar: {
    width: 65,
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 36,
    alignSelf: 'center',
  },
  baseButtonStyle: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  baseTextStyle: {
    fontSize: 20,
  },
});

export default ActionSheet;
