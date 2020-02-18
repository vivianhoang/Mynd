import React from 'react';
import { TemplateSelectionProps } from '../../models';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ImageRequireSource,
  FlatList,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import NavButton from '../../componets/nav-button';
import colors from '../../utils/colors';
import { Icon } from 'react-native-vector-icons/Icon';
import HiveText from '../../componets/hive-text';
import { Templates, TemplateType } from '../../models';
import SearchBar from '../../componets/search-bar';

interface TemplateOption {
  type: TemplateType;
  title: string;
  description: string;
  image: ImageRequireSource;
}

const templates: TemplateOption[] = [
  {
    type: TemplateType.Idea,
    title: 'Ideas',
    description: 'You have great ideas!',
    image: require('../../assets/ideas-icon.png'),
  },
  {
    type: TemplateType.Todo,
    title: 'Todos',
    description: 'Create a checklist. This is a longer list of things.',
    image: require('../../assets/checklist-icon.png'),
  },
];

const TemplateCard = (props: {
  title: string;
  description: string;
  image: ImageRequireSource;
}) => {
  const { title, description, image } = props;

  return (
    <TouchableOpacity style={styles.templateOptionContainer} onPress={() => {}}>
      <View style={styles.labelsContainer}>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/plus-icon.png')}
            style={styles.addIcon}
          />
          <HiveText variant={'bold'} style={styles.titleLabel}>
            {title}
          </HiveText>
        </View>
        <HiveText style={styles.descriptionLabel}>{description}</HiveText>
      </View>
      <View style={styles.iconContainer}>
        <Image source={image} style={styles.templateIcon} />
      </View>
    </TouchableOpacity>
  );
};

export default (props: TemplateSelectionProps) => {
  return (
    <ImageBackground
      source={require('../../assets/templates_screen.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => sharedNavigationService.goBack()}
          >
            <Image
              source={require('../../assets/close-icon.png')}
              style={styles.closeIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 16 }}>
          <SearchBar placeholder={'Find a template'} />
        </View>
        <FlatList
          keyExtractor={option => option.title}
          data={templates}
          style={styles.contentContainer}
          renderItem={({ item }) => {
            const { image, title, description } = item;
            return (
              <TemplateCard
                image={image as any}
                title={title}
                description={description}
              />
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: 16,
  },
  topBar: {
    height: 44,
    // backgroundColor: colors.white,
    alignItems: 'flex-end',
  },
  background: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
  closeIcon: {
    flex: 1,
    width: 44,
    tintColor: colors.white,
  },
  templateOptionContainer: {
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 24,
    paddingRight: 20,
  },
  labelsContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    justifyContent: 'center',
    marginLeft: 4,
  },
  templateIcon: {
    height: 60,
    width: 60,
  },
  addIcon: {
    height: 32,
    width: 32,
  },
  titleLabel: {
    fontSize: 28,
    marginLeft: 12,
    bottom: 1,
  },
  descriptionLabel: {
    fontSize: 18,
  },
});
