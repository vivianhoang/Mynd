import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import colors from '../../../utils/colors';
import { GoalTaskCreationProps } from '../../../models';
import sharedNavigationService from '../../../services/navigation-service';
import HiveText from '../../../componets/hive-text';
import BigButton from '../../../componets/big-button';
import * as _ from 'lodash';
import { bottomSpace, screenSize, topSpace } from '../../../utils/layout';
import {
  clamp,
  withSpring,
  onGestureEvent,
  timing as redashTiming,
} from 'react-native-redash';
import Animated, { Easing } from 'react-native-reanimated';
import { State, PanGestureHandler } from 'react-native-gesture-handler';
import { useMemoOne } from 'use-memo-one';
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

export default (props: GoalTaskCreationProps) => {
  const { onCreateTask } = props.route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const clock = new Animated.Clock();
  const modalHeight = 360;
  const SNAP_TOP = 0;
  const SNAP_BOTTOM = modalHeight + (screenSize.height - modalHeight) / 2;
  const translationY = useMemoOne(() => new Value(0), []);
  const velocityY = useMemoOne(() => new Value(0), []);
  const state = useMemoOne(() => new Value(State.UNDETERMINED), []);
  const offset = useMemoOne(() => new Value(SNAP_BOTTOM), []);
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
  const triggerShowModal: Animated.Value<1 | 0> = useMemoOne(
    () => new Value(0),
    [],
  );
  const triggerDismissModal: Animated.Value<1 | 0> = useMemoOne(
    () => new Value(0),
    [],
  );
  const gestureHandler = useMemoOne(
    () => onGestureEvent({ translationY, velocityY, state }),
    [],
  );

  useCode(
    () =>
      block([
        cond(eq(triggerDismissModal, new Value(1)), [
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
              set(triggerDismissModal, 0),
              call([], () => {
                sharedNavigationService.goBack();
              }),
            ]),
          ),
        ]),
        cond(eq(triggerShowModal, new Value(1)), [
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
            block([set(triggerShowModal, 0), call([], () => {})]),
          ),
        ]),
      ]),
    [],
  );

  useEffect(() => {
    // Show action sheet
    triggerShowModal.setValue(1);
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
          onPress={() => triggerDismissModal.setValue(1)}
          style={styles.fill}
        />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'position', android: undefined })}
      >
        <PanGestureHandler {...gestureHandler}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: translateY as any }],
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerButton} />
              <HiveText variant={'bold'} style={styles.headerLabel}>
                {'New Task'}
              </HiveText>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => triggerDismissModal.setValue(1)}
              >
                <Image
                  style={styles.headerButtonIcon}
                  resizeMode={'contain'}
                  source={require('../../../assets/close-icon.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <TextInput
                selectionColor={colors.salmonRed}
                placeholderTextColor={colors.lightPurple}
                style={styles.titleInput}
                autoFocus={true}
                placeholder={'Title'}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                selectionColor={colors.salmonRed}
                placeholderTextColor={colors.lightPurple}
                style={styles.descriptionInput}
                placeholder={'Describe task (Optional)'}
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />
              <BigButton
                title={'Done'}
                disabled={!_.trim(title)}
                onPress={() => {
                  onCreateTask({ title, description });
                  triggerDismissModal.setValue(1);
                }}
                style={styles.doneButton}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    flex: 1,
  },
  card: {
    height: 360,
    width: 310,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  headerButton: {
    width: 70,
    paddingRight: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    flex: 1,
    tintColor: colors.offBlack,
    height: 26,
    width: 26,
  },
  headerLabel: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
    flex: 1,
  },
  titleInput: {
    fontFamily: 'PulpDisplay-Bold',
    fontSize: 26,
    color: colors.offBlack,
    marginVertical: 8,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PulpDisplay-Regular',
    color: colors.offBlack,
  },
  doneButton: {
    borderRadius: 8,
    marginTop: 24,
  },
});
