import { Map, OrderedMap, OrderedSet } from 'immutable';

// Create/edit workflow modes
export const SIMPLE = 'simple';
export const EDITORIAL_WORKFLOW = 'editorial_workflow';

// Available status
export const statusOld = OrderedMap({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PENDING_PUBLISH: 'pending_publish',
});

const fallbackStatusList = OrderedSet(['draft', 'pending_review', 'pending_publish']);

const fallbackStatusObjects = OrderedMap({
  'draft': Map({ label:'Drafts', textColor:'purple', backgroundColor:'purpleLight', description:'Draft' }),
  'pending_review': Map({ label:'In Review', textColor:'brown', backgroundColor:'yellow', description:'Waiting for Review' }),
  'pending_publish': Map({ label:'Ready', textColor:'green', backgroundColor:'greenLight', description:'Waiting to go live' }),
});

//TODO: import data from config.yml e.g. over redux
const importedStates = (() => [{ label: "Draft", name: "draft", color: 'purple', order: 1 },
  { label: "In Review", name: "pending_review", color: 'blue', order: 1 },
  { label: "Copy Edit", name: "copyedit", color: 'teal', order: 1 },
  { label: "Blocked", name: "blocked", color: 'red',  order: 1 },
  { label: "Ready", name: "pending_publish", color: 'green',  order: 1 }])();

const statusList = (() => {
  //later on data gathered from config.yml / store object
  //console.log(store.getState().config.get(EDITORIAL_WORKFLOW).toJSON()); // comment to see how it works normally
  return OrderedSet(importedStates.map((elem) => elem.name));
})();

export const status = (() => {
  if(importedStates.length) {
    return statusList;
  }
  return fallbackStatusList;
})();

export const statusObjects = (() => {
  if(importedStates.length) {
    return OrderedMap(importedStates.reduce((accu, elem) => {
      accu[elem.name] = Map({
        label: `${elem.label}`,
        textColor: `${elem.color}`, backgroundColor: `${elem.color}` + 'Light', description: `To be finished`
      });
      return accu;
    }, {}));
  }
  return fallbackStatusObjects;
})();
