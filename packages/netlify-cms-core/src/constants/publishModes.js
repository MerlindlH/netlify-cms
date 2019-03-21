import { Map, OrderedMap, OrderedSet } from 'immutable';

// Create/edit workflow modes
export const SIMPLE = 'simple';
export const EDITORIAL_WORKFLOW = 'editorial_workflow';

const fallbackStatusList = OrderedSet(['draft', 'pending_review', 'pending_publish']);

const fallbackStatusObjects = OrderedMap({
  'draft': Map({ label:'Drafts', textColor:'purple', backgroundColor:'purpleLight', description:'Draft' }),
  'pending_review': Map({ label:'In Review', textColor:'brown', backgroundColor:'yellow', description:'Waiting for Review' }),
  'pending_publish': Map({ label:'Ready', textColor:'green', backgroundColor:'greenLight', description:'Waiting to go live' }),
});

// data gets parsed from config.yml and loaded with setImportedState (if there is data provided)
let importedStates = [];

function createStateList() {
  return OrderedSet(importedStates.map((elem) => elem.name));
}

//TODO provide descriptions if needed
function createStateObjects() {
  return OrderedMap(importedStates.reduce((accu, elem) => {
    accu[elem.name] = Map({
      label: `${elem.label}`,
      textColor: `${elem.color}`,
      backgroundColor: `${elem.color}` + 'Light',
      description: `To be finished`,
    });
    return accu;
  }, {}));
}

export let status = (() => {
  if(importedStates.length) {
    return createStateList();
  }
  return fallbackStatusList;
})();

export let statusObjects = (() => {
  if(importedStates.length) {
    return createStateObjects();
  }
  return fallbackStatusObjects;
})();

export const setImportedState = (newState) => {
  if (importedStates.length) return;

  importedStates = newState.map((entry) => entry.toJSON()).toArray();
  status = createStateList();
  statusObjects = createStateObjects();
};
