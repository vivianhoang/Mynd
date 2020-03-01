import React from 'react';
import {
  View,
  StyleSheet,
  ImageRequireSource,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import HiveText from '../../componets/hive-text';
import colors from '../../utils/colors';
import sharedAuthService from '../../services/auth-service';
import { topSpace } from '../../utils/layout';

type OptionAction = 'signout';

interface Option {
  title: string;
  description?: string;
  icon: ImageRequireSource;
  action: OptionAction;
}

const settingsOptions: Option[] = [
  {
    title: 'Sign Out',
    icon: require('../../assets/signout-icon.png'),
    action: 'signout',
  },
];

export default () => {
  const versionSection = () => {
    return (
      <View style={styles.versionSection}>
        <HiveText style={styles.versionLabel}>{'v1.0'}</HiveText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HiveText variant={'bold'} style={styles.titleLabel}>
        {'Settings'}
      </HiveText>
      <FlatList
        data={settingsOptions}
        keyExtractor={item => `${item.title}-${item.description}`}
        ListFooterComponent={versionSection}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const { title, description, icon, action } = item;
          return (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                switch (action) {
                  case 'signout':
                    sharedAuthService.logout();
                    break;
                  default:
                }
              }}
            >
              <View>
                <HiveText style={styles.optionTitleLabel}>{title}</HiveText>
                {description ? (
                  <HiveText style={styles.optionDescriptionLabel}>
                    {description}
                  </HiveText>
                ) : null}
              </View>
              <Image
                source={icon}
                style={styles.optionIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingTop: topSpace(),
  },
  titleLabel: {
    fontSize: 40,
    paddingTop: 24,
    paddingBottom: 16,
  },
  versionSection: {
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionLabel: {
    color: colors.lightGray,
  },
  optionRow: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitleLabel: {
    color: colors.offBlack,
    fontSize: 20,
  },
  optionDescriptionLabel: {
    fontSize: 16,
    color: colors.inactiveGray,
  },
  optionIcon: {
    height: 40,
    width: 40,
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
});
