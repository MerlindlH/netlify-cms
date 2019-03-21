import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'react-emotion';
import { OrderedMap } from 'immutable';
import { translate } from 'react-polyglot';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownItem,
  StyledDropdownButton,
  Loader,
  lengths,
  components,
  shadows,
} from 'netlify-cms-ui-default';
import { createNewEntry } from 'Actions/collections';
import {
  loadUnpublishedEntries,
  updateUnpublishedEntryAssignee,
  updateUnpublishedEntryStatus,
  publishUnpublishedEntry,
  deleteUnpublishedEntry,
} from 'Actions/editorialWorkflow';
import { selectUnpublishedEntriesByStatus } from 'Reducers';
import { EDITORIAL_WORKFLOW, status } from 'Constants/publishModes';
import WorkflowList from './WorkflowList';

const WorkflowContainer = styled.div`
  padding: ${lengths.pageMargin} 0;
  height: 100vh;
`;

const WorkflowTop = styled.div`
  ${components.cardTop};
`;

const WorkflowTopRow = styled.div`
  display: flex;
  justify-content: space-between;

  span[role='button'] {
    ${shadows.dropDeep};
  }
`;

const WorkflowTopHeading = styled.h1`
  ${components.cardTopHeading};
`;

const WorkflowTopDescription = styled.p`
  ${components.cardTopDescription};
`;

class Workflow extends Component {
  static propTypes = {
    collections: ImmutablePropTypes.orderedMap,
    isEditorialWorkflow: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool,
    unpublishedEntries: ImmutablePropTypes.map,
    loadUnpublishedEntries: PropTypes.func.isRequired,
    updateUnpublishedEntryAssignee: PropTypes.func.isRequired,
    updateUnpublishedEntryStatus: PropTypes.func.isRequired,
    publishUnpublishedEntry: PropTypes.func.isRequired,
    deleteUnpublishedEntry: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    currentUserText: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { loadUnpublishedEntries, isEditorialWorkflow, collections } = this.props;
    if (isEditorialWorkflow) {
      loadUnpublishedEntries(collections);
    }
  }

  render() {
    const {
      isEditorialWorkflow,
      isFetching,
      unpublishedEntries,
      updateUnpublishedEntryAssignee,
      updateUnpublishedEntryStatus,
      publishUnpublishedEntry,
      deleteUnpublishedEntry,
      collections,
      t,
      currentUserText
    } = this.props;

    if (!isEditorialWorkflow) return null;
    if (isFetching) return <Loader active>{t('workflow.workflow.loading')}</Loader>;
    //TODO: change this texts to be generic...
    const reviewCount = unpublishedEntries.get("pending_review").size;
    const readyCount = unpublishedEntries.get('pending_publish').size;

    return (
      <WorkflowContainer>
        <WorkflowTop>
          <WorkflowTopRow>
            <WorkflowTopHeading>{t('workflow.workflow.workflowHeading')}</WorkflowTopHeading>
            <Dropdown
              dropdownWidth="160px"
              dropdownPosition="left"
              dropdownTopOverlap="40px"
              renderButton={() => (
                <StyledDropdownButton>{t('workflow.workflow.newPost')}</StyledDropdownButton>
              )}
            >
              {collections
                .filter(collection => collection.get('create'))
                .toList()
                .map(collection => (
                  <DropdownItem
                    key={collection.get('name')}
                    label={collection.get('label')}
                    onClick={() => createNewEntry(collection.get('name'))}
                  />
                ))}
            </Dropdown>
          </WorkflowTopRow>
          <WorkflowTopDescription>
            {t('workflow.workflow.description', {
              smart_count: reviewCount,
              readyCount: readyCount,
            })}
          </WorkflowTopDescription>
        </WorkflowTop>
        <WorkflowList
          entries={unpublishedEntries}
          handleChangeAssignee={updateUnpublishedEntryAssignee}
          handleChangeStatus={updateUnpublishedEntryStatus}
          handlePublish={publishUnpublishedEntry}
          handleDelete={deleteUnpublishedEntry}
          currentUserText={currentUserText}
        />
      </WorkflowContainer>
    );
  }
}

function mapStateToProps(state) {
  const { collections } = state;
  const isEditorialWorkflow = state.config.get('publish_mode') === EDITORIAL_WORKFLOW;
  const returnObj = { collections, isEditorialWorkflow };

  if (isEditorialWorkflow) {
    returnObj.isFetching = state.editorialWorkflow.getIn(['pages', 'isFetching'], false);
    let user = window.netlifyIdentity && window.netlifyIdentity.currentUser();
    //TODO maybe replace the fallback string
    returnObj.currentUserText = (user && user.user_metadata.full_name) || state.auth.getIn(['user','backendName']);

    /*
     * Generates an ordered Map of the available status as keys.
     * Each key containing a Sequence of available unpublished entries
     * Eg.: OrderedMap{'draft':Seq(), 'pending_review':Seq(), 'pending_publish':Seq()}
     */
    returnObj.unpublishedEntries = status.reduce((acc, currStatus) => {
      const entries = selectUnpublishedEntriesByStatus(state, currStatus);
      return acc.set(currStatus, entries);
    }, OrderedMap());
  }
  return returnObj;
}

export default connect(
  mapStateToProps,
  {
    loadUnpublishedEntries,
    updateUnpublishedEntryAssignee,
    updateUnpublishedEntryStatus,
    publishUnpublishedEntry,
    deleteUnpublishedEntry,
  },
)(translate()(Workflow));
