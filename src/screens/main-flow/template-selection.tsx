import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ImageRequireSource,
  FlatList,
  SafeAreaView,
} from 'react-native';
import sharedNavigationService from '../../services/navigation-service';
import colors from '../../utils/colors';
import HiveText from '../../componets/hive-text';
import { TemplateType, NavigationActions } from '../../models';
import SearchBar from '../../componets/search-bar';
import _ from 'lodash';
import { topSpace } from '../../utils/layout';

interface TemplateOption {
  type: TemplateType;
  title: string;
  description: string;
  image: ImageRequireSource;
  pageAction: NavigationActions;
}

const templates: TemplateOption[] = [
  {
    type: 'Checklist',
    title: 'Checklists',
    description: 'Create a checklist. This is a longer list of things.',
    image: require('../../assets/checklist-icon.png'),
    pageAction: {
      page: 'ChecklistTemplate',
      props: {
        checklist: null,
      },
    },
  },
  {
    type: 'Idea',
    title: 'Ideas',
    description: 'You have great ideas!',
    image: require('../../assets/ideas-icon.png'),
    pageAction: {
      page: 'IdeaTemplate',
      props: {
        idea: null,
      },
    },
  },
];

const TemplateCard = (props: {
  title: string;
  description: string;
  image: ImageRequireSource;
  pageAction: NavigationActions;
}) => {
  const { title, description, image, pageAction } = props;

  return (
    <TouchableOpacity
      style={styles.templateOptionContainer}
      onPress={() => sharedNavigationService.navigate(pageAction)}
    >
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

export default () => {
  const [searchText, setSearchText] = useState('');

  const filterTemplates = () => {
    let data: TemplateOption[] = [];
    templates.filter(templateData => {
      if (
        _.includes(templateData.title.toLowerCase(), searchText.toLowerCase())
      ) {
        data.push(templateData);
      }
    });
    return data;
  };

  const resultsView =
    templates.length && !filterTemplates().length ? (
      <HiveText style={styles.noResultsLabel}>{'No results.'}</HiveText>
    ) : (
      <FlatList
        keyExtractor={option => option.title}
        keyboardDismissMode={'on-drag'}
        showsVerticalScrollIndicator={false}
        data={filterTemplates()}
        keyboardShouldPersistTaps={'handled'}
        style={styles.contentContainer}
        renderItem={({ item }) => {
          const { image, title, description, pageAction } = item;
          return (
            <TemplateCard
              image={image as any}
              title={title}
              description={description}
              pageAction={pageAction}
            />
          );
        }}
      />
    );

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
          <SearchBar
            placeholder={'Find a template'}
            value={searchText}
            onChangeText={(text: string) => setSearchText(text)}
            onDismiss={() => setSearchText('')}
          />
        </View>
        {resultsView}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    height: 44 + topSpace(),
    paddingTop: topSpace(),
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
    borderRadius: 10,
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
  noResultsLabel: {
    marginLeft: 8,
    fontSize: 18,
  },
});
